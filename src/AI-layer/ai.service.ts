/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { RagService } from './services/rag.service';
// import { EmbeddingsService } from './services/embeddings.service';
import { DataIngestionService } from './services/data-ingestion.service';
import { FineTuningService } from './services/fine-tuning.service';
import { AutoEmbeddingService } from './services/auto-embedding.service';
import { DatabaseHooksService } from './services/database-hooks.service';
import { WebhookService } from './services/webhook.service';
import { SchedulerService } from './services/scheduler.service';
import { ContentSyncService, SyncStatus } from './services/content-sync.service';
import { formatResponseForUI } from './utils/response-formatter';

export interface AiStats {
  content: Awaited<ReturnType<ContentSyncService['getContentStats']>>;
  scheduler: Awaited<ReturnType<SchedulerService['getSchedulerStats']>>;
  webhook: Awaited<ReturnType<WebhookService['getWebhookStats']>>;
}

@Injectable()
export class AiService {
  constructor(
    private ragService: RagService,
    // private embeddingsService: EmbeddingsService,
    private dataIngestionService: DataIngestionService,
    private fineTuningService: FineTuningService,
    private autoEmbeddingService: AutoEmbeddingService,
    private databaseHooksService: DatabaseHooksService,
    private webhookService: WebhookService,
    private schedulerService: SchedulerService,
    private contentSyncService: ContentSyncService
  ) { }

  /**
   * Enhanced AI tutor using RAG
   */
  async askTutor(
    messages: string,
    history?: any[],
    userId?: number,
    sessionId?: string
  ): Promise<{ response: string; sources?: any[]; context?: any[] }> {
    try {
      const result = await this.ragService.generateRagResponse(
        messages,
        history,
        userId,
        sessionId
      );

      // Format the response before returning to the UI
      const formattedResponse = formatResponseForUI(result.response);

      return {
        response: formattedResponse,
        sources: result.sources,
        context: result.context,
      };
    } catch (error) {
      console.error('Error in AI service:', error);
      throw new Error('Failed to generate AI response');
    }
  }

  /**
   * Search platform content
   */
  async searchContent(query: string, type?: string, limit: number = 5) {
    try {
      return await this.ragService.searchPlatformContent(query, type, limit);
    } catch (error) {
      console.error('Error searching content:', error);
      throw new Error('Failed to search content');
    }
  }

  /**
   * Get personalized recommendations
   */
  async getRecommendations(userId: number, limit: number = 3) {
    try {
      return await this.ragService.getPersonalizedRecommendations(userId, limit);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      throw new Error('Failed to get recommendations');
    }
  }

  /**
   * Ingest platform data
   */
  async ingestData() {
    try {
      return await this.dataIngestionService.ingestAllContent();
    } catch (error) {
      console.error('Error ingesting data:', error);
      throw new Error('Failed to ingest data');
    }
  }

  /**
   * Update specific content
   */
  async updateContent(sourceType: string, sourceId: number) {
    try {
      return await this.dataIngestionService.updateContent(sourceType, sourceId);
    } catch (error) {
      console.error('Error updating content:', error);
      throw new Error('Failed to update content');
    }
  }

  /**
   * Create fine-tuning job
   */
  async createFineTuningJob(name: string, trainingData: any[]) {
    try {
      return await this.fineTuningService.createFineTuningJob(name, trainingData);
    } catch (error) {
      console.error('Error creating fine-tuning job:', error);
      throw new Error('Failed to create fine-tuning job');
    }
  }

  /**
   * Get fine-tuning job status
   */
  async getFineTuningJobStatus(jobId: number) {
    try {
      return await this.fineTuningService.getFineTuningJobStatus(jobId);
    } catch (error) {
      console.error('Error getting fine-tuning job status:', error);
      throw new Error('Failed to get fine-tuning job status');
    }
  }

  /**
   * List fine-tuning jobs
   */
  async listFineTuningJobs() {
    try {
      return await this.fineTuningService.listFineTuningJobs();
    } catch (error) {
      console.error('Error listing fine-tuning jobs:', error);
      throw new Error('Failed to list fine-tuning jobs');
    }
  }

  /**
   * Sync all content
   */
  async syncAllContent() {
    try {
      return await this.contentSyncService.syncAllContent();
    } catch (error) {
      console.error('Error syncing all content:', error);
      throw new Error('Failed to sync all content');
    }
  }

