import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AutoEmbeddingService } from './auto-embedding.service';

interface WebhookEvent {
  type: 'content.created' | 'content.updated' | 'content.deleted';
  sourceType: string;
  sourceId: number;
  data?: any;
  timestamp: Date;
}

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);
  private eventQueue: WebhookEvent[] = [];
  private isProcessing = false;

  constructor(
    private prisma: PrismaService,
    private autoEmbeddingService: AutoEmbeddingService
  ) {
    this.startEventProcessor();
  }

  /**
   * Emit a webhook event
   */
  async emitEvent(
    type: WebhookEvent['type'],
    sourceType: string,
    sourceId: number,
    data?: any
  ) {
    const event: WebhookEvent = {
      type,
      sourceType,
      sourceId,
      data,
      timestamp: new Date(),
    };

    this.logger.log(`Emitting event: ${type} for ${sourceType}:${sourceId}`);
    this.eventQueue.push(event);
    
    // Process events if not already processing
    if (!this.isProcessing) {
      this.processEvents();
    }
  }

  /**
   * Start the event processor
   */
  private startEventProcessor() {
    this.logger.log('Starting webhook event processor');
    
    // Process events every 5 seconds
    setInterval(() => {
      if (this.eventQueue.length > 0 && !this.isProcessing) {
        this.processEvents();
      }
    }, 5000);
  }

  /**
   * Process queued events
   */
  private async processEvents() {
    if (this.isProcessing || this.eventQueue.length === 0) {
      return;
    }

    this.isProcessing = true;
    this.logger.log(`Processing ${this.eventQueue.length} events`);

    try {
      const events = [...this.eventQueue];
      this.eventQueue = [];

      for (const event of events) {
        await this.handleEvent(event);
      }
    } catch (error) {
      this.logger.error('Error processing events:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Handle individual event
   */
  private async handleEvent(event: WebhookEvent) {
    try {
      this.logger.log(`Handling event: ${event.type} for ${event.sourceType}:${event.sourceId}`);

      switch (event.type) {
        case 'content.created':
          await this.handleContentCreated(event);
          break;
        case 'content.updated':
          await this.handleContentUpdated(event);
          break;
        case 'content.deleted':
          await this.handleContentDeleted(event);
          break;
        default:
          this.logger.warn(`Unknown event type: ${event.type}`);
      }
    } catch (error) {
      this.logger.error(`Error handling event ${event.type}:`, error);
    }
  }

  /**
   * Handle content created event
   */
  private async handleContentCreated(event: WebhookEvent) {
    try {
      switch (event.sourceType) {
        case 'Course':
          await this.autoEmbeddingService.processNewCourse(event.sourceId);
          break;
        case 'Lesson':
          await this.autoEmbeddingService.processNewLesson(event.sourceId);
          break;
        case 'Challenge':
          await this.autoEmbeddingService.processNewChallenge(event.sourceId);
          break;
        case 'CourseResource':
          await this.autoEmbeddingService.processNewResource(event.sourceId);
          break;
        case 'CourseModule':
          await this.autoEmbeddingService.processNewModule(event.sourceId);
          break;
        case 'MiniModule':
          await this.autoEmbeddingService.processNewMiniModule(event.sourceId);
          break;
        default:
          this.logger.warn(`Unknown source type for creation: ${event.sourceType}`);
      }
    } catch (error) {
      this.logger.error(`Error handling content created:`, error);
    }
  }

  /**
   * Handle content updated event
   */
  private async handleContentUpdated(event: WebhookEvent) {
    try {
      await this.autoEmbeddingService.updateContentEmbedding(
        event.sourceType,
        event.sourceId
      );
    } catch (error) {
      this.logger.error(`Error handling content updated:`, error);
    }
  }

  /**
   * Handle content deleted event
   */
  private async handleContentDeleted(event: WebhookEvent) {
    try {
      await this.autoEmbeddingService.deleteContentEmbedding(
        event.sourceType,
        event.sourceId
      );
    } catch (error) {
      this.logger.error(`Error handling content deleted:`, error);
    }
  }

  /**
   * Register webhook endpoint for external services
   */
  async registerWebhook(url: string, events: string[]) {
    try {
      // Store webhook configuration in database
      await this.prisma.knowledgeBase.create({
        data: {
          title: 'Webhook Configuration',
          content: JSON.stringify({ url, events }),
          type: 'webhook-config',
          metadata: { url, events, registeredAt: new Date() },
        },
      });

      this.logger.log(`Registered webhook: ${url} for events: ${events.join(', ')}`);
    } catch (error) {
      this.logger.error('Error registering webhook:', error);
      throw error;
    }
  }

  /**
   * Send webhook notification to external services
   */
  async sendWebhookNotification(event: WebhookEvent) {
    try {
      // Get registered webhooks
      const webhooks = await this.prisma.knowledgeBase.findMany({
        where: {
          type: 'webhook-config',
        },
      });

      for (const webhook of webhooks) {
        try {
          const config = JSON.parse(webhook.content);
          
          if (config.events.includes(event.type)) {
            // Send HTTP request to webhook URL
            const response = await fetch(config.url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                event: event.type,
                sourceType: event.sourceType,
                sourceId: event.sourceId,
                data: event.data,
                timestamp: event.timestamp,
              }),
            });

            if (!response.ok) {
              this.logger.warn(`Webhook failed: ${config.url} - ${response.status}`);
            } else {
              this.logger.log(`Webhook sent successfully: ${config.url}`);
            }
          }
        } catch (error) {
          this.logger.error(`Error sending webhook to ${webhook.metadata}:`, error);
        }
      }
    } catch (error) {
      this.logger.error('Error sending webhook notification:', error);
    }
  }

  /**
   * Get webhook event statistics
   */
  async getWebhookStats() {
    try {
      const stats = await this.prisma.knowledgeBase.aggregate({
        where: {
          type: 'webhook-config',
        },
        _count: {
          id: true,
        },
      });

      return {
        registeredWebhooks: stats._count.id,
        queuedEvents: this.eventQueue.length,
        isProcessing: this.isProcessing,
        lastProcessed: new Date(),
      };
    } catch (error) {
      this.logger.error('Error getting webhook stats:', error);
      throw error;
    }
  }
}
