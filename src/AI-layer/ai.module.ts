/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { PrismaModule } from '../prisma/prisma.module';
// import { EmbeddingsService } from './services/embeddings.service';
import { RagService } from './services/rag.service';
import { DataIngestionService } from './services/data-ingestion.service';
import { FineTuningService } from './services/fine-tuning.service';
import { AutoEmbeddingService } from './services/auto-embedding.service';
import { DatabaseHooksService } from './services/database-hooks.service';
import { WebhookService } from './services/webhook.service';
import { SchedulerService } from './services/scheduler.service';
import { ContentSyncService } from './services/content-sync.service';

@Module({
  imports: [PrismaModule, ScheduleModule.forRoot()],
  controllers: [AiController],
  providers: [
    AiService,
    RagService,
    DataIngestionService,
    FineTuningService,
    AutoEmbeddingService,
    DatabaseHooksService,
    WebhookService,
    SchedulerService,
    ContentSyncService,
  ],
  exports: [
    AiService,
    RagService,
    DataIngestionService,
    FineTuningService,
    AutoEmbeddingService,
    DatabaseHooksService,
    WebhookService,
    SchedulerService,
    ContentSyncService,
  ],
})
export class AiModule { }


