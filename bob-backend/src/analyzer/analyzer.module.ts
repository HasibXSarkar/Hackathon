import { Module } from '@nestjs/common';
import { ProjectAnalyzerService } from './project-analyzer.service';

@Module({
  providers: [ProjectAnalyzerService],
  exports: [ProjectAnalyzerService],
})
export class AnalyzerModule {}