  /**
   * Sync specific content type
   */
  async syncContentType(type: string) {
    try {
      return await this.contentSyncService.syncContentType(type);
      console.log(type);
    } catch (error) {
      console.error(`Error syncing content type ${type}:`, error);
      throw new Error(`Failed to sync content type ${type}`);
    }
  }

  /**
   * Get sync status
   */
  async getSyncStatus(): Promise<SyncStatus> {
    try {
      return this.contentSyncService.getSyncStatus();
    } catch (error) {
      console.error('Error getting sync status:', error);
      throw new Error('Failed to get sync status');
    }
  }

  /**
   * Get system statistics
   */
  async getStats(): Promise<AiStats> {
    try {
      const contentStats = await this.contentSyncService.getContentStats();
      const schedulerStats = await this.schedulerService.getSchedulerStats();
      const webhookStats = await this.webhookService.getWebhookStats();

      return {
        content: contentStats,
        scheduler: schedulerStats,
        webhook: webhookStats,
      };
    } catch (error) {
      console.error('Error getting stats:', error);
      throw new Error('Failed to get stats');
    }
  }

  /**
   * Register webhook
   */
  async registerWebhook(url: string, events: string[]) {
    try {
      return await this.webhookService.registerWebhook(url, events);
    } catch (error) {
      console.error('Error registering webhook:', error);
      throw new Error('Failed to register webhook');
    }
  }

  /**
   * Get webhook statistics
   */
  async getWebhookStats() {
    try {
      return await this.webhookService.getWebhookStats();
    } catch (error) {
      console.error('Error getting webhook stats:', error);
      throw new Error('Failed to get webhook stats');
    }
  }

  /**
   * Trigger immediate sync
   */
  async triggerImmediateSync() {
    try {
      return await this.schedulerService.triggerImmediateSync();
    } catch (error) {
      console.error('Error triggering immediate sync:', error);
      throw new Error('Failed to trigger immediate sync');
    }
  }

  /**
   * Process new content automatically
   */
  async processNewContent(type: string, id: number) {
    try {
      return await this.autoEmbeddingService.processNewContent(type, id);
    } catch (error) {
      console.error(`Error processing new content ${type}:${id}:`, error);
      throw new Error(`Failed to process new content ${type}:${id}`);
    }
  }

  /**
   * Update content embedding
   */
  async updateContentEmbedding(type: string, id: number) {
    try {
      return await this.autoEmbeddingService.updateContentEmbedding(type, id);
    } catch (error) {
      console.error(`Error updating content embedding ${type}:${id}:`, error);
      throw new Error(`Failed to update content embedding ${type}:${id}`);
    }
  }

  /**
   * Delete content embedding
   */
  async deleteContentEmbedding(type: string, id: number) {
    try {
      return await this.autoEmbeddingService.deleteContentEmbedding(type, id);
    } catch (error) {
      console.error(`Error deleting content embedding ${type}:${id}:`, error);
      throw new Error(`Failed to delete content embedding ${type}:${id}`);
    }
  }

  /**
   * Emit webhook event
   */
  async emitWebhookEvent(
    type: 'content.created' | 'content.updated' | 'content.deleted',
    sourceType: string,
    sourceId: number,
    data?: any
  ) {
    try {
      return await this.webhookService.emitEvent(type, sourceType, sourceId, data);
    } catch (error) {
      console.error('Error emitting webhook event:', error);
      throw new Error('Failed to emit webhook event');
    }
  }

  /**
   * Test OpenRouter API
   */
  async testDeepSeekAPI(question?: string) {
    try {
      const response = await this.ragService.testDeepSeekAPI(question);
      // Format the test response as well
      return formatResponseForUI(response);
    } catch (error) {
      console.error('Error testing OpenRouter API:', error);
      throw new Error('Failed to test OpenRouter API');
    }
  }

  /**
   * Chat with AI tutor using files (images/PDFs)
   */
  async askTutorWithFiles(
    messages: string,
    history?: any[],
    files?: Express.Multer.File[]
  ): Promise<{ response: string; sources?: any[]; context?: any[] }> {
    try {
      const result = await this.ragService.generateRagResponseWithFiles(
        messages,
        files || [],
        history
      );

      // Format the response before returning to the UI
      const formattedResponse = formatResponseForUI(result.response);

      return {
        response: formattedResponse,
        sources: result.sources,
        context: result.context,
      };
    } catch (error) {
      console.error('Error in AI service with files:', error);
      throw new Error('Failed to generate AI response with files');
    }
  }
}


