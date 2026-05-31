import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
// import { EmbeddingsService } from './embeddings.service';
import OpenAI from 'openai';
import 'dotenv/config';

@Injectable()
export class RagService {
  private openai: OpenAI;

  constructor(
    private prisma: PrismaService,
  ) {
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
   * Generate RAG-enhanced response using retrieved context
   */
  async generateRagResponse(
    userQuery: string,
    history: any[] = [],
    userId?: number,
    sessionId?: string,
    contextLimit: number = 3
  ): Promise<{ response: string; context: any[]; sources: any[] }> {
    try {
      // 1. Retrieve relevant context using vector similarity
      // const relevantContent = await this.embeddingsService.findSimilarContent(
      //   userQuery,
      //   contextLimit
      // );

      // 2. Prepare context for the LLM
      // const contextText = relevantContent
      //   .map(item => `Title: ${item.title}\nContent: ${item.content}`)
      //   .join('\n\n---\n\n');

      // 3. Create enhanced system prompt with context
      const systemPrompt = `You are BrainlyCode AI, an intelligent programming tutor for the BrainlyCode platform.

CONTEXT FROM PLATFORM:
// ${"hi"}

INSTRUCTIONS:
- Use the provided context to give accurate, platform-specific answers
- If the context doesn't contain relevant information, say so and provide general guidance
- Always reference specific courses, lessons, or challenges when relevant
- Maintain a helpful, educational tone
- If asked about code, provide examples and explanations
- If the user is stuck on a specific lesson or challenge, offer targeted help`;

      // 4. Generate response using OpenRouter
      let aiResponse: string;
      try {
        const messages = [
          { role: 'system', content: systemPrompt },
          ...(history || []).slice(-10), // Include last 10 history messages
          { role: 'user', content: userQuery },
        ];

        const response = await this.openai.chat.completions.create({
          model: 'deepseek/deepseek-chat',
          messages: messages as any,
          temperature: 0.7,
          max_tokens: 1000,
        });
        aiResponse = response.choices[0]?.message?.content || '';
      } catch (deepseekError: any) {
        // Handle authentication errors
        if (deepseekError?.status === 401 || deepseekError?.code === 'authentication_error') {
          console.error('OpenRouter API authentication error. Please check your DEEPSEEK_API_KEY (or OPENROUTER_API_KEY) in .env file.');
          console.error('Error details:', {
            message: deepseekError?.message,
            type: deepseekError?.type,
            code: deepseekError?.code
          });
          throw new Error('OpenRouter API authentication failed. Please verify your API key is correct and valid.');
        }
        // Handle OpenRouter quota/rate limit errors
        if (deepseekError?.status === 429 || deepseekError?.code === 'insufficient_quota' || deepseekError?.code === 'rate_limit_exceeded') {
          aiResponse = `I apologize, but I'm currently unable to generate a response due to OpenRouter API quota limitations. Please check your OpenRouter API settings.`;
        } else {
          throw deepseekError;
        }
      }

      // 5. Store chat session if sessionId provided
      // if (sessionId) {
      //   await this.storeChatSession(sessionId, userQuery, aiResponse, relevantContent, userId);
      // }

      return {
        response: aiResponse,
        context: [],
        sources: [],
      };
    } catch (error: any) {
      console.error('Error generating RAG response:', error);

      // Check if it's an authentication error
      if (error?.message?.includes('authentication') || error?.status === 401 || error?.code === 'authentication_error') {
        throw new Error('OpenRouter API authentication failed. Please verify your DEEPSEEK_API_KEY (or OPENROUTER_API_KEY) is correct and valid in your .env file.');
      }

      // Check if it's a quota error that wasn't caught earlier
      if (error?.message?.includes('quota') || error?.status === 429) {
        throw new Error('OpenRouter API quota exceeded. Please check your OpenRouter API settings.');
      }

      throw new Error(`Failed to generate AI response: ${error?.message || 'Unknown error'}`);
    }
  }

  /**
   * Store chat session with context
   */
  async storeChatSession(
    sessionId: string,
    userMessage: string,
    aiResponse: string,
    context: any[],
    userId?: number
  ) {
    try {
      const existingSession = await this.prisma.chatSession.findUnique({
        where: { sessionId },
      });

      const messages = existingSession
        ? [...(existingSession.messages as any[]),
        { role: 'user', content: userMessage },
        { role: 'assistant', content: aiResponse }]
        : [
          { role: 'user', content: userMessage },
          { role: 'assistant', content: aiResponse }
        ];

      const sessionData = {
        sessionId,
        userId,
        messages,
        context,
        updatedAt: new Date(),
      };

      if (existingSession) {
        await this.prisma.chatSession.update({
          where: { sessionId },
          data: sessionData,
        });
      } else {
        await this.prisma.chatSession.create({
          data: {
            ...sessionData,
            createdAt: new Date(),
          },
        });
      }
    } catch (error) {
      console.error('Error storing chat session:', error);
      // Don't throw error as this is not critical
    }
  }

  /**
   * Get chat history for a session
   */
  async getChatHistory(sessionId: string) {
    try {
      const session = await this.prisma.chatSession.findUnique({
        where: { sessionId },
      });

      return session?.messages || [];
    } catch (error) {
      console.error('Error getting chat history:', error);
      return [];
    }
  }

  /**
   * Search platform content with RAG
   */
  async searchPlatformContent(
    query: string,
    contentType?: string,
    limit: number = 5
  ) {
    try {
      // Embeddings service removed - return empty results for now
      return [];
    } catch (error) {
      console.error('Error searching platform content:', error);
      throw new Error('Failed to search platform content');
    }
  }

  /**
   * Simple test method to verify OpenRouter API is working
   */
  async testDeepSeekAPI(question: string = 'Hello, can you answer a simple question? What is 2+2?'): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'deepseek/deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI assistant. Answer questions clearly and concisely.'
          },
          { role: 'user', content: question },
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      return response.choices[0]?.message?.content || 'No response received';
    } catch (error: any) {
      console.error('Error testing OpenRouter API:', error);
      throw new Error(`OpenRouter API test failed: ${error.message || 'Unknown error'}`);
    }
  }

  /**
   * Generate RAG response with file attachments (images/PDFs)
   */
  async generateRagResponseWithFiles(
    userQuery: string,
    files: Express.Multer.File[],
    history?: any[]
  ): Promise<{ response: string; context: any[]; sources: any[] }> {
    try {
      const systemPrompt = `You are BrainlyCode AI, an intelligent programming tutor for the BrainlyCode platform.

INSTRUCTIONS:
- When analyzing images, describe what you see and answer questions about code, diagrams, or concepts shown
- When analyzing PDFs, extract and explain the key information
- If asked about code in images, provide detailed explanations and suggestions
- Maintain a helpful, educational tone
- If the content doesn't contain relevant information, say so and provide general guidance`;

      // Process files
      const fileContents: any[] = [];

      for (const file of files) {
        if (file.mimetype.startsWith('image/')) {
          // Convert image to base64
          const base64Image = file.buffer.toString('base64');
          const dataUrl = `data:${file.mimetype};base64,${base64Image}`;

          fileContents.push({
            type: 'image_url',
            image_url: {
              url: dataUrl
            }
          });
        } else if (file.mimetype === 'application/pdf') {
          // For PDFs, we would need pdf-parse or similar
          // For now, we'll inform the user that PDF text extraction requires additional setup
          // You can install: npm install pdf-parse
          fileContents.push({
            type: 'text',
            text: `[PDF file: ${file.originalname} - PDF text extraction requires pdf-parse package. Please install it: npm install pdf-parse @types/pdf-parse]`
          });
        }
      }

      // Prepare messages
      const messages: any[] = [
        { role: 'system', content: systemPrompt },
        ...(history || []).slice(-10), // Keep last 10 history messages
      ];

      // Add user message with file content
      const userMessageContent: any[] = [
        { type: 'text', text: userQuery }
      ];

      if (fileContents.length > 0) {
        userMessageContent.push(...fileContents);
      }

      messages.push({
        role: 'user',
        content: userMessageContent
      });

      // Generate response using OpenRouter with vision model
      let aiResponse: string;
      try {
        // Use a vision-capable model for images
        const model = fileContents.some(f => f.type === 'image_url')
          ? 'openai/gpt-4o' // Vision model - you can change to deepseek/deepseek-vl if available
          : 'deepseek/deepseek-chat';

        const response = await this.openai.chat.completions.create({
          model: model,
          messages: messages,
          temperature: 0.7,
          max_tokens: 2000,
        });

        aiResponse = response.choices[0]?.message?.content || '';
      } catch (error: any) {
        console.error('Error generating response with files:', error);

        if (error?.status === 401 || error?.code === 'authentication_error') {
          throw new Error('OpenRouter API authentication failed. Please verify your API key is correct and valid.');
        }

        if (error?.status === 429) {
          throw new Error('OpenRouter API quota exceeded. Please check your OpenRouter API settings.');
        }

        throw error;
      }

      return {
        response: aiResponse,
        context: [],
        sources: files.map(f => ({ name: f.originalname, type: f.mimetype, size: f.size })),
      };
    } catch (error: any) {
      console.error('Error generating RAG response with files:', error);
      throw new Error(`Failed to generate AI response with files: ${error?.message || 'Unknown error'}`);
    }
  }

  /**
   * Get personalized recommendations based on user progress
   */
  async getPersonalizedRecommendations(userId: number, limit: number = 3) {
    try {
      // Get user's course progress
      const userProgress = await this.prisma.userCourseProgress.findMany({
        where: { userId },
        include: { course: true },
      });

      // Get user's completed challenges
      const completedChallenges = await this.prisma.completedChallenges.findMany({
        where: { userId },
        include: { challenge: true },
      });

      // Create a query based on user's interests and progress
      const interests = [
        ...userProgress.map(p => p.course.category),
        ...completedChallenges.map(c => c.challenge.difficulty),
      ].join(' ');

      if (!interests) {
        return [];
      }

      // Embeddings service removed - return empty results for now
      return [];
    } catch (error) {
      console.error('Error getting personalized recommendations:', error);
      return [];
    }
  }
}
