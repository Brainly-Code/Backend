import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
// import { EmbeddingsService } from './embeddings.service';

@Injectable()
export class AutoEmbeddingService {
  private readonly logger = new Logger(AutoEmbeddingService.name);

  constructor(
    private prisma: PrismaService,
    // private embeddingsService: EmbeddingsService
  ) {}

  /**
   * Automatically process new course content
   */
  async processNewCourse(courseId: number) {
    try {
      this.logger.log(`Processing new course: ${courseId}`);
      
      const course = await this.prisma.course.findUnique({
        where: { id: courseId },
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

      if (!course) {
        this.logger.warn(`Course ${courseId} not found`);
        return;
      }

      // Process main course
      // await this.embeddingsService.storeContentWithEmbedding(
      //   course.title,
      //   `${course.description}\n\nCategory: ${course.category}\nLevel: ${course.level}\nDuration: ${course.duration}`,
      //   'course',
      //   course.id,
      //   'Course',
      //   {
      //     category: course.category,
      //     level: course.level,
      //     duration: course.duration,
      //     studentsCount: course.studentsCount,
      //     rating: course.rating,
      //   }
      // );

      // Process course modules and lessons
      for (const module of course.modules) {
        await this.processNewModule(module.id);
      }

      // Process course resources
      for (const resource of course.resources) {
        await this.processNewResource(resource.id);
      }

      this.logger.log(`Successfully processed course: ${courseId}`);
    } catch (error) {
      this.logger.error(`Error processing course ${courseId}:`, error);
    }
  }

  /**
   * Automatically process new module content
   */
  async processNewModule(moduleId: number) {
    try {
      this.logger.log(`Processing new module: ${moduleId}`);
      
      const module = await this.prisma.courseModule.findUnique({
        where: { id: moduleId },
        include: {
          course: true,
          miniModules: {
            include: {
              lessons: true,
            },
          },
        },
      });

      if (!module) {
        this.logger.warn(`Module ${moduleId} not found`);
        return;
      }

      // Process module
      // await this.embeddingsService.storeContentWithEmbedding(
      //   module.title,
      //   `Module: ${module.title}\nCourse: ${module.course.title}`,
      //   'module',
      //   module.id,
      //   'CourseModule',
      //   {
      //     courseId: module.courseId,
      //     courseTitle: module.course.title,
      //     number: module.number,
      //   }
      // );

      // Process mini-modules and lessons
      for (const miniModule of module.miniModules) {
        await this.processNewMiniModule(miniModule.id);
      }

      this.logger.log(`Successfully processed module: ${moduleId}`);
    } catch (error) {
      this.logger.error(`Error processing module ${moduleId}:`, error);
    }
  }

  /**
   * Automatically process new mini-module content
   */
  async processNewMiniModule(miniModuleId: number) {
    try {
      this.logger.log(`Processing new mini-module: ${miniModuleId}`);
      
      const miniModule = await this.prisma.miniModule.findUnique({
        where: { id: miniModuleId },
        include: {
          courseModule: {
            include: {
              course: true,
            },
          },
          lessons: true,
        },
      });

      if (!miniModule) {
        this.logger.warn(`Mini-module ${miniModuleId} not found`);
        return;
      }

      // Process mini-module
      // await this.embeddingsService.storeContentWithEmbedding(
      //   miniModule.title,
      //   `Mini-module: ${miniModule.title}\nCourse: ${miniModule.courseModule.course.title}`,
      //   'mini-module',
      //   miniModule.id,
      //   'MiniModule',
      //   {
      //     courseId: miniModule.courseModule.courseId,
      //     courseTitle: miniModule.courseModule.course.title,
      //     moduleTitle: miniModule.courseModule.title,
      //     number: miniModule.number,
      //   }
      // );

      // Process lessons
      for (const lesson of miniModule.lessons) {
        await this.processNewLesson(lesson.id);
      }

      this.logger.log(`Successfully processed mini-module: ${miniModuleId}`);
    } catch (error) {
      this.logger.error(`Error processing mini-module ${miniModuleId}:`, error);
    }
  }

  /**
   * Automatically process new lesson content
   */
  async processNewLesson(lessonId: number) {
    try {
      this.logger.log(`Processing new lesson: ${lessonId}`);
      
      const lesson = await this.prisma.lesson.findUnique({
        where: { id: lessonId },
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

      if (!lesson) {
        this.logger.warn(`Lesson ${lessonId} not found`);
        return;
      }

      const content = `${lesson.explanation}\n\nExample: ${lesson.example || ''}\n\nNote: ${lesson.note || ''}\n\nAssignment: ${lesson.assignment}`;

      // await this.embeddingsService.storeContentWithEmbedding(
      //   lesson.title,
      //   content,
      //   'lesson',
      //   lesson.id,
      //   'Lesson',
      //   {
      //     courseId: lesson.miniModule.courseModule.courseId,
      //     courseTitle: lesson.miniModule.courseModule.course.title,
      //     moduleTitle: lesson.miniModule.courseModule.title,
      //     miniModuleTitle: lesson.miniModule.title,
      //     number: lesson.number,
      //   }
      // );

      this.logger.log(`Successfully processed lesson: ${lessonId}`);
    } catch (error) {
      this.logger.error(`Error processing lesson ${lessonId}:`, error);
    }
  }

  /**
   * Automatically process new challenge content
   */
  async processNewChallenge(challengeId: number) {
    try {
      this.logger.log(`Processing new challenge: ${challengeId}`);
      
      const challenge = await this.prisma.challenge.findUnique({
        where: { id: challengeId },
        include: {
          instructions: true,
          solutions: true,
        },
      });

      if (!challenge) {
        this.logger.warn(`Challenge ${challengeId} not found`);
        return;
      }

      const instructions = challenge.instructions
        .map(inst => `${inst.number}. ${inst.instruction}`)
        .join('\n');

      const content = `${challenge.description}\n\nDifficulty: ${challenge.difficulty}\nDuration: ${challenge.duration}\n\nInstructions:\n${instructions}`;

      // await this.embeddingsService.storeContentWithEmbedding(
      //   challenge.title,
      //   content,
      //   'challenge',
      //   challenge.id,
      //   'Challenge',
      //   {
      //     difficulty: challenge.difficulty,
      //     duration: challenge.duration,
      //     relation: challenge.relation,
      //     useEditor: challenge.useEditor,
      //     useInput: challenge.useInput,
      //   }
      // );

      this.logger.log(`Successfully processed challenge: ${challengeId}`);
    } catch (error) {
      this.logger.error(`Error processing challenge ${challengeId}:`, error);
    }
  }

  /**
   * Automatically process new resource content
   */
  async processNewResource(resourceId: number) {
    try {
      this.logger.log(`Processing new resource: ${resourceId}`);
      
      const resource = await this.prisma.courseResource.findUnique({
        where: { id: resourceId },
        include: {
          course: true,
        },
      });

      if (!resource) {
        this.logger.warn(`Resource ${resourceId} not found`);
        return;
      }

      const content = `Resource: ${resource.title}\nType: ${resource.type}\nURL: ${resource.url}`;

      // await this.embeddingsService.storeContentWithEmbedding(
      //   resource.title,
      //   content,
      //   'resource',
      //   resource.id,
      //   'CourseResource',
      //   {
      //     courseId: resource.courseId,
      //     courseTitle: resource.course.title,
      //     type: resource.type,
      //     url: resource.url,
      //     number: resource.number,
      //   }
      // );

      this.logger.log(`Successfully processed resource: ${resourceId}`);
    } catch (error) {
      this.logger.error(`Error processing resource ${resourceId}:`, error);
    }
  }

  /**
   * Update existing content embeddings
   */
  async updateContentEmbedding(sourceType: string, sourceId: number) {
    try {
      this.logger.log(`Updating embedding for ${sourceType}:${sourceId}`);
      
      // Remove old embeddings
      await this.prisma.knowledgeBase.deleteMany({
        where: {
          sourceType,
          sourceId,
        },
      });

      // Re-process based on type
      switch (sourceType) {
        case 'Course':
          await this.processNewCourse(sourceId);
          break;
        case 'CourseModule':
          await this.processNewModule(sourceId);
          break;
        case 'MiniModule':
          await this.processNewMiniModule(sourceId);
          break;
        case 'Lesson':
          await this.processNewLesson(sourceId);
          break;
        case 'Challenge':
          await this.processNewChallenge(sourceId);
          break;
        case 'CourseResource':
          await this.processNewResource(sourceId);
          break;
        default:
          this.logger.warn(`Unknown source type: ${sourceType}`);
      }

      this.logger.log(`Successfully updated embedding for ${sourceType}:${sourceId}`);
    } catch (error) {
      this.logger.error(`Error updating embedding for ${sourceType}:${sourceId}:`, error);
    }
  }

  /**
   * Delete content embeddings
   */
  async deleteContentEmbedding(sourceType: string, sourceId: number) {
    try {
      this.logger.log(`Deleting embedding for ${sourceType}:${sourceId}`);
      
      await this.prisma.knowledgeBase.deleteMany({
        where: {
          sourceType,
          sourceId,
        },
      });

      this.logger.log(`Successfully deleted embedding for ${sourceType}:${sourceId}`);
    } catch (error) {
      this.logger.error(`Error deleting embedding for ${sourceType}:${sourceId}:`, error);
    }
  }

  /**
   * Batch process multiple content items
   */
  async batchProcessContent(items: Array<{
    type: string;
    id: number;
    action: 'create' | 'update' | 'delete';
  }>) {
    const results: Array<{
      success: boolean;
      item: { type: string; id: number; action: 'create' | 'update' | 'delete' };
      error?: string;
    }> = [];
    
    for (const item of items) {
      try {
        switch (item.action) {
          case 'create':
            await this.processNewContent(item.type, item.id);
            break;
          case 'update':
            await this.updateContentEmbedding(item.type, item.id);
            break;
          case 'delete':
            await this.deleteContentEmbedding(item.type, item.id);
            break;
        }
        results.push({ success: true, item });
      } catch (error) {
        this.logger.error(`Error processing ${item.type}:${item.id}:`, error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        results.push({ success: false, item, error: message });
      }
    }
    
    return results;
  }

  /**
   * Process new content based on type
   */
  async processNewContent(type: string, id: number) {
    switch (type) {
      case 'Course':
        await this.processNewCourse(id);
        break;
      case 'CourseModule':
        await this.processNewModule(id);
        break;
      case 'MiniModule':
        await this.processNewMiniModule(id);
        break;
      case 'Lesson':
        await this.processNewLesson(id);
        break;
      case 'Challenge':
        await this.processNewChallenge(id);
        break;
      case 'CourseResource':
        await this.processNewResource(id);
        break;
      default:
        this.logger.warn(`Unknown content type: ${type}`);
    }
  }
}
