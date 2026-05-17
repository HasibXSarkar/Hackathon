import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiModule } from './api/api.module';
import { GeminiModule } from './gemini/gemini.module';
import { AnalyzerModule } from './analyzer/analyzer.module';
import { GeneratorModule } from './generator/generator.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ApiModule,
    GeminiModule,
    AnalyzerModule,
    GeneratorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
