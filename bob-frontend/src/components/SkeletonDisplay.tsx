import React, { useState } from 'react';

interface SkeletonDisplayProps {
  skeleton: string;
  projectContext?: string;
}

export const SkeletonDisplay: React.FC<SkeletonDisplayProps> = ({ skeleton, projectContext }) => {
  const [copied, setCopied] = useState(false);
  const [showContext, setShowContext] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(skeleton);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 overflow-hidden animate-fadeIn">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full blur-3xl opacity-20 -z-0"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-100 to-cyan-100 rounded-full blur-3xl opacity-20 -z-0"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Generated Code Skeleton
              </h2>
              <p className="text-sm text-gray-500 mt-1">Ready to implement 🚀</p>
            </div>
          </div>
          <button
            onClick={handleCopy}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
              copied 
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
                : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700'
            }`}
          >
            {copied ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Copied!</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>

        {/* Skeleton Content */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-200"></div>
          <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-2xl">
            <div className="flex items-center justify-between px-6 py-3 bg-gray-800/50 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="text-gray-400 text-sm font-mono ml-4">skeleton.code</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <span>Code</span>
              </div>
            </div>
            <pre className="p-6 overflow-x-auto max-h-[600px] scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
              <code className="text-sm font-mono text-gray-100 whitespace-pre-wrap leading-relaxed">{skeleton}</code>
            </pre>
          </div>
        </div>

        {/* Project Context Toggle */}
        {projectContext && (
          <div className="mt-6 border-t-2 border-gray-100 pt-6">
            <button
              onClick={() => setShowContext(!showContext)}
              className="flex items-center space-x-3 text-indigo-600 hover:text-indigo-700 font-semibold transition-colors duration-200 group"
            >
              <div className={`p-2 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors duration-200 ${showContext ? 'rotate-90' : ''}`}>
                <svg
                  className="w-5 h-5 transform transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <span className="text-lg">{showContext ? 'Hide' : 'Show'} Project Context</span>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold">
                Analysis
              </span>
            </button>

            {showContext && (
              <div className="mt-4 animate-fadeIn">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-200"></div>
                  <div className="relative bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl overflow-hidden border-2 border-blue-100 shadow-lg">
                    <div className="px-6 py-3 bg-blue-100/50 border-b border-blue-200">
                      <div className="flex items-center space-x-2 text-blue-800 font-semibold">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                        </svg>
                        <span>Project Analysis Details</span>
                      </div>
                    </div>
                    <pre className="p-6 overflow-x-auto max-h-96 text-gray-800 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-50">
                      <code className="text-xs font-mono whitespace-pre-wrap leading-relaxed">{projectContext}</code>
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Success message */}
        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-green-900 font-bold text-lg">Skeleton Generated Successfully!</h3>
              <p className="text-green-700 mt-1 text-sm">
                Your code scaffold is ready. Copy it and start implementing the TODOs. Happy coding! 🎉
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};