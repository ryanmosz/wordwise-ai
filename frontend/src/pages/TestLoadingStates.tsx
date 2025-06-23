import { useState } from 'react'
import { LoadingSpinner } from '../components/common/LoadingSpinner'
import { useSuggestions } from '../hooks/useSuggestions'

export function TestLoadingStates() {
  const [text, setText] = useState('')
  const [enabled, setEnabled] = useState(true)
  
  // Use suggestions hook
  const { suggestions, isLoading, error } = useSuggestions({
    text,
    documentId: 'test-doc-123',
    enabled
  })
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">
          Loading States Test Page
        </h1>
        
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="mb-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                className="rounded border-slate-300"
              />
              <span className="text-slate-700">Enable AI Analysis</span>
            </label>
          </div>
          
          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Start typing here... (minimum 10 characters)"
              className="w-full h-48 p-4 border-2 border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            
            {/* Editor overlay indicator */}
            {isLoading && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-2 right-2">
                  <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm animate-pulse">
                    AI analyzing...
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Status bar */}
          <div className="mt-4 p-3 bg-slate-50 rounded-lg flex items-center justify-between">
            <div className="text-sm text-slate-600">
              Characters: {text.length} | Words: {text.split(/\s+/).filter(w => w).length}
            </div>
            {isLoading && (
              <span className="flex items-center text-sm text-blue-600">
                <LoadingSpinner size="sm" />
                <span className="ml-2">Analyzing...</span>
              </span>
            )}
          </div>
        </div>
        
        {/* Debug information */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Debug Info</h2>
          <div className="space-y-2 font-mono text-sm">
            <div>isLoading: <span className={isLoading ? 'text-green-600' : 'text-red-600'}>{String(isLoading)}</span></div>
            <div>enabled: <span className={enabled ? 'text-green-600' : 'text-red-600'}>{String(enabled)}</span></div>
            <div>text length: {text.length}</div>
            <div>suggestions count: {suggestions.length}</div>
            <div>error: {error ? error.message : 'none'}</div>
          </div>
          
          {suggestions.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold text-slate-700 mb-2">Suggestions:</h3>
              <div className="space-y-2">
                {suggestions.map((s, i) => (
                  <div key={i} className="p-2 bg-slate-50 rounded text-sm">
                    <span className="font-medium">{s.type}:</span> {s.suggestion}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Instructions */}
        <div className="mt-6 bg-blue-50 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Testing Instructions:</h3>
          <ol className="list-decimal list-inside space-y-1 text-blue-800">
            <li>Type at least 10 characters in the text area</li>
            <li>Stop typing and wait 2 seconds</li>
            <li>You should see "AI analyzing..." badge appear in the editor</li>
            <li>You should see "Analyzing..." in the status bar</li>
            <li>Both indicators should disappear when analysis completes</li>
            <li>Try toggling the "Enable AI Analysis" checkbox</li>
          </ol>
        </div>
      </div>
      
      {/* W3M debug info */}
      <div className="sr-only" data-testid="loading-test-debug">
        DEBUG: TestLoadingStates isLoading={String(isLoading)} enabled={String(enabled)} textLength={text.length} suggestionsCount={suggestions.length}
      </div>
    </div>
  )
} 