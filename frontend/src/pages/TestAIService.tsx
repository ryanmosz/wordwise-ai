import { useState } from 'react'
import { useSuggestions } from '../hooks/useSuggestions'
import { LoadingSpinner } from '../components/common/LoadingSpinner'

export function TestAIService() {
  const [text, setText] = useState('This are a test sentence with eror. Our product is good and we offer great service.')
  const [documentId] = useState('test-doc-' + Date.now())
  const [enabled, setEnabled] = useState(true)
  
  const { suggestions, isLoading, error, acceptSuggestion, rejectSuggestion } = useSuggestions({
    text,
    documentId,
    enabled,
    userSettings: {
      brandTone: 'professional',
      readingLevel: 8,
      bannedWords: ['great']
    }
  })
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">AI Service Integration Test</h1>
      
      {/* Text Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Test Text</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-3 border rounded-lg h-32 font-mono text-sm"
          placeholder="Type or paste text here..."
        />
        <div className="mt-2 text-sm text-gray-600">
          Document ID: {documentId}
        </div>
      </div>
      
      {/* Controls */}
      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setEnabled(!enabled)}
          className={`px-4 py-2 rounded ${enabled ? 'bg-green-600 text-white' : 'bg-gray-300'}`}
        >
          Analysis: {enabled ? 'Enabled' : 'Disabled'}
        </button>
        <button
          onClick={() => setText('')}
          className="px-4 py-2 bg-gray-600 text-white rounded"
        >
          Clear Text
        </button>
      </div>
      
      {/* Status */}
      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h2 className="font-semibold mb-2">Status</h2>
        <div className="space-y-1 text-sm">
          <div>Loading: {isLoading ? <span className="text-blue-600">Yes</span> : 'No'}</div>
          <div>Error: {error ? <span className="text-red-600">{error.message}</span> : 'None'}</div>
          <div>Suggestions: {suggestions.length}</div>
        </div>
      </div>
      
      {/* Loading Indicator */}
      {isLoading && (
        <div className="mb-6 flex items-center gap-2 text-blue-600">
          <LoadingSpinner size="sm" />
          <span>Analyzing text...</span>
        </div>
      )}
      
      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Suggestions ({suggestions.length})</h2>
          {suggestions.map((suggestion) => (
            <div key={suggestion.id} className="border rounded-lg p-4 bg-white">
              <div className="flex justify-between items-start mb-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  suggestion.type === 'grammar' ? 'bg-red-100 text-red-700' :
                  suggestion.type === 'tone' ? 'bg-yellow-100 text-yellow-700' :
                  suggestion.type === 'persuasive' ? 'bg-blue-100 text-blue-700' :
                  suggestion.type === 'vocabulary' ? 'bg-purple-100 text-purple-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {suggestion.type}
                </span>
                <span className="text-sm text-gray-500">
                  Confidence: {(suggestion.confidence * 100).toFixed(0)}%
                </span>
              </div>
              
              <div className="mb-2">
                <div className="text-sm text-gray-600">Original:</div>
                <div className="font-mono text-red-600 line-through">{suggestion.originalText}</div>
              </div>
              
              <div className="mb-2">
                <div className="text-sm text-gray-600">Suggestion:</div>
                <div className="font-mono text-green-600">{suggestion.suggestionText}</div>
              </div>
              
              <div className="mb-4">
                <div className="text-sm text-gray-600">Explanation:</div>
                <div className="text-sm">{suggestion.explanation}</div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => acceptSuggestion(suggestion.id)}
                  className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                >
                  Accept
                </button>
                <button
                  onClick={() => rejectSuggestion(suggestion.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Debug Info */}
      <div className="mt-8 p-4 bg-gray-900 text-gray-100 rounded font-mono text-xs">
        <h3 className="font-bold mb-2">Debug Info</h3>
        <pre>{JSON.stringify({
          textLength: text.length,
          documentId,
          enabled,
          isLoading,
          error: error?.message || null,
          suggestionsCount: suggestions.length,
          suggestionTypes: suggestions.map(s => s.type)
        }, null, 2)}</pre>
      </div>
    </div>
  )
} 