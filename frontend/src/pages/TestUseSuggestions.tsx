import React, { useState } from 'react'
import { useSuggestions } from '../hooks/useSuggestions'

export function TestUseSuggestions() {
  const [text, setText] = useState('')
  const [documentId] = useState('test-doc-123')
  
  const {
    suggestions,
    isLoading,
    error,
    acceptSuggestion,
    rejectSuggestion,
    debugInfo
  } = useSuggestions({
    text,
    documentId,
    enabled: true,
    userSettings: {
      brandTone: 'professional',
      readingLevel: 8,
      bannedWords: []
    }
  })

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-slate-800">Test useSuggestions Hook</h1>
        
        {/* Text Input */}
        <div className="mb-6">
          <label htmlFor="test-text" className="block text-sm font-medium text-slate-700 mb-2">
            Enter Text (try "This are a test" or "Hey there, this is good"):
          </label>
          <textarea
            id="test-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-800/20 focus:border-slate-800 transition-all duration-200"
            rows={4}
            placeholder="Type at least 10 characters to trigger analysis..."
          />
          <p className="mt-1 text-sm text-slate-500">
            Text length: {text.length} characters
          </p>
        </div>

        {/* Status */}
        <div className="mb-6 p-4 bg-white rounded-xl border border-slate-200">
          <h2 className="text-lg font-semibold mb-2 text-slate-800">Status</h2>
          <ul className="space-y-1 text-sm">
            <li>Loading: <span className={isLoading ? 'text-blue-600' : 'text-slate-600'}>{isLoading ? 'Yes' : 'No'}</span></li>
            <li>Error: <span className={error ? 'text-red-600' : 'text-slate-600'}>{error?.message || 'None'}</span></li>
            <li>Suggestions: <span className="text-slate-600">{suggestions.length}</span></li>
          </ul>
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3 text-slate-800">Suggestions</h2>
            <div className="space-y-3">
              {suggestions.map((suggestion) => (
                <div key={suggestion.id} className="p-4 bg-white rounded-xl border border-slate-200">
                  <div className="flex items-start justify-between mb-2">
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-md ${
                      suggestion.type === 'grammar' ? 'bg-red-100 text-red-700' :
                      suggestion.type === 'tone' ? 'bg-yellow-100 text-yellow-700' :
                      suggestion.type === 'persuasive' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {suggestion.type}
                    </span>
                    <span className="text-sm text-slate-500">
                      Confidence: {(suggestion.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  
                  <div className="mb-2">
                    <p className="text-sm text-slate-600">
                      <span className="line-through">{suggestion.originalText}</span>
                      {' → '}
                      <span className="font-medium text-green-600">{suggestion.suggestionText}</span>
                    </p>
                  </div>
                  
                  <p className="text-sm text-slate-600 mb-3">{suggestion.explanation}</p>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => acceptSuggestion(suggestion.id)}
                      disabled={suggestion.accepted !== null}
                      className="px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      {suggestion.accepted === true ? 'Accepted' : 'Accept'}
                    </button>
                    <button
                      onClick={() => rejectSuggestion(suggestion.id)}
                      disabled={suggestion.accepted !== null}
                      className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      {suggestion.accepted === false ? 'Rejected' : 'Reject'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Debug Info */}
        {debugInfo && (
          <div className="mb-6 p-4 bg-slate-100 rounded-xl font-mono text-xs">
            <h3 className="font-bold mb-2">Debug Info:</h3>
            <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
          </div>
        )}

        {/* W3M Debug Section */}
        <div className="sr-only" data-testid="debug-info">
          DEBUG: TestUseSuggestions Page
          Text Length: {text.length}
          Loading: {isLoading}
          Error: {error?.message || 'none'}
          Suggestions: {suggestions.length}
          {suggestions.map(s => `[${s.type}:${s.accepted === null ? 'pending' : s.accepted ? 'accepted' : 'rejected'}]`).join(' ')}
        </div>

        {/* Hidden element for hook to update */}
        <pre id="useSuggestions-debug" className="sr-only"></pre>
      </div>
    </div>
  )
} 