import React, { useState } from 'react';

interface TicketFormProps {
  onSubmit: (ticket: string, projectPath: string, isQuickMode: boolean) => void;
  isLoading: boolean;
}

export const TicketForm: React.FC<TicketFormProps> = ({ onSubmit, isLoading }) => {
  const [ticket, setTicket] = useState('');
  const [projectPath, setProjectPath] = useState('');
  const [isQuickMode, setIsQuickMode] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ticket.trim()) {
      onSubmit(ticket, projectPath, isQuickMode);
    }
  };

  return (
    <div className="relative bg-white rounded-2xl shadow-xl p-8 border border-gray-100 overflow-hidden">
      {/* Decorative gradient background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full blur-3xl opacity-30 -z-0"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-100 to-indigo-100 rounded-full blur-3xl opacity-30 -z-0"></div>
      
      <div className="relative z-10">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Generate Code Skeleton
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Ticket Input */}
          <div className="group">
            <label htmlFor="ticket" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
              <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full"></span>
              <span>Feature Description</span>
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <textarea
                id="ticket"
                value={ticket}
                onChange={(e) => setTicket(e.target.value)}
                placeholder="e.g., Add user authentication with JWT tokens, including login and registration endpoints with email verification..."
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200 resize-none text-gray-700 placeholder-gray-400 shadow-sm hover:border-gray-300"
                rows={5}
                required
                disabled={isLoading}
              />
              <div className="absolute bottom-3 right-3 text-xs text-gray-400 font-medium">
                {ticket.length} characters
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500 flex items-center space-x-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span>Describe the feature or bug fix you want to implement</span>
            </p>
          </div>

          {/* Quick Mode Toggle */}
          <div className="relative">
            <div className="flex items-center space-x-4 p-5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border-2 border-indigo-100 hover:border-indigo-200 transition-all duration-200">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  id="quickMode"
                  checked={isQuickMode}
                  onChange={(e) => setIsQuickMode(e.target.checked)}
                  className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2 cursor-pointer"
                  disabled={isLoading}
                />
              </div>
              <label htmlFor="quickMode" className="flex-1 cursor-pointer">
                <div className="font-semibold text-gray-800 flex items-center space-x-2">
                  <span>⚡ Quick Mode</span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Generate without project context (faster, generic output)
                </div>
              </label>
            </div>
          </div>

          {/* Project Path Input */}
          {!isQuickMode && (
            <div className="group animate-fadeIn">
              <label htmlFor="projectPath" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
                <span className="inline-block w-2 h-2 bg-purple-500 rounded-full"></span>
                <span>Project Path</span>
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="projectPath"
                  value={projectPath}
                  onChange={(e) => setProjectPath(e.target.value)}
                  placeholder="C:\Users\YourName\Projects\MyApp"
                  className="w-full pl-12 pr-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200 text-gray-700 placeholder-gray-400 shadow-sm hover:border-gray-300"
                  required={!isQuickMode}
                  disabled={isLoading}
                />
              </div>
              <p className="mt-2 text-sm text-gray-500 flex items-center space-x-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span>Absolute path to your project directory</span>
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !ticket.trim() || (!isQuickMode && !projectPath.trim())}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold py-5 px-8 rounded-xl transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-lg">Generating Magic...</span>
              </>
            ) : (
              <>
                <span className="text-2xl">🏗️</span>
                <span className="text-lg">Generate Skeleton</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};