import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class GenerateSkeletonDto {
  @IsString()
  @IsNotEmpty()
  ticket: string;

  @IsString()
  @IsNotEmpty()
  projectPath: string;
}

export class QuickGenerateDto {
  @IsString()
  @IsNotEmpty()
  ticket: string;
}

export class AnalyzeProjectDto {
  @IsString()
  @IsNotEmpty()
  projectPath: string;
}
