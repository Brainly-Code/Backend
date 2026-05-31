import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AutoEmbeddingService } from './auto-embedding.service';

@Injectable()
export class DatabaseHooksService {
  private readonly logger = new Logger(DatabaseHooksService.name);

  constructor(
    private prisma: PrismaService,
    private autoEmbeddingService: AutoEmbeddingService
  ) {
    this.setupDatabaseHooks();
  }

  /**
   * Setup database hooks for automatic embedding generation
   */
  private setupDatabaseHooks() {
    this.logger.log('Setting up database hooks for automatic embedding generation');
    
    // Note: In a production environment, you might want to use:
    // 1. Database triggers (PostgreSQL)
    // 2. Prisma middleware
    // 3. Event-driven architecture with message queues
    // 4. Webhook system
    
    this.setupPrismaMiddleware();
  }

  /**
   * Setup Prisma middleware to intercept database operations
   */
  private setupPrismaMiddleware() {
    type PrismaMiddleware = (params: any, next: (params: any) => Promise<any>) => Promise<any>;
    const prismaAny = this.prisma as { $use?: (middleware: PrismaMiddleware) => void };

    if (typeof prismaAny.$use !== 'function') {
      this.logger.warn('Prisma middleware is not available; skipping automatic embedding hooks.');
      return;
    }

    // Course operations
    prismaAny.$use(async (params, next) => {
      const result = await next(params);
      
      if (params.model === 'Course') {
        await this.handleCourseOperation(params.action, result);
      } else if (params.model === 'Lesson') {
        await this.handleLessonOperation(params.action, result);
      } else if (params.model === 'Challenge') {
        await this.handleChallengeOperation(params.action, result);
      } else if (params.model === 'CourseResource') {
        await this.handleResourceOperation(params.action, result);
      } else if (params.model === 'CourseModule') {
        await this.handleModuleOperation(params.action, result);
      } else if (params.model === 'MiniModule') {
        await this.handleMiniModuleOperation(params.action, result);
      }
      
      return result;
    });
  }

  /**
   * Handle course operations
   */
  private async handleCourseOperation(action: string, result: any) {
    try {
      if (action === 'create') {
        this.logger.log(`New course created: ${result.id}`);
        await this.autoEmbeddingService.processNewCourse(result.id);
      } else if (action === 'update') {
        this.logger.log(`Course updated: ${result.id}`);
        await this.autoEmbeddingService.updateContentEmbedding('Course', result.id);
      } else if (action === 'delete') {
        this.logger.log(`Course deleted: ${result.id}`);
        await this.autoEmbeddingService.deleteContentEmbedding('Course', result.id);
      }
    } catch (error) {
      this.logger.error(`Error handling course operation:`, error);
    }
  }

  /**
   * Handle lesson operations
   */
  private async handleLessonOperation(action: string, result: any) {
    try {
      if (action === 'create') {
        this.logger.log(`New lesson created: ${result.id}`);
        await this.autoEmbeddingService.processNewLesson(result.id);
      } else if (action === 'update') {
        this.logger.log(`Lesson updated: ${result.id}`);
        await this.autoEmbeddingService.updateContentEmbedding('Lesson', result.id);
      } else if (action === 'delete') {
        this.logger.log(`Lesson deleted: ${result.id}`);
        await this.autoEmbeddingService.deleteContentEmbedding('Lesson', result.id);
      }
    } catch (error) {
      this.logger.error(`Error handling lesson operation:`, error);
    }
  }

  /**
   * Handle challenge operations
   */
  private async handleChallengeOperation(action: string, result: any) {
    try {
      if (action === 'create') {
        this.logger.log(`New challenge created: ${result.id}`);
        await this.autoEmbeddingService.processNewChallenge(result.id);
      } else if (action === 'update') {
        this.logger.log(`Challenge updated: ${result.id}`);
        await this.autoEmbeddingService.updateContentEmbedding('Challenge', result.id);
      } else if (action === 'delete') {
        this.logger.log(`Challenge deleted: ${result.id}`);
        await this.autoEmbeddingService.deleteContentEmbedding('Challenge', result.id);
      }
    } catch (error) {
      this.logger.error(`Error handling challenge operation:`, error);
    }
  }

  /**
   * Handle resource operations
   */
  private async handleResourceOperation(action: string, result: any) {
    try {
      if (action === 'create') {
        this.logger.log(`New resource created: ${result.id}`);
        await this.autoEmbeddingService.processNewResource(result.id);
      } else if (action === 'update') {
        this.logger.log(`Resource updated: ${result.id}`);
        await this.autoEmbeddingService.updateContentEmbedding('CourseResource', result.id);
      } else if (action === 'delete') {
        this.logger.log(`Resource deleted: ${result.id}`);
        await this.autoEmbeddingService.deleteContentEmbedding('CourseResource', result.id);
      }
    } catch (error) {
      this.logger.error(`Error handling resource operation:`, error);
    }
  }

  /**
   * Handle module operations
   */
  private async handleModuleOperation(action: string, result: any) {
    try {
      if (action === 'create') {
        this.logger.log(`New module created: ${result.id}`);
        await this.autoEmbeddingService.processNewModule(result.id);
      } else if (action === 'update') {
        this.logger.log(`Module updated: ${result.id}`);
        await this.autoEmbeddingService.updateContentEmbedding('CourseModule', result.id);
      } else if (action === 'delete') {
        this.logger.log(`Module deleted: ${result.id}`);
        await this.autoEmbeddingService.deleteContentEmbedding('CourseModule', result.id);
      }
    } catch (error) {
      this.logger.error(`Error handling module operation:`, error);
    }
  }

  /**
   * Handle mini-module operations
   */
  private async handleMiniModuleOperation(action: string, result: any) {
    try {
      if (action === 'create') {
        this.logger.log(`New mini-module created: ${result.id}`);
        await this.autoEmbeddingService.processNewMiniModule(result.id);
      } else if (action === 'update') {
        this.logger.log(`Mini-module updated: ${result.id}`);
        await this.autoEmbeddingService.updateContentEmbedding('MiniModule', result.id);
      } else if (action === 'delete') {
        this.logger.log(`Mini-module deleted: ${result.id}`);
        await this.autoEmbeddingService.deleteContentEmbedding('MiniModule', result.id);
      }
    } catch (error) {
      this.logger.error(`Error handling mini-module operation:`, error);
    }
  }

  /**
   * Manual trigger for content processing
   */
  async triggerContentProcessing(type: string, id: number, action: 'create' | 'update' | 'delete') {
    try {
      this.logger.log(`Manually triggering ${action} for ${type}:${id}`);
      
      switch (action) {
        case 'create':
          await this.autoEmbeddingService.processNewContent(type, id);
          break;
        case 'update':
          await this.autoEmbeddingService.updateContentEmbedding(type, id);
          break;
        case 'delete':
          await this.autoEmbeddingService.deleteContentEmbedding(type, id);
          break;
      }
      
      this.logger.log(`Successfully processed ${action} for ${type}:${id}`);
    } catch (error) {
      this.logger.error(`Error manually triggering ${action} for ${type}:${id}:`, error);
      throw error;
    }
  }

  /**
   * Get processing status
   */
  async getProcessingStatus() {
    try {
      const stats = await this.prisma.knowledgeBase.groupBy({
        by: ['type'],
        _count: {
          id: true,
        },
      });

      return {
        totalItems: await this.prisma.knowledgeBase.count(),
        byType: stats,
        lastUpdated: new Date(),
      };
    } catch (error) {
      this.logger.error('Error getting processing status:', error);
      throw error;
    }
  }
}
