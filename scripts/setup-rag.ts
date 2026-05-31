import 'dotenv/config';
import { DataIngestionService } from '../src/AI-layer/services/data-ingestion.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();
const prisma = new PrismaService(configService);

async function setupRAG() {
  console.log('🚀 Setting up RAG system for BrainlyCode...');

  try {
    // Initialize services
    const dataIngestionService = new DataIngestionService(prisma);

    console.log('📊 Starting data ingestion...');

    // Ingest all platform content
    const results = await dataIngestionService.ingestAllContent();

    console.log('✅ Data ingestion completed!');
    console.log('📈 Results:', {
      courses: results.courses.length,
      lessons: results.lessons.length,
      challenges: results.challenges.length,
      resources: results.resources.length,
    });

    console.log('🎉 RAG system setup complete!');
    console.log('💡 You can now use the AI endpoints with RAG capabilities');

  } catch (error) {
    console.error('❌ Error setting up RAG system:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the setup
setupRAG();
