import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AutoEmbeddingService } from './auto-embedding.service';
import { WebhookService } from './webhook.service';

export interface SyncStatus {
  totalItems: number;
  processedItems: number;
  failedItems: number;
  lastSync: Date;
  isRunning: boolean;
}

@Injectable()
export class ContentSyncService {
  private readonly logger = new Logger(ContentSyncService.name);
  private syncStatus: SyncStatus = {
    totalItems: 0,
    processedItems: 0,
    failedItems: 0,
    lastSync: new Date(),
    isRunning: false,
  };

  constructor(
    private prisma: PrismaService,
    private autoEmbeddingService: AutoEmbeddingService,
    private webhookService: WebhookService
  ) {}

  /**
   * Sync all content types
   */
  async syncAllContent() {
    if (this.syncStatus.isRunning) {
      this.logger.warn('Sync already running, skipping');
      return;
    }

    this.syncStatus.isRunning = true;
    this.syncStatus.totalItems = 0;
    this.syncStatus.processedItems = 0;
    this.syncStatus.failedItems = 0;

    try {
      this.logger.log('Starting full content sync');

      // Sync courses
      await this.syncCourses();
      
      // Sync lessons
      await this.syncLessons();
      
      // Sync challenges
      await this.syncChallenges();
      
      // Sync resources
      await this.syncResources();
      
      // Sync modules
      await this.syncModules();
      
      // Sync mini-modules
      await this.syncMiniModules();

      this.syncStatus.lastSync = new Date();
      this.logger.log(`Content sync completed: ${this.syncStatus.processedItems}/${this.syncStatus.totalItems} items processed`);
    } catch (error) {
      this.logger.error('Error in content sync:', error);
      throw error;
    } finally {
      this.syncStatus.isRunning = false;
    }
  }

  /**
   * Sync courses
   */
  private async syncCourses() {
    try {
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

      this.syncStatus.totalItems += courses.length;

      for (const course of courses) {
        try {
          // Check if embedding exists
          const existingEmbedding = await this.prisma.knowledgeBase.findFirst({
            where: {
              sourceType: 'Course',
              sourceId: course.id,
            },
          });

          if (!existingEmbedding) {
            await this.autoEmbeddingService.processNewCourse(course.id);
            this.logger.log(`Synced course: ${course.title}`);
          } else {
            this.logger.log(`Course already synced: ${course.title}`);
          }

          this.syncStatus.processedItems++;
        } catch (error) {
          this.logger.error(`Error syncing course ${course.id}:`, error);
          this.syncStatus.failedItems++;
        }
      }
    } catch (error) {
      this.logger.error('Error syncing courses:', error);
    }
  }

  /**
   * Sync lessons
   */
  private async syncLessons() {
    try {
      const lessons = await this.prisma.lesson.findMany({
        include: {
          miniModule: {
            include: {
              courseModule: {
                include: {
                  course: true,
                },
              },
            },
          },
        },
      });

      this.syncStatus.totalItems += lessons.length;

      for (const lesson of lessons) {
        try {
          const existingEmbedding = await this.prisma.knowledgeBase.findFirst({
            where: {
              sourceType: 'Lesson',
              sourceId: lesson.id,
            },
          });

          if (!existingEmbedding) {
            await this.autoEmbeddingService.processNewLesson(lesson.id);
            this.logger.log(`Synced lesson: ${lesson.title}`);
          } else {
            this.logger.log(`Lesson already synced: ${lesson.title}`);
          }

          this.syncStatus.processedItems++;
        } catch (error) {
          this.logger.error(`Error syncing lesson ${lesson.id}:`, error);
          this.syncStatus.failedItems++;
        }
      }
    } catch (error) {
      this.logger.error('Error syncing lessons:', error);
    }
  }

  /**
   * Sync challenges
   */
  private async syncChallenges() {
    try {
      const challenges = await this.prisma.challenge.findMany({
        include: {
          instructions: true,
          solutions: true,
        },
      });

      this.syncStatus.totalItems += challenges.length;

      for (const challenge of challenges) {
        try {
          const existingEmbedding = await this.prisma.knowledgeBase.findFirst({
            where: {
              sourceType: 'Challenge',
              sourceId: challenge.id,
            },
          });

          if (!existingEmbedding) {
            await this.autoEmbeddingService.processNewChallenge(challenge.id);
            this.logger.log(`Synced challenge: ${challenge.title}`);
          } else {
            this.logger.log(`Challenge already synced: ${challenge.title}`);
          }

          this.syncStatus.processedItems++;
        } catch (error) {
          this.logger.error(`Error syncing challenge ${challenge.id}:`, error);
          this.syncStatus.failedItems++;
        }
      }
    } catch (error) {
      this.logger.error('Error syncing challenges:', error);
    }
  }

