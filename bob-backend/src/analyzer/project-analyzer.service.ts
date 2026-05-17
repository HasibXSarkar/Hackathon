import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs/promises';
import * as path from 'path';

interface ProjectStructure {
  files: string[];
  directories: string[];
  fileContents: Map<string, string>;
}

@Injectable()
export class ProjectAnalyzerService {
  private readonly logger = new Logger(ProjectAnalyzerService.name);
  private readonly allowedExtensions: Set<string>;
  private readonly maxFileSizeMB: number;
  private readonly ignoredDirs = new Set([
    'node_modules',
    '.git',
    'dist',
    'build',
    'coverage',
    '.next',
    '__pycache__',
    'venv',
    '.venv',
  ]);

  constructor(private configService: ConfigService) {
    const extensions = this.configService.get<string>('ALLOWED_EXTENSIONS') || 
      '.js,.ts,.jsx,.tsx,.py,.java,.go,.cs,.php,.rb,.vue,.html,.css,.scss';
    this.allowedExtensions = new Set(extensions.split(','));
    this.maxFileSizeMB = this.configService.get<number>('MAX_PROJECT_SIZE_MB') || 50;
  }

  async analyzeProject(projectPath: string): Promise<string> {
    try {
      // Remove quotes and normalize path
      const cleanPath = projectPath.replace(/^["']|["']$/g, '').trim();
      this.logger.log(`Analyzing project at: ${cleanPath}`);
      
      const structure = await this.scanDirectory(cleanPath);
      const context = this.buildProjectContext(structure, cleanPath);
      
      this.logger.log(`Project analysis complete. Found ${structure.files.length} files`);
      return context;
    } catch (error) {
      this.logger.error('Error analyzing project:', error);
      throw new Error(`Failed to analyze project: ${error.message}`);
    }
  }

  private async scanDirectory(
    dirPath: string,
    structure: ProjectStructure = { files: [], directories: [], fileContents: new Map() },
    baseDir: string = dirPath,
  ): Promise<ProjectStructure> {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        const relativePath = path.relative(baseDir, fullPath);

        if (entry.isDirectory()) {
          if (this.ignoredDirs.has(entry.name)) {
            continue;
          }
          structure.directories.push(relativePath);
          await this.scanDirectory(fullPath, structure, baseDir);
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name);
          if (this.allowedExtensions.has(ext)) {
            structure.files.push(relativePath);
            
            // Read file content for important files
            if (this.isImportantFile(entry.name)) {
              try {
                const content = await fs.readFile(fullPath, 'utf-8');
                structure.fileContents.set(relativePath, content);
              } catch (error) {
                this.logger.warn(`Could not read file ${relativePath}: ${error.message}`);
              }
            }
          }
        }
      }

      return structure;
    } catch (error) {
      this.logger.error(`Error scanning directory ${dirPath}:`, error);
      throw error;
    }
  }

  private isImportantFile(filename: string): boolean {
    const importantFiles = [
      'package.json',
      'tsconfig.json',
      'nest-cli.json',
      'angular.json',
      'vite.config',
      'webpack.config',
      'tailwind.config',
      'README.md',
      '.env.example',
    ];
    
    return importantFiles.some(important => filename.includes(important));
  }

  private buildProjectContext(structure: ProjectStructure, projectPath: string): string {
    let context = `# Project Analysis\n\n`;
    context += `**Project Path:** ${projectPath}\n`;
    context += `**Total Files:** ${structure.files.length}\n`;
    context += `**Total Directories:** ${structure.directories.length}\n\n`;

    // Directory structure
    context += `## Directory Structure\n\`\`\`\n`;
    structure.directories.slice(0, 50).forEach(dir => {
      context += `${dir}/\n`;
    });
    if (structure.directories.length > 50) {
      context += `... and ${structure.directories.length - 50} more directories\n`;
    }
    context += `\`\`\`\n\n`;

    // File list
    context += `## Files\n\`\`\`\n`;
    structure.files.slice(0, 100).forEach(file => {
      context += `${file}\n`;
    });
    if (structure.files.length > 100) {
      context += `... and ${structure.files.length - 100} more files\n`;
    }
    context += `\`\`\`\n\n`;

    // Important file contents
    if (structure.fileContents.size > 0) {
      context += `## Key Configuration Files\n\n`;
      structure.fileContents.forEach((content, filePath) => {
        context += `### ${filePath}\n\`\`\`\n${content.slice(0, 1000)}\n\`\`\`\n\n`;
      });
    }

    // Detect tech stack
    context += `## Detected Technologies\n`;
    context += this.detectTechStack(structure);

    return context;
  }

  private detectTechStack(structure: ProjectStructure): string {
    const technologies: string[] = [];

    if (structure.files.some(f => f.endsWith('.ts') || f.endsWith('.tsx'))) {
      technologies.push('TypeScript');
    }
    if (structure.files.some(f => f.includes('nest-cli.json'))) {
      technologies.push('NestJS');
    }
    if (structure.files.some(f => f.includes('angular.json'))) {
      technologies.push('Angular');
    }
    if (structure.files.some(f => f.includes('vite.config'))) {
      technologies.push('Vite');
    }
    if (structure.files.some(f => f.endsWith('.vue'))) {
      technologies.push('Vue.js');
    }
    if (structure.files.some(f => f.endsWith('.jsx') || f.endsWith('.tsx'))) {
      technologies.push('React');
    }
    if (structure.files.some(f => f.includes('tailwind.config'))) {
      technologies.push('Tailwind CSS');
    }
    if (structure.files.some(f => f.endsWith('.py'))) {
      technologies.push('Python');
    }

    return technologies.length > 0 
      ? `- ${technologies.join('\n- ')}\n\n`
      : '- Unable to detect specific technologies\n\n';
  }
}
