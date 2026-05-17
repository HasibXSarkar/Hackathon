import { Injectable, Logger } from '@nestjs/common';
import { GeminiService } from '../gemini/gemini.service';
import { ProjectAnalyzerService } from '../analyzer/project-analyzer.service';

export interface GenerateSkeletonRequest {
  ticket: string;
  projectPath: string;
}

export interface GenerateSkeletonResponse {
  success: boolean;
  skeleton: string;
  projectContext?: string;
  error?: string;
}

@Injectable()
export class SkeletonGeneratorService {
  private readonly logger = new Logger(SkeletonGeneratorService.name);

  constructor(
    private readonly geminiService: GeminiService,
    private readonly analyzerService: ProjectAnalyzerService,
  ) {}

  async generateSkeleton(
    request: GenerateSkeletonRequest,
  ): Promise<GenerateSkeletonResponse> {
    try {
      this.logger.log(`Generating skeleton for ticket at path: ${request.projectPath}`);

      // Step 1: Analyze the project
      const projectContext = await this.analyzerService.analyzeProject(
        request.projectPath,
      );

      // Step 2: Generate skeleton using Gemini
      const skeleton = await this.geminiService.generateCodeSkeleton(
        request.ticket,
        projectContext,
      );

      this.logger.log('Skeleton generation completed successfully');

      return {
        success: true,
        skeleton,
        projectContext,
      };
    } catch (error) {
      this.logger.error('Error generating skeleton:', error);
      return {
        success: false,
        skeleton: '',
        error: error.message,
      };
    }
  }

  async quickGenerate(ticket: string): Promise<string> {
    try {
      // For quick generation without project context
      const simpleContext = 'No project context provided. Generate a generic code skeleton.';
      return await this.geminiService.generateCodeSkeleton(ticket, simpleContext);
    } catch (error) {
      this.logger.error('Error in quick generate:', error);
      throw error;
    }
  }
}
