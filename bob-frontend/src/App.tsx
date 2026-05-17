import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TicketForm } from './components/TicketForm';
import { SkeletonDisplay } from './components/SkeletonDisplay';
import { apiService } from './services/api';
import type { HealthResponse } from './services/api';
import './App.css';

function App() {
  const [skeleton, setSkeleton] = useState<string>('');
  const [projectContext, setProjectContext] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [health, setHealth] = useState<HealthResponse | null>(null);

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    const healthData = await apiService.healthCheck();
    setHealth(healthData);
  };

  const handleGenerate = async (ticket: string, projectPath: string, isQuickMode: boolean) => {
    setIsLoading(true);
    setError('');
    setSkeleton('');
    setProjectContext('');

    try {
      let response;
      
      if (isQuickMode) {
        response = await apiService.quickGenerate({ ticket });
      } else {
        response = await apiService.generateSkeleton({ ticket, projectPath });
      }

      if (response.success && response.data) {
        setSkeleton(response.data.skeleton);
        setProjectContext(response.data.projectContext || '');
      } else {
        setError(response.error || 'Failed to generate skeleton');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <Header />
      
      {/* Status Bar */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-600">Backend:</span>
                {health ? (
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
                    health.services.gemini === 'connected' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    <span className={`w-2 h-2 rounded-full animate-pulse ${
                      health.services.gemini === 'connected' ? 'bg-green-500' : 'bg-red-500'
                    }`}></span>
                    <span className="text-xs font-semibold">
                      {health.services.gemini === 'connected' ? 'Connected' : 'Disconnected'}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 px-3 py-1 bg-gray-100 text-gray-500 rounded-full">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                    <span className="text-xs font-semibold">Checking...</span>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-600">Gemini AI:</span>
                {health?.services.gemini === 'connected' ? (
                  <div className="flex items-center space-x-1 text-green-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs font-semibold">Ready</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1 text-red-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs font-semibold">Offline</span>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={checkHealth}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="relative overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl shadow-2xl p-8 text-white">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-4xl font-black mb-3 flex items-center space-x-3">
                    <span>Welcome to Bob the Builder!</span>
                    <span className="text-5xl animate-bounce">🏗️</span>
                  </h2>
                  <p className="text-xl text-purple-100 leading-relaxed max-w-3xl">
                    Transform your feature tickets into ready-to-code skeletons instantly. Bob analyzes your project structure,
                    understands your coding patterns, and generates function signatures, route definitions, and TODO comments
                    to eliminate the "blank page" problem.
                  </p>
                  <div className="mt-6 flex items-center space-x-4">
                    <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                      </svg>
                      <span className="font-semibold">AI-Powered</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      <span className="font-semibold">Instant Results</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-semibold">Context-Aware</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <TicketForm onSubmit={handleGenerate} isLoading={isLoading} />

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 shadow-lg animate-fadeIn">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="p-2 bg-red-100 rounded-xl">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-red-900 font-bold text-lg">Oops! Something went wrong</h3>
                  <p className="text-red-800 mt-2">{error}</p>
                  <button
                    onClick={() => setError('')}
                    className="mt-4 text-sm font-medium text-red-600 hover:text-red-700 underline"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Skeleton Display */}
          {skeleton && (
            <SkeletonDisplay skeleton={skeleton} projectContext={projectContext} />
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="bg-white rounded-2xl shadow-2xl p-16 border border-gray-100 animate-fadeIn">
              <div className="flex flex-col items-center justify-center space-y-6">
                <div className="relative">
                  <div className="w-24 h-24 border-8 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl">🏗️</span>
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Generating Your Code Skeleton...
                  </h3>
                  <p className="text-gray-600 text-lg">Bob is analyzing your project and crafting the perfect scaffold</p>
                  <div className="flex items-center justify-center space-x-2 mt-4">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-pink-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 mt-16">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <p className="text-gray-600 font-medium">
              Built with <span className="text-red-500">❤️</span> using{' '}
              <span className="font-bold text-indigo-600">NestJS</span>,{' '}
              <span className="font-bold text-blue-600">React</span>,{' '}
              <span className="font-bold text-purple-600">Vite</span>,{' '}
              <span className="font-bold text-cyan-600">Tailwind CSS</span>, and{' '}
              <span className="font-bold text-pink-600">Gemini AI</span>
            </p>
            <p className="text-gray-500 text-sm mt-2">
              © 2026 Bob the Builder. Eliminating blank pages, one skeleton at a time.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
