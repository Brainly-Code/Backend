import 'dotenv/config';
import { AiService } from '../src/AI-layer/ai.service';
import { AutoEmbeddingService } from '../src/AI-layer/services/auto-embedding.service';
import { ContentSyncService } from '../src/AI-layer/services/content-sync.service';
import { WebhookService } from '../src/AI-layer/services/webhook.service';
import { SchedulerService } from '../src/AI-layer/services/scheduler.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();
const prisma = new PrismaService(configService);

async function setupAutoUpdate() {
  console.log('🚀 Setting up Auto-Update RAG System for BrainlyCode...');

  try {
    // Initialize services
    const autoEmbeddingService = new AutoEmbeddingService(prisma);
    const contentSyncService = new ContentSyncService(prisma, autoEmbeddingService, new WebhookService(prisma, autoEmbeddingService));
    const schedulerService = new SchedulerService(prisma, autoEmbeddingService);

    console.log('📊 Starting initial content sync...');

    // Sync all existing content
    await contentSyncService.syncAllContent();

    console.log('✅ Initial sync completed!');

    // Get sync status
    const syncStatus = contentSyncService.getSyncStatus();
    console.log('📈 Sync Status:', syncStatus);

    // Get content statistics
    const contentStats = await contentSyncService.getContentStats();
    console.log('📊 Content Statistics:', contentStats);

    console.log('🎉 Auto-Update RAG System setup complete!');
    console.log('💡 The system will now automatically:');
    console.log('   - Generate embeddings for new content');
    console.log('   - Update embeddings when content changes');
    console.log('   - Sync content daily at 2 AM');
    console.log('   - Perform full sync weekly on Sundays at 3 AM');
    console.log('   - Clean up orphaned embeddings monthly');
    console.log('   - Send webhook notifications for content changes');

    console.log('\n🔧 Available API endpoints:');
    console.log('   POST /ai/sync - Trigger content sync');
    console.log('   GET /ai/sync/status - Get sync status');
    console.log('   GET /ai/stats - Get system statistics');
    console.log('   POST /ai/webhook/register - Register webhook');
    console.log('   GET /ai/webhook/stats - Get webhook stats');
    console.log('   POST /ai/trigger-sync - Trigger immediate sync');

  } catch (error) {
    console.error('❌ Error setting up auto-update system:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the setup
setupAutoUpdate();
