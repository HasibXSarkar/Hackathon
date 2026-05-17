import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { GeneratorModule } from '../generator/generator.module';
import { AnalyzerModule } from '../analyzer/analyzer.module';
import { GeminiModule } from '../gemini/gemini.module';

@Module({
  imports: [GeneratorModule, AnalyzerModule, GeminiModule],
  controllers: [ApiController],
})
export class ApiModule {}
