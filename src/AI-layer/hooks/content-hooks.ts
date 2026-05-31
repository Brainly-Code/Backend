import { Injectable } from '@nestjs/common';
import { AiService } from '../ai.service';

@Injectable()
export class ContentHooks {
  constructor(private aiService: AiService) {}

  /**
   * Hook for course creation
   */
  async onCourseCreated(courseId: number) {
    try {
      await this.aiService.processNewContent('Course', courseId);
      await this.aiService.emitWebhookEvent('content.created', 'Course', courseId);
    } catch (error) {
      console.error('Error in course creation hook:', error);
    }
  }

  /**
   * Hook for course update
   */
  async onCourseUpdated(courseId: number) {
    try {
      await this.aiService.updateContentEmbedding('Course', courseId);
      await this.aiService.emitWebhookEvent('content.updated', 'Course', courseId);
    } catch (error) {
      console.error('Error in course update hook:', error);
    }
  }

  /**
   * Hook for course deletion
   */
  async onCourseDeleted(courseId: number) {
    try {
      await this.aiService.deleteContentEmbedding('Course', courseId);
      await this.aiService.emitWebhookEvent('content.deleted', 'Course', courseId);
    } catch (error) {
      console.error('Error in course deletion hook:', error);
    }
  }

  /**
   * Hook for lesson creation
   */
  async onLessonCreated(lessonId: number) {
    try {
      await this.aiService.processNewContent('Lesson', lessonId);
      await this.aiService.emitWebhookEvent('content.created', 'Lesson', lessonId);
    } catch (error) {
      console.error('Error in lesson creation hook:', error);
    }
  }

  /**
   * Hook for lesson update
   */
  async onLessonUpdated(lessonId: number) {
    try {
      await this.aiService.updateContentEmbedding('Lesson', lessonId);
      await this.aiService.emitWebhookEvent('content.updated', 'Lesson', lessonId);
    } catch (error) {
      console.error('Error in lesson update hook:', error);
    }
  }

  /**
   * Hook for lesson deletion
   */
  async onLessonDeleted(lessonId: number) {
    try {
      await this.aiService.deleteContentEmbedding('Lesson', lessonId);
      await this.aiService.emitWebhookEvent('content.deleted', 'Lesson', lessonId);
    } catch (error) {
      console.error('Error in lesson deletion hook:', error);
    }
  }

  /**
   * Hook for challenge creation
   */
  async onChallengeCreated(challengeId: number) {
    try {
      await this.aiService.processNewContent('Challenge', challengeId);
      await this.aiService.emitWebhookEvent('content.created', 'Challenge', challengeId);
    } catch (error) {
      console.error('Error in challenge creation hook:', error);
    }
  }

  /**
   * Hook for challenge update
   */
  async onChallengeUpdated(challengeId: number) {
    try {
      await this.aiService.updateContentEmbedding('Challenge', challengeId);
      await this.aiService.emitWebhookEvent('content.updated', 'Challenge', challengeId);
    } catch (error) {
      console.error('Error in challenge update hook:', error);
    }
  }

  /**
   * Hook for challenge deletion
   */
  async onChallengeDeleted(challengeId: number) {
    try {
      await this.aiService.deleteContentEmbedding('Challenge', challengeId);
      await this.aiService.emitWebhookEvent('content.deleted', 'Challenge', challengeId);
    } catch (error) {
      console.error('Error in challenge deletion hook:', error);
    }
  }

  /**
   * Hook for resource creation
   */
  async onResourceCreated(resourceId: number) {
    try {
      await this.aiService.processNewContent('CourseResource', resourceId);
      await this.aiService.emitWebhookEvent('content.created', 'CourseResource', resourceId);
    } catch (error) {
      console.error('Error in resource creation hook:', error);
    }
  }

  /**
   * Hook for resource update
   */
  async onResourceUpdated(resourceId: number) {
    try {
      await this.aiService.updateContentEmbedding('CourseResource', resourceId);
      await this.aiService.emitWebhookEvent('content.updated', 'CourseResource', resourceId);
    } catch (error) {
      console.error('Error in resource update hook:', error);
    }
  }

  /**
   * Hook for resource deletion
   */
  async onResourceDeleted(resourceId: number) {
    try {
      await this.aiService.deleteContentEmbedding('CourseResource', resourceId);
      await this.aiService.emitWebhookEvent('content.deleted', 'CourseResource', resourceId);
    } catch (error) {
      console.error('Error in resource deletion hook:', error);
    }
  }

  /**
   * Hook for module creation
   */
  async onModuleCreated(moduleId: number) {
    try {
      await this.aiService.processNewContent('CourseModule', moduleId);
      await this.aiService.emitWebhookEvent('content.created', 'CourseModule', moduleId);
    } catch (error) {
      console.error('Error in module creation hook:', error);
    }
  }

  /**
   * Hook for module update
   */
  async onModuleUpdated(moduleId: number) {
    try {
      await this.aiService.updateContentEmbedding('CourseModule', moduleId);
      await this.aiService.emitWebhookEvent('content.updated', 'CourseModule', moduleId);
    } catch (error) {
      console.error('Error in module update hook:', error);
    }
  }

  /**
   * Hook for module deletion
   */
  async onModuleDeleted(moduleId: number) {
    try {
      await this.aiService.deleteContentEmbedding('CourseModule', moduleId);
      await this.aiService.emitWebhookEvent('content.deleted', 'CourseModule', moduleId);
    } catch (error) {
      console.error('Error in module deletion hook:', error);
    }
  }

  /**
   * Hook for mini-module creation
   */
  async onMiniModuleCreated(miniModuleId: number) {
    try {
      await this.aiService.processNewContent('MiniModule', miniModuleId);
      await this.aiService.emitWebhookEvent('content.created', 'MiniModule', miniModuleId);
    } catch (error) {
      console.error('Error in mini-module creation hook:', error);
    }
  }

  /**
   * Hook for mini-module update
   */
  async onMiniModuleUpdated(miniModuleId: number) {
    try {
      await this.aiService.updateContentEmbedding('MiniModule', miniModuleId);
      await this.aiService.emitWebhookEvent('content.updated', 'MiniModule', miniModuleId);
    } catch (error) {
      console.error('Error in mini-module update hook:', error);
    }
  }

  /**
   * Hook for mini-module deletion
   */
  async onMiniModuleDeleted(miniModuleId: number) {
    try {
      await this.aiService.deleteContentEmbedding('MiniModule', miniModuleId);
      await this.aiService.emitWebhookEvent('content.deleted', 'MiniModule', miniModuleId);
    } catch (error) {
      console.error('Error in mini-module deletion hook:', error);
    }
  }
}
