import { Controller, Post, Get, Body, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { SkeletonGeneratorService } from '../generator/skeleton-generator.service';
import { ProjectAnalyzerService } from '../analyzer/project-analyzer.service';
import { GeminiService } from '../gemini/gemini.service';
import { GenerateSkeletonDto, QuickGenerateDto, AnalyzeProjectDto } from './dto/generate-skeleton.dto';

@Controller('api')
export class ApiController {
  private readonly logger = new Logger(ApiController.name);

  constructor(
    private readonly generatorService: SkeletonGeneratorService,
    private readonly analyzerService: ProjectAnalyzerService,
    private readonly geminiService: GeminiService,
  ) {}

  @Get('health')
  async healthCheck() {
    try {
      const geminiStatus = await this.geminiService.testConnection();
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        services: {
          gemini: geminiStatus ? 'connected' : 'disconnected',
        },
      };
    } catch (error) {
      this.logger.error('Health check failed:', error);
      throw new HttpException(
        {
          status: 'error',
          message: 'Health check failed',
          error: error.message,
        },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  @Post('generate')
  async generateSkeleton(@Body() dto: GenerateSkeletonDto) {
    try {
      this.logger.log(`Received generate request for path: ${dto.projectPath}`);
      
      const result = await this.generatorService.generateSkeleton({
        ticket: dto.ticket,
        projectPath: dto.projectPath,
      });

      if (!result.success) {
        throw new HttpException(
          {
            message: 'Failed to generate skeleton',
            error: result.error,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return {
        success: true,
        data: {
          skeleton: result.skeleton,
          projectContext: result.projectContext,
        },
      };
    } catch (error) {
      this.logger.error('Error in generate endpoint:', error);
      throw new HttpException(
        {
          message: 'Failed to generate skeleton',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('quick-generate')
  async quickGenerate(@Body() dto: QuickGenerateDto) {
    try {
      this.logger.log('Received quick generate request');
      
      const skeleton = await this.generatorService.quickGenerate(dto.ticket);

      return {
        success: true,
        data: {
          skeleton,
        },
      };
    } catch (error) {
      this.logger.error('Error in quick-generate endpoint:', error);
      throw new HttpException(
        {
          message: 'Failed to generate skeleton',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('analyze')
  async analyzeProject(@Body() dto: AnalyzeProjectDto) {
    try {
      this.logger.log(`Received analyze request for path: ${dto.projectPath}`);
      
      const context = await this.analyzerService.analyzeProject(dto.projectPath);

      return {
        success: true,
        data: {
          context,
        },
      };
    } catch (error) {
      this.logger.error('Error in analyze endpoint:', error);
      throw new HttpException(
        {
          message: 'Failed to analyze project',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
