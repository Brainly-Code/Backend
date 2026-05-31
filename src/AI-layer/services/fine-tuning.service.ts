import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import OpenAI from 'openai';
import 'dotenv/config';

@Injectable()
export class FineTuningService {
  private openai: OpenAI;

  constructor(private prisma: PrismaService) {
    // Validate API key BEFORE initializing the client
    // Note: Using OpenRouter API (https://openrouter.ai)
    if (!process.env.DEEPSEEK_API_KEY) {
      throw new Error('OpenRouter API key is not set in environment variables. Please set DEEPSEEK_API_KEY (or OPENROUTER_API_KEY) in your .env file.');
    }

    // Check if API key is empty or just whitespace
    if (!process.env.DEEPSEEK_API_KEY.trim()) {
      throw new Error('OpenRouter API key is empty. Please provide a valid DEEPSEEK_API_KEY (or OPENROUTER_API_KEY) in your .env file.');
    }

    this.openai = new OpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY.trim(),
      baseURL: 'https://openrouter.ai/api/v1'
    });
  }

  /**
   * Create a fine-tuning job
   */
  async createFineTuningJob(
    name: string,
    trainingData: any[],
    baseModel: string = 'gpt-3.5-turbo'
  ) {
    try {
      // Store job in database
      const job = await this.prisma.fineTuningJob.create({
        data: {
          name,
          status: 'pending',
          trainingData,
        },
      });

      // Prepare training data in OpenAI format
      const formattedData = trainingData.map(item => ({
        messages: [
          { role: 'system', content: item.system || 'You are BrainlyCode AI, a helpful programming tutor.' },
          { role: 'user', content: item.user },
          { role: 'assistant', content: item.assistant },
        ],
      }));

      // Create fine-tuning job with OpenAI
      const fineTuningJob = await this.openai.fineTuning.jobs.create({
        training_file: await this.uploadTrainingData(formattedData),
        model: baseModel,
      });

      // Update job with OpenAI job ID
      await this.prisma.fineTuningJob.update({
        where: { id: job.id },
        data: {
          status: 'running',
          modelId: fineTuningJob.id,
        },
      });

      return { job, openaiJob: fineTuningJob };
    } catch (error) {
      console.error('Error creating fine-tuning job:', error);
      throw new Error('Failed to create fine-tuning job');
    }
  }

  /**
   * Upload training data to OpenAI
   */
  private async uploadTrainingData(data: any[]) {
    try {
      // Convert to JSONL format
      const jsonlData = data.map(item => JSON.stringify(item)).join('\n');

      // Create a temporary file (in production, you'd want to use a proper file storage)
      const fs = require('fs');
      const path = require('path');
      const tempFile = path.join(process.cwd(), 'temp', `training_${Date.now()}.jsonl`);

      // Ensure temp directory exists
      const tempDir = path.dirname(tempFile);
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      fs.writeFileSync(tempFile, jsonlData);

      // Upload to OpenAI
      const file = await this.openai.files.create({
        file: fs.createReadStream(tempFile),
        purpose: 'fine-tune',
      });

      // Clean up temp file
      fs.unlinkSync(tempFile);

      return file.id;
    } catch (error) {
      console.error('Error uploading training data:', error);
      throw new Error('Failed to upload training data');
    }
  }

  /**
   * Get fine-tuning job status
   */
  async getFineTuningJobStatus(jobId: number) {
    try {
      const job = await this.prisma.fineTuningJob.findUnique({
        where: { id: jobId },
      });

      if (!job || !job.modelId) {
        throw new Error('Job not found or no OpenAI job ID');
      }

      // Get status from OpenAI
      const openaiJob = await this.openai.fineTuning.jobs.retrieve(job.modelId);

      // Update local job status
      const status = openaiJob.status;
      const jobResults = {
        status,
        fineTunedModel: openaiJob.fine_tuned_model,
        trainingFile: openaiJob.training_file,
        validationFile: openaiJob.validation_file,
        createdAt: openaiJob.created_at,
        finishedAt: openaiJob.finished_at,
        hyperparameters: openaiJob.hyperparameters,
      };

      await this.prisma.fineTuningJob.update({
        where: { id: jobId },
        data: {
          status,
          results: jobResults as any,
        },
      });

      return { localJob: job, openaiJob };
    } catch (error) {
      console.error('Error getting fine-tuning job status:', error);
      throw new Error('Failed to get fine-tuning job status');
    }
  }

  /**
   * List all fine-tuning jobs
   */
  async listFineTuningJobs() {
    try {
      return await this.prisma.fineTuningJob.findMany({
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      console.error('Error listing fine-tuning jobs:', error);
      throw new Error('Failed to list fine-tuning jobs');
    }
  }

  /**
   * Generate training data from platform interactions
   */
  async generateTrainingDataFromPlatform() {
    try {
      // Get chat sessions with good interactions
      const chatSessions = await this.prisma.chatSession.findMany({
        take: 100, // Limit for initial training
      });

      const trainingData: Array<{
        system: string;
        user: string;
        assistant: string;
      }> = [];

      for (const session of chatSessions) {
        const messages = session.messages as any[];
        if (messages && messages.length >= 2) {
          // Extract user-assistant pairs
          for (let i = 0; i < messages.length - 1; i += 2) {
            if (messages[i].role === 'user' && messages[i + 1].role === 'assistant') {
              trainingData.push({
                system: 'You are BrainlyCode AI, a helpful programming tutor for the BrainlyCode platform. Use the provided context to give accurate, platform-specific answers.',
                user: messages[i].content,
                assistant: messages[i + 1].content,
              });
            }
          }
        }
      }

      return trainingData;
    } catch (error) {
      console.error('Error generating training data:', error);
      throw new Error('Failed to generate training data');
    }
  }

  /**
   * Create fine-tuning job from platform data
   */
  async createPlatformFineTuningJob(name: string = 'BrainlyCode Platform Model') {
    try {
      const trainingData = await this.generateTrainingDataFromPlatform();

      if (trainingData.length === 0) {
        throw new Error('No training data available from platform interactions');
      }

      return await this.createFineTuningJob(name, trainingData);
    } catch (error) {
      console.error('Error creating platform fine-tuning job:', error);
      throw new Error('Failed to create platform fine-tuning job');
    }
  }

  /**
   * Use fine-tuned model for responses
   */
  async useFineTunedModel(
    modelId: string,
    messages: any[],
    temperature: number = 0.7
  ) {
    try {
      const response = await this.openai.chat.completions.create({
        model: modelId,
        messages,
        temperature,
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Error using fine-tuned model:', error);
      throw new Error('Failed to use fine-tuned model');
    }
  }

  /**
   * Delete fine-tuning job
   */
  async deleteFineTuningJob(jobId: number) {
    try {
      const job = await this.prisma.fineTuningJob.findUnique({
        where: { id: jobId },
      });

      if (job?.modelId) {
        // Cancel OpenAI job if still running
        try {
          await this.openai.fineTuning.jobs.cancel(job.modelId);
        } catch (error) {
          // Job might already be completed or failed
          const message = error instanceof Error ? error.message : 'Unknown error';
          console.log('Could not cancel OpenAI job:', message);
        }
      }

      // Delete from database
      await this.prisma.fineTuningJob.delete({
        where: { id: jobId },
      });

      return { success: true };
    } catch (error) {
      console.error('Error deleting fine-tuning job:', error);
      throw new Error('Failed to delete fine-tuning job');
    }
  }
}
