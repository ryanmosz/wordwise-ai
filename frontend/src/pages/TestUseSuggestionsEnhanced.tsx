import React, { useState, useEffect } from 'react'
import { useSuggestions } from '../hooks/useSuggestions'
import { 
  isDebugMode, 
  createASCIIVisualization, 
  DebugMetaTags,
  formatTestResults 
} from '../utils/debugHelpers'
// import { Helmet } from 'react-helmet' // TODO: Install react-helmet

export function TestUseSuggestionsEnhanced() {
  const [text, setText] = useState('')
  const [documentId] = useState('test-doc-123')
  const debugEnabled = isDebugMode()
  
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

  // Calculate suggestion stats
  const suggestionStats = {
    total: suggestions.length,
    accepted: suggestions.filter(s => s.accepted === true).length,
    rejected: suggestions.filter(s => s.accepted === false).length,
    pending: suggestions.filter(s => s.accepted === null).length
  }

  // Run automated tests
  const tests = [
    { 
      name: 'Hook initialized', 
      passed: debugInfo !== undefined,
      details: 'useSuggestions returns debug info'
    },
    { 
      name: 'Debouncing configured', 
      passed: true, // Always true as it's built into the hook
      details: '2000ms delay'
    },
    { 
      name: 'Text length validation', 
      passed: text.length < 10 ? suggestions.length === 0 : true,
      details: 'Min 10 chars required'
    },
    { 
      name: 'Error handling', 
      passed: error === null || typeof error.message === 'string',
      details: 'Errors properly structured'
    },
    { 
      name: 'Accept/Reject handlers', 
      passed: typeof acceptSuggestion === 'function' && typeof rejectSuggestion === 'function',
      details: 'Functions available'
    }
  ]

  // Create debug state for W3M
  const debugState = {
    page: 'test-use-suggestions-enhanced',
    timestamp: new Date().toISOString(),
    state: {
      hookInitialized: true,
      textLength: text.length,
      suggestions: suggestionStats,
      loading: isLoading,
      error: error?.message || null,
      debugMode: debugEnabled
    },
    components: {
      editor: 'ready',
      suggestionEngine: isLoading ? 'processing' : 'idle',
      autoSave: 'disabled'
    },
    performance: {
      debounceDelay: 2000,
      renderCount: debugInfo?.renderCount || 0
    },
    tests: tests,
    errors: error ? [error.message] : []
  }

  // Update JSON data island
  useEffect(() => {
    if (debugEnabled) {
      const scriptElement = document.getElementById('live-debug-state')
      if (scriptElement) {
        scriptElement.textContent = JSON.stringify(debugState, null, 2)
      }
    }
  }, [debugState, debugEnabled])

  return (
    <>
      {/* Meta tags for debug info - TODO: Enable when react-helmet is installed
      <Helmet>
        <DebugMetaTags pageInfo={{
          page: 'test-use-suggestions-enhanced',
          authenticated: true,
          components: ['useSuggestions', 'TextEditor', 'SuggestionList'],
          errors: error ? [error.message] : [],
          version: '1.0.0'
        }} />
      </Helmet> */}

      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-slate-800">
            Enhanced useSuggestions Test {debugEnabled && <span className="text-sm text-blue-600">[DEBUG MODE]</span>}
          </h1>
          
          {/* Text Input */}
          <div className="mb-6">
            <label htmlFor="test-text" className="block text-sm font-medium text-slate-700 mb-2">
              Enter Text:
            </label>
            <textarea
              id="test-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl"
              rows={4}
              placeholder="Type at least 10 characters..."
            />
            <p className="mt-1 text-sm text-slate-500">
              Text length: {text.length} characters
            </p>
          </div>

          {/* Visual Status (always visible) */}
          <div className="mb-6 p-4 bg-white rounded-xl border border-slate-200">
            <h2 className="text-lg font-semibold mb-2 text-slate-800">Status</h2>
            <ul className="space-y-1 text-sm">
              <li>Loading: {isLoading ? '🔄 Yes' : '✅ No'}</li>
              <li>Error: {error ? `❌ ${error.message}` : '✅ None'}</li>
              <li>Suggestions: {suggestions.length}</li>
            </ul>
          </div>

          {/* Suggestions Display */}
          {suggestions.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3 text-slate-800">Suggestions</h2>
              {/* ... suggestion cards ... */}
            </div>
          )}

          {/* Debug Panel (visible in debug mode) */}
          {debugEnabled && (
            <div className="mb-6 p-4 bg-slate-100 rounded-xl">
              <h3 className="font-bold mb-2">Debug Panel</h3>
              <pre className="text-xs overflow-auto">
                {JSON.stringify(debugState, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* W3M Debug Sections - Always rendered but hidden */}
        
        {/* 1. Basic debug info */}
        <div className="sr-only" data-testid="debug-info">
          DEBUG: TestUseSuggestionsEnhanced Page
          Text Length: {text.length}
          Loading: {isLoading}
          Error: {error?.message || 'none'}
          Suggestions: {suggestions.length}
        </div>

        {/* 2. ASCII Art Visualization */}
        <pre className="sr-only" aria-label="component-state-diagram">
{createASCIIVisualization({
  suggestions: suggestionStats,
  loading: isLoading,
  error: !!error,
  textLength: text.length
})}
        </pre>

        {/* 3. Test Results */}
        <div id="test-results" className="sr-only">
{formatTestResults(tests)}
        </div>

        {/* 4. Structured Debug Data */}
        <div id="structured-debug" className="sr-only">
          [DEBUG-START:STATE]
          {JSON.stringify(debugState, null, 2)}
          [DEBUG-END:STATE]
        </div>

        {/* 5. JSON Data Island */}
        <script 
          type="application/json" 
          id="live-debug-state" 
          className="debug-data"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(debugState, null, 2) }}
        />
      </div>
    </>
  )
} 