  /**
   * Sync resources
   */
  private async syncResources() {
    try {
      const resources = await this.prisma.courseResource.findMany({
        include: {
          course: true,
        },
      });

      this.syncStatus.totalItems += resources.length;

      for (const resource of resources) {
        try {
          const existingEmbedding = await this.prisma.knowledgeBase.findFirst({
            where: {
              sourceType: 'CourseResource',
              sourceId: resource.id,
            },
          });

          if (!existingEmbedding) {
            await this.autoEmbeddingService.processNewResource(resource.id);
            this.logger.log(`Synced resource: ${resource.title}`);
          } else {
            this.logger.log(`Resource already synced: ${resource.title}`);
          }

          this.syncStatus.processedItems++;
        } catch (error) {
          this.logger.error(`Error syncing resource ${resource.id}:`, error);
          this.syncStatus.failedItems++;
        }
      }
    } catch (error) {
      this.logger.error('Error syncing resources:', error);
    }
  }

  /**
   * Sync modules
   */
  private async syncModules() {
    try {
      const modules = await this.prisma.courseModule.findMany({
        include: {
          course: true,
        },
      });

      this.syncStatus.totalItems += modules.length;

      for (const module of modules) {
        try {
          const existingEmbedding = await this.prisma.knowledgeBase.findFirst({
            where: {
              sourceType: 'CourseModule',
              sourceId: module.id,
            },
          });

          if (!existingEmbedding) {
            await this.autoEmbeddingService.processNewModule(module.id);
            this.logger.log(`Synced module: ${module.title}`);
          } else {
            this.logger.log(`Module already synced: ${module.title}`);
          }

          this.syncStatus.processedItems++;
        } catch (error) {
          this.logger.error(`Error syncing module ${module.id}:`, error);
          this.syncStatus.failedItems++;
        }
      }
    } catch (error) {
      this.logger.error('Error syncing modules:', error);
    }
  }

  /**
   * Sync mini-modules
   */
  private async syncMiniModules() {
    try {
      const miniModules = await this.prisma.miniModule.findMany({
        include: {
          courseModule: {
            include: {
              course: true,
            },
          },
        },
      });

      this.syncStatus.totalItems += miniModules.length;

      for (const miniModule of miniModules) {
        try {
          const existingEmbedding = await this.prisma.knowledgeBase.findFirst({
            where: {
              sourceType: 'MiniModule',
              sourceId: miniModule.id,
            },
          });

          if (!existingEmbedding) {
            await this.autoEmbeddingService.processNewMiniModule(miniModule.id);
            this.logger.log(`Synced mini-module: ${miniModule.title}`);
          } else {
            this.logger.log(`Mini-module already synced: ${miniModule.title}`);
          }

          this.syncStatus.processedItems++;
        } catch (error) {
          this.logger.error(`Error syncing mini-module ${miniModule.id}:`, error);
          this.syncStatus.failedItems++;
        }
      }
    } catch (error) {
      this.logger.error('Error syncing mini-modules:', error);
    }
  }

  /**
   * Sync specific content type
   */
  async syncContentType(type: string) {
    this.logger.log(`Syncing content type: ${type}`);
    
    try {
      switch (type) {
        case 'Course':
          await this.syncCourses();
          break;
        case 'Lesson':
          await this.syncLessons();
          break;
        case 'Challenge':
          await this.syncChallenges();
          break;
        case 'CourseResource':
          await this.syncResources();
          break;
        case 'CourseModule':
          await this.syncModules();
          break;
        case 'MiniModule':
          await this.syncMiniModules();
          break;
        default:
          throw new Error(`Unknown content type: ${type}`);
      }
    } catch (error) {
      this.logger.error(`Error syncing content type ${type}:`, error);
      throw error;
    }
  }

  /**
   * Get sync status
   */
  getSyncStatus(): SyncStatus {
    return { ...this.syncStatus };
  }

  /**
   * Reset sync status
   */
  resetSyncStatus() {
    this.syncStatus = {
      totalItems: 0,
      processedItems: 0,
      failedItems: 0,
      lastSync: new Date(),
      isRunning: false,
    };
  }

  /**
   * Get content statistics
   */
  async getContentStats() {
    try {
      const stats = await this.prisma.knowledgeBase.groupBy({
        by: ['type'],
        _count: {
          id: true,
        },
      });

      const totalContent = await this.prisma.knowledgeBase.count();

      return {
        totalEmbeddings: totalContent,
        byType: stats,
        syncStatus: this.syncStatus,
      };
    } catch (error) {
      this.logger.error('Error getting content stats:', error);
      throw error;
    }
  }
}
