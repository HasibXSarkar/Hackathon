import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    const modelName = this.configService.get<string>('GEMINI_MODEL') || 'gemini-1.5-flash';
    this.model = this.genAI.getGenerativeModel({ model: modelName });
    
    this.logger.log(`Gemini service initialized with model: ${modelName}`);
  }

  async generateCodeSkeleton(
    ticket: string,
    projectContext: string,
  ): Promise<string> {
    try {
      const prompt = this.buildPrompt(ticket, projectContext);
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      this.logger.log('Code skeleton generated successfully');
      return text;
    } catch (error) {
      this.logger.error('Error generating code skeleton:', error);
      throw new Error(`Failed to generate code skeleton: ${error.message}`);
    }
  }

  private buildPrompt(ticket: string, projectContext: string): string {
    return `You are a senior software engineer helping to scaffold code for a new feature or bug fix.

PROJECT CONTEXT:
${projectContext}

TICKET/REQUIREMENT:
${ticket}

TASK:
Generate a code skeleton that includes:
1. List of files to create or modify
2. Function signatures with parameter types
3. Class/interface definitions
4. Route definitions (if applicable)
5. Database schema changes (if applicable)
6. TODO comments for implementation details
7. Import statements

Follow the existing code patterns and conventions from the project context.
Provide clear, actionable code scaffolding that a developer can immediately start implementing.

Format your response as structured code blocks with file paths and explanations.`;
  }

  async testConnection(): Promise<boolean> {
    try {
      const result = await this.model.generateContent('Hello, respond with "OK"');
      const response = await result.response;
      const text = response.text();
      
      this.logger.log('Gemini API connection test successful');
      return text.includes('OK');
    } catch (error) {
      this.logger.error('Gemini API connection test failed:', error);
      return false;
    }
  }
}
