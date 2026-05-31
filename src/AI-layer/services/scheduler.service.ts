import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';
import { AutoEmbeddingService } from './auto-embedding.service';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    private prisma: PrismaService,
    private autoEmbeddingService: AutoEmbeddingService,
  ) {}

  /**
   * Daily sync - Check for content changes and update embeddings
   * Runs every day at 2 AM
   */
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async dailySync() {
    this.logger.log('Starting daily sync for embeddings');
    
    try {
      // Get all content that was updated in the last 24 hours
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      // Check for updated courses
      const updatedCourses = await this.prisma.course.findMany({
        where: {
          updatedAt: {
            gte: yesterday,
          },
        },
        select: { id: true, title: true },
      });

      // Lessons and challenges don't have updated timestamps in the current schema,
      // so we conservatively reprocess them daily.
      const updatedLessons = await this.prisma.lesson.findMany({
        select: { id: true, title: true },
      });

      const updatedChallenges = await this.prisma.challenge.findMany({
        select: { id: true, title: true },
      });

      // Check for updated resources
      const updatedResources = await this.prisma.courseResource.findMany({
        where: {
          updatedAt: {
            gte: yesterday,
          },
        },
        select: { id: true, title: true },
      });

      // Process updates
      const updates = [
        ...updatedCourses.map(c => ({ type: 'Course', id: c.id, title: c.title })),
        ...updatedLessons.map(l => ({ type: 'Lesson', id: l.id, title: l.title })),
        ...updatedChallenges.map(ch => ({ type: 'Challenge', id: ch.id, title: ch.title })),
        ...updatedResources.map(r => ({ type: 'CourseResource', id: r.id, title: r.title })),
      ];

      this.logger.log(`Found ${updates.length} items to update`);

      for (const update of updates) {
        try {
          await this.autoEmbeddingService.updateContentEmbedding(update.type, update.id);
          this.logger.log(`Updated embedding for ${update.type}:${update.id} - ${update.title}`);
        } catch (error) {
          this.logger.error(`Error updating ${update.type}:${update.id}:`, error);
        }
      }

      this.logger.log('Daily sync completed successfully');
    } catch (error) {
      this.logger.error('Error in daily sync:', error);
    }
  }

  /**
   * Weekly full sync - Complete re-indexing of all content
   * Runs every Sunday at 3 AM
   */
  @Cron('0 3 * * 0')
  async weeklyFullSync() {
    this.logger.log('Starting weekly full sync for embeddings');
    
    try {
      // Clear all existing embeddings
      await this.prisma.knowledgeBase.deleteMany({});
      this.logger.log('Cleared all existing embeddings');

      // Re-index all content
      const courses = await this.prisma.course.findMany({
        include: {
          modules: {
            include: {
              miniModules: {
                include: {
                  lessons: true,
                },
              },
            },
          },
          resources: true,
        },
      });

      const challenges = await this.prisma.challenge.findMany({
        include: {
          instructions: true,
          solutions: true,
        },
      });

      // Process all courses
      for (const course of courses) {
        try {
          await this.autoEmbeddingService.processNewCourse(course.id);
          this.logger.log(`Re-indexed course: ${course.title}`);
        } catch (error) {
          this.logger.error(`Error re-indexing course ${course.id}:`, error);
        }
      }

      // Process all challenges
      for (const challenge of challenges) {
        try {
          await this.autoEmbeddingService.processNewChallenge(challenge.id);
          this.logger.log(`Re-indexed challenge: ${challenge.title}`);
        } catch (error) {
          this.logger.error(`Error re-indexing challenge ${challenge.id}:`, error);
        }
      }

      this.logger.log('Weekly full sync completed successfully');
    } catch (error) {
      this.logger.error('Error in weekly full sync:', error);
    }
  }

  /**
   * Hourly health check - Verify embedding integrity
   * Runs every hour
   */
  @Cron(CronExpression.EVERY_HOUR)
  async hourlyHealthCheck() {
    this.logger.log('Starting hourly health check');
    
    try {
      // Check for content without embeddings
      const contentWithoutEmbeddings = await this.prisma.$queryRaw`
        SELECT 
          'Course' as type, id, title, updated_at
        FROM courses 
        WHERE id NOT IN (
          SELECT source_id FROM knowledge_base 
          WHERE source_type = 'Course'
        )
        UNION ALL
        SELECT 
          'Lesson' as type, id, title, updated_at
        FROM lessons 
        WHERE id NOT IN (
          SELECT source_id FROM knowledge_base 
          WHERE source_type = 'Lesson'
        )
        UNION ALL
        SELECT 
          'Challenge' as type, id, title, updated_at
        FROM challenges 
        WHERE id NOT IN (
          SELECT source_id FROM knowledge_base 
          WHERE source_type = 'Challenge'
        )
        UNION ALL
        SELECT 
          'CourseResource' as type, id, title, updated_at
        FROM course_resources 
        WHERE id NOT IN (
          SELECT source_id FROM knowledge_base 
          WHERE source_type = 'CourseResource'
        )
      `;

      if (Array.isArray(contentWithoutEmbeddings) && contentWithoutEmbeddings.length > 0) {
        this.logger.warn(`Found ${contentWithoutEmbeddings.length} items without embeddings`);
        
        // Process missing embeddings
        for (const item of contentWithoutEmbeddings as any[]) {
          try {
            await this.autoEmbeddingService.processNewContent(item.type, item.id);
            this.logger.log(`Created missing embedding for ${item.type}:${item.id}`);
          } catch (error) {
            this.logger.error(`Error creating missing embedding for ${item.type}:${item.id}:`, error);
          }
        }
      }

      // Check embedding quality
      const embeddingStats = await this.prisma.knowledgeBase.aggregate({
        _count: {
          id: true,
        },
        _avg: {
          id: true,
        },
      });

      this.logger.log(`Health check completed - Total embeddings: ${embeddingStats._count.id}`);
    } catch (error) {
      this.logger.error('Error in hourly health check:', error);
    }
  }

  /**
   * Monthly cleanup - Remove orphaned embeddings
   * Runs on the 1st of every month at 4 AM
   */
  @Cron('0 4 1 * *')
  async monthlyCleanup() {
    this.logger.log('Starting monthly cleanup');
    
    try {
      // Find orphaned embeddings
      const orphanedEmbeddings = await this.prisma.$queryRaw`
        SELECT kb.id, kb.source_type, kb.source_id
        FROM knowledge_base kb
        WHERE 
          (kb.source_type = 'Course' AND kb.source_id NOT IN (SELECT id FROM courses))
          OR (kb.source_type = 'Lesson' AND kb.source_id NOT IN (SELECT id FROM lessons))
          OR (kb.source_type = 'Challenge' AND kb.source_id NOT IN (SELECT id FROM challenges))
          OR (kb.source_type = 'CourseResource' AND kb.source_id NOT IN (SELECT id FROM course_resources))
          OR (kb.source_type = 'CourseModule' AND kb.source_id NOT IN (SELECT id FROM course_modules))
          OR (kb.source_type = 'MiniModule' AND kb.source_id NOT IN (SELECT id FROM mini_modules))
      `;

      if (Array.isArray(orphanedEmbeddings) && orphanedEmbeddings.length > 0) {
        this.logger.log(`Found ${orphanedEmbeddings.length} orphaned embeddings`);
        
        // Delete orphaned embeddings
        for (const orphan of orphanedEmbeddings as any[]) {
          try {
            await this.prisma.knowledgeBase.delete({
              where: { id: orphan.id },
            });
            this.logger.log(`Deleted orphaned embedding: ${orphan.source_type}:${orphan.source_id}`);
          } catch (error) {
            this.logger.error(`Error deleting orphaned embedding ${orphan.id}:`, error);
          }
        }
      }

      this.logger.log('Monthly cleanup completed successfully');
    } catch (error) {
      this.logger.error('Error in monthly cleanup:', error);
    }
  }

  /**
   * Manual trigger for immediate sync
   */
  async triggerImmediateSync() {
    this.logger.log('Triggering immediate sync');
    
    try {
      await this.dailySync();
      this.logger.log('Immediate sync completed');
    } catch (error) {
      this.logger.error('Error in immediate sync:', error);
      throw error;
    }
  }

  /**
   * Get scheduler statistics
   */
  async getSchedulerStats() {
    try {
      const stats = await this.prisma.knowledgeBase.aggregate({
        _count: {
          id: true,
        },
        _min: {
          createdAt: true,
        },
        _max: {
          updatedAt: true,
        },
      });

      return {
        totalEmbeddings: stats._count.id,
        oldestEmbedding: stats._min.createdAt,
        newestEmbedding: stats._max.updatedAt,
        lastSync: new Date(),
      };
    } catch (error) {
      this.logger.error('Error getting scheduler stats:', error);
      throw error;
    }
  }
}
