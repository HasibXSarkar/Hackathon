import { Module } from '@nestjs/common';
import { SkeletonGeneratorService } from './skeleton-generator.service';
import { GeminiModule } from '../gemini/gemini.module';
import { AnalyzerModule } from '../analyzer/analyzer.module';

@Module({
  imports: [GeminiModule, AnalyzerModule],
  providers: [SkeletonGeneratorService],
  exports: [SkeletonGeneratorService],
})
export class GeneratorModule {}
