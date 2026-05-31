import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Query, UseInterceptors, UploadedFiles, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags, ApiQuery, ApiConsumes } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { IsArray, IsOptional, IsString, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { AiService, AiStats } from './ai.service';
import { SyncStatus } from './services/content-sync.service';
import { AdminGuard, JwtGuard } from '../guard';

class ChatHistoryItemDto {
  @IsString()
  role!: string;

  @IsString()
  content!: string;
}

class ChatRequestDto {
  @IsString()
  messages!: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChatHistoryItemDto)
  history?: ChatHistoryItemDto[];

  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsOptional()
  @IsString()
  sessionId?: string;
}

class FineTuningJobDto {
  @IsString()
  name!: string;

  @IsArray()
  trainingData!: any[];
}

@ApiTags('ai')
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) { }

  @UseGuards(JwtGuard)
  @Post('chat')
  @ApiOperation({ summary: 'Chat with BrainlyCode AI using RAG' })
  @ApiBody({ type: ChatRequestDto })
  async chat(@Body() body: ChatRequestDto) {
    const { messages, history, userId, sessionId } = body;
    try {
      const result = await this.aiService.askTutor(messages, history, userId, sessionId);
      return {
        reply: result.response,
        sources: result.sources,
        context: result.context
      };
    } catch (error) {
      console.error(error);
      throw new HttpException('BrainlyCode AI failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtGuard)
  @Post('chat-with-files')
  @ApiOperation({ summary: 'Chat with BrainlyCode AI with file attachments (images/PDFs)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        messages: { type: 'string' },
        history: { type: 'string', description: 'JSON string array' },
        files: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('files', 5, {
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB max per file
    },
  }))
  async chatWithFiles(
    @Body() body: { messages: string; history: string },
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    try {
      const history = body.history ? JSON.parse(body.history) : [];
      const result = await this.aiService.askTutorWithFiles(
        body.messages || 'Tell me about these files',
        history,
        files
      );
      return {
        reply: result.response,
        sources: result.sources,
        context: result.context,
      };
    } catch (error: any) {
      console.error('Error in chat-with-files:', error);
      throw new HttpException(
        error?.message || 'Failed to process files',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @UseGuards(JwtGuard)
  @Get('search')
  @ApiOperation({ summary: 'Search platform content using vector similarity' })
  @ApiQuery({ name: 'query', required: true })
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async searchContent(
    @Query('query') query: string,
    @Query('type') type?: string,
    @Query('limit') limit?: number
  ) {
    try {
      const results = await this.aiService.searchContent(query, type, limit || 5);
      return { results };
    } catch (error) {
      console.error(error);
      throw new HttpException('Search failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtGuard)
  @Get('recommendations/:userId')
  @ApiOperation({ summary: 'Get personalized recommendations for user' })
  @ApiQuery({ name: 'limit', required: false })
  async getRecommendations(
    @Param('userId') userId: number,
    @Query('limit') limit?: number
  ) {
    try {
      const recommendations = await this.aiService.getRecommendations(userId, limit || 3);
      return { recommendations };
    } catch (error) {
      console.error(error);
      throw new HttpException('Failed to get recommendations', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Post('ingest')
  @ApiOperation({ summary: 'Ingest all platform content into knowledge base' })
  async ingestData() {
    try {
      const results = await this.aiService.ingestData();
      return {
        message: 'Data ingestion completed',
        results
      };
    } catch (error) {
      console.error(error);
      throw new HttpException('Data ingestion failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Post('update-content')
  @ApiOperation({ summary: 'Update specific content in knowledge base' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        sourceType: { type: 'string' },
        sourceId: { type: 'number' }
      },
      required: ['sourceType', 'sourceId']
    }
  })
  async updateContent(@Body() body: { sourceType: string; sourceId: number }) {
    try {
      await this.aiService.updateContent(body.sourceType, body.sourceId);
      return { message: 'Content updated successfully' };
    } catch (error) {
      console.error(error);
      throw new HttpException('Content update failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Post('fine-tuning')
  @ApiOperation({ summary: 'Create a fine-tuning job' })
  @ApiBody({ type: FineTuningJobDto })
  async createFineTuningJob(@Body() body: FineTuningJobDto) {
    try {
      const job = await this.aiService.createFineTuningJob(body.name, body.trainingData);
      return {
        message: 'Fine-tuning job created',
        job
      };
    } catch (error) {
      console.error(error);
      throw new HttpException('Fine-tuning job creation failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Get('fine-tuning/:jobId')
  @ApiOperation({ summary: 'Get fine-tuning job status' })
  async getFineTuningJobStatus(@Param('jobId') jobId: number) {
    try {
      const status = await this.aiService.getFineTuningJobStatus(jobId);
      return { status };
    } catch (error) {
      console.error(error);
      throw new HttpException('Failed to get job status', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Get('fine-tuning')
  @ApiOperation({ summary: 'List all fine-tuning jobs' })
  async listFineTuningJobs() {
    try {
      const jobs = await this.aiService.listFineTuningJobs();
      return { jobs };
    } catch (error) {
      console.error(error);
      throw new HttpException('Failed to list jobs', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Post('sync')
  @ApiOperation({ summary: 'Trigger content synchronization' })
  @ApiQuery({ name: 'type', required: false })
  async syncContent(@Query('type') type?: string) {
    try {
      if (type) {
        await this.aiService.syncContentType(type);
        return { message: `Content type ${type} synced successfully` };
      } else {
        await this.aiService.syncAllContent();
        return { message: 'All content synced successfully' };
      }
    } catch (error) {
      console.error(error);
      throw new HttpException('Content sync failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Get('sync/status')
  @ApiOperation({ summary: 'Get synchronization status' })
  async getSyncStatus(): Promise<{ status: SyncStatus }> {
    try {
      const status = await this.aiService.getSyncStatus();
      return { status };
    } catch (error) {
      console.error(error);
      throw new HttpException('Failed to get sync status', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Get('stats')
  @ApiOperation({ summary: 'Get AI system statistics' })
  async getStats(): Promise<{ stats: AiStats }> {
    try {
      const stats = await this.aiService.getStats();
      return { stats };
    } catch (error) {
      console.error(error);
      throw new HttpException('Failed to get stats', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Post('webhook/register')
  @ApiOperation({ summary: 'Register webhook endpoint' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        url: { type: 'string' },
        events: { type: 'array', items: { type: 'string' } }
      },
      required: ['url', 'events']
    }
  })
  async registerWebhook(@Body() body: { url: string; events: string[] }) {
    try {
      await this.aiService.registerWebhook(body.url, body.events);
      return { message: 'Webhook registered successfully' };
    } catch (error) {
      console.error(error);
      throw new HttpException('Webhook registration failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Get('webhook/stats')
  @ApiOperation({ summary: 'Get webhook statistics' })
  async getWebhookStats() {
    try {
      const stats = await this.aiService.getWebhookStats();
      return { stats };
    } catch (error) {
      console.error(error);
      throw new HttpException('Failed to get webhook stats', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Post('trigger-sync')
  @ApiOperation({ summary: 'Trigger immediate synchronization' })
  async triggerImmediateSync() {
    try {
      await this.aiService.triggerImmediateSync();
      return { message: 'Immediate sync triggered successfully' };
    } catch (error) {
      console.error(error);
      throw new HttpException('Immediate sync failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Post('test-deepseek')
  @ApiOperation({ summary: 'Test DeepSeek API with a simple question' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        question: { type: 'string', description: 'Question to test (optional, defaults to a simple test question)' }
      }
    },
    required: false
  })
  async testDeepSeek(@Body() body?: { question?: string }) {
    try {
      const response = await this.aiService.testDeepSeekAPI(body?.question);
      return {
        success: true,
        response,
        message: 'DeepSeek API test successful'
      };
    } catch (error: any) {
      console.error(error);
      throw new HttpException(
        `DeepSeek API test failed: ${error.message || 'Unknown error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}


