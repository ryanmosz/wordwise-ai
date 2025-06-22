import { useState } from 'react'
import { useSuggestions } from '../hooks/useSuggestions'
import { useDocumentStore } from '../store/documentStore'
import { withDebugInfo, createASCIIVisualization, formatTestResults } from '../utils/debugHelpers'

interface TestResult {
  name: string
  passed: boolean
  details: string
}

function TestSuggestionStateManagementBase() {
  const [text, setText] = useState('This are a test. Hey there! This is good content.')
  const [testResults, setTestResults] = useState<TestResult[]>([])
  
  // Get store state and methods
  const {
    activeSuggestions,
    suggestionStatus,
    addSuggestions,
    clearSuggestions,
    getSuggestionById
  } = useDocumentStore()
  
  // Use the suggestions hook
  const { 
    suggestions, 
    isLoading, 
    error, 
    acceptSuggestion, 
    rejectSuggestion,
    debugInfo 
  } = useSuggestions({
    text,
    documentId: 'test-doc-123',
    enabled: true,
    userSettings: {
      brandTone: 'professional',
      readingLevel: 8,
      bannedWords: []
    }
  })
  
  // Convert Maps to objects for display
  const suggestionMapDisplay = Object.fromEntries(activeSuggestions.entries())
  const statusMapDisplay = Object.fromEntries(suggestionStatus.entries())
  
  // Test functions
  const runTests = () => {
    const results: TestResult[] = []
    
    // Test 1: Maps are initialized
    results.push({
      name: 'Maps are initialized',
      passed: activeSuggestions instanceof Map && suggestionStatus instanceof Map,
      details: `activeSuggestions: ${activeSuggestions instanceof Map}, suggestionStatus: ${suggestionStatus instanceof Map}`
    })
    
    // Test 2: Suggestions are stored in Map
    results.push({
      name: 'Suggestions are stored in Map',
      passed: suggestions.length === activeSuggestions.size,
      details: `Hook suggestions: ${suggestions.length}, Map size: ${activeSuggestions.size}`
    })
    
    // Test 3: All suggestions have status
    const allHaveStatus = suggestions.every(s => suggestionStatus.has(s.id))
    results.push({
      name: 'All suggestions have status',
      passed: allHaveStatus,
      details: `${suggestions.filter(s => suggestionStatus.has(s.id)).length}/${suggestions.length} have status`
    })
    
    // Test 4: getSuggestionById works
    const firstSuggestion = suggestions[0]
    const retrieved = firstSuggestion ? getSuggestionById(firstSuggestion.id) : null
    results.push({
      name: 'getSuggestionById retrieves correctly',
      passed: retrieved?.id === firstSuggestion?.id,
      details: firstSuggestion ? `Retrieved: ${retrieved?.id === firstSuggestion.id}` : 'No suggestions to test'
    })
    
    setTestResults(results)
  }
  
  // Manual test actions
  const manuallyAddSuggestion = () => {
    const newSuggestion = {
      id: `manual-${Date.now()}`,
      startIndex: 0,
      endIndex: 4,
      type: 'grammar' as const,
      originalText: 'Test',
      suggestionText: 'Testing',
      explanation: 'Manually added suggestion',
      confidence: 0.9,
      accepted: null
    }
    addSuggestions([newSuggestion])
  }
  
  const acceptFirstSuggestion = () => {
    const first = suggestions[0]
    if (first) {
      acceptSuggestion(first.id)
    }
  }
  
  const rejectFirstSuggestion = () => {
    const first = suggestions[0]
    if (first) {
      rejectSuggestion(first.id)
    }
  }
  
  // Create ASCII visualization
  const stateVisualization = createASCIIVisualization({
    title: 'Suggestion State Management',
    sections: [
      {
        name: 'Maps State',
        content: [
          `Active Suggestions: ${activeSuggestions.size} items`,
          `Status Map: ${suggestionStatus.size} items`,
          `Pending: ${Array.from(suggestionStatus.values()).filter(s => s === 'pending').length}`,
          `Accepted: ${Array.from(suggestionStatus.values()).filter(s => s === 'accepted').length}`,
          `Rejected: ${Array.from(suggestionStatus.values()).filter(s => s === 'rejected').length}`
        ]
      },
      {
        name: 'Hook State',
        content: [
          `Loading: ${isLoading ? '✓' : '✗'}`,
          `Error: ${error ? error.message : 'None'}`,
          `Suggestions: ${suggestions.length}`
        ]
      }
    ]
  })
  
  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Suggestion State Management Test</h1>
      
      {/* Text Input */}
      <div style={{ marginBottom: '20px' }}>
        <h2>Test Text</h2>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ width: '100%', height: '100px', fontFamily: 'monospace' }}
        />
      </div>
      
      {/* Control Buttons */}
      <div style={{ marginBottom: '20px' }}>
        <h2>Actions</h2>
        <button onClick={runTests}>Run Tests</button>
        <button onClick={manuallyAddSuggestion}>Add Manual Suggestion</button>
        <button onClick={acceptFirstSuggestion}>Accept First</button>
        <button onClick={rejectFirstSuggestion}>Reject First</button>
        <button onClick={clearSuggestions}>Clear All</button>
      </div>
      
      {/* ASCII Visualization */}
      <div style={{ marginBottom: '20px' }}>
        <h2>State Visualization</h2>
        <pre>{stateVisualization}</pre>
      </div>
      
      {/* Test Results */}
      {testResults.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h2>Test Results</h2>
          <pre>{formatTestResults(testResults)}</pre>
        </div>
      )}
      
      {/* Debug State for W3M */}
      <div id="debug-state" style={{ display: 'none' }}>
        [DEBUG-START:STATE]
        {JSON.stringify({
          activeSuggestions: suggestionMapDisplay,
          suggestionStatus: statusMapDisplay,
          suggestions: suggestions,
          isLoading,
          error: error?.message,
          debugInfo
        }, null, 2)}
        [DEBUG-END:STATE]
      </div>
      
      {/* Detailed State Display */}
      <div style={{ marginBottom: '20px' }}>
        <h2>Suggestion Maps (Detailed)</h2>
        <h3>Active Suggestions Map</h3>
        <pre style={{ background: '#f0f0f0', padding: '10px', overflow: 'auto' }}>
          {JSON.stringify(suggestionMapDisplay, null, 2)}
        </pre>
        
        <h3>Status Map</h3>
        <pre style={{ background: '#f0f0f0', padding: '10px', overflow: 'auto' }}>
          {JSON.stringify(statusMapDisplay, null, 2)}
        </pre>
      </div>
      
      {/* Hook Debug Info */}
      {debugInfo && (
        <div style={{ marginBottom: '20px' }}>
          <h2>Hook Debug Info</h2>
          <pre style={{ background: '#f0f0f0', padding: '10px' }}>
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

// Export wrapped component
export default withDebugInfo(TestSuggestionStateManagementBase, 'TestSuggestionStateManagement') 