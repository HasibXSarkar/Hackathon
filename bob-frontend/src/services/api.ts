const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface GenerateSkeletonRequest {
  ticket: string;
  projectPath: string;
}

export interface QuickGenerateRequest {
  ticket: string;
}

export interface AnalyzeProjectRequest {
  projectPath: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  services: {
    gemini: string;
  };
}

export interface GenerateResponse {
  skeleton: string;
  projectContext?: string;
}

export interface AnalyzeResponse {
  context: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'An error occurred',
        };
      }

      return data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  async healthCheck(): Promise<HealthResponse | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/health`);
      return await response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      return null;
    }
  }

  async generateSkeleton(
    request: GenerateSkeletonRequest
  ): Promise<ApiResponse<GenerateResponse>> {
    return this.request<GenerateResponse>('/api/generate', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async quickGenerate(
    request: QuickGenerateRequest
  ): Promise<ApiResponse<GenerateResponse>> {
    return this.request<GenerateResponse>('/api/quick-generate', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async analyzeProject(
    request: AnalyzeProjectRequest
  ): Promise<ApiResponse<AnalyzeResponse>> {
    return this.request<AnalyzeResponse>('/api/analyze', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }
}

export const apiService = new ApiService();
