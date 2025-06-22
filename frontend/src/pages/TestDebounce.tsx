import { useState, useRef, useEffect } from 'react'
import { useSuggestions } from '../hooks/useSuggestions'
import { LoadingSpinner } from '../components/common/LoadingSpinner'

interface RequestLog {
  id: number
  timestamp: string
  text: string
  status: 'pending' | 'completed' | 'cancelled'
  duration?: number
}

export function TestDebounce() {
  const [text, setText] = useState('')
  const [documentId] = useState('test-debounce-' + Date.now())
  const [enabled, setEnabled] = useState(true)
  const [requestLogs, setRequestLogs] = useState<RequestLog[]>([])
  const [keystrokes, setKeystrokes] = useState(0)
  const requestIdRef = useRef(0)
  const lastRequestTimeRef = useRef<number>(0)
  const activeRequestRef = useRef<number | null>(null)
  
  // Track when analysis starts/ends
  const originalAnalyzeText = useRef<any>(null)
  
  const { suggestions, isLoading, error } = useSuggestions({
    text,
    documentId,
    enabled,
    userSettings: {
      brandTone: 'professional',
      readingLevel: 8,
      bannedWords: []
    }
  })
  
  // Track typing
  const handleTextChange = (newText: string) => {
    setText(newText)
    setKeystrokes(prev => prev + 1)
    
    // Log the intent to analyze
    if (newText.length >= 10 && enabled) {
      const now = Date.now()
      const timeSinceLastRequest = lastRequestTimeRef.current ? now - lastRequestTimeRef.current : 0
      
      // If there's an active request, mark it as cancelled
      if (activeRequestRef.current !== null) {
        setRequestLogs(prev => prev.map(log => 
          log.id === activeRequestRef.current 
            ? { ...log, status: 'cancelled' as const }
            : log
        ))
      }
      
      // Add new pending request
      const requestId = ++requestIdRef.current
      activeRequestRef.current = requestId
      lastRequestTimeRef.current = now
      
      setRequestLogs(prev => [...prev, {
        id: requestId,
        timestamp: new Date().toISOString(),
        text: newText.substring(0, 50) + (newText.length > 50 ? '...' : ''),
        status: 'pending'
      }])
      
      // Set a timer to check if this request completes
      setTimeout(() => {
        if (isLoading && activeRequestRef.current === requestId) {
          // Request is in progress
          setRequestLogs(prev => prev.map(log => 
            log.id === requestId 
              ? { ...log, status: 'completed' as const, duration: 2000 }
              : log
          ))
        }
      }, 2100) // Slightly after debounce delay
    }
  }
  
  // Monitor loading state changes
  useEffect(() => {
    if (!isLoading && activeRequestRef.current !== null) {
      // Analysis completed
      const requestId = activeRequestRef.current
      setRequestLogs(prev => prev.map(log => 
        log.id === requestId 
          ? { ...log, status: 'completed' as const }
          : log
      ))
      activeRequestRef.current = null
    }
  }, [isLoading])
  
  // Clear logs
  const clearLogs = () => {
    setRequestLogs([])
    setKeystrokes(0)
    requestIdRef.current = 0
  }
  
  // Format time ago
  const timeAgo = (timestamp: string) => {
    const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    return `${Math.floor(seconds / 60)}m ago`
  }
  
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Debounce Testing</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Input and Controls */}
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Test Input (type continuously to test debouncing)
            </label>
            <textarea
              value={text}
              onChange={(e) => handleTextChange(e.target.value)}
              className="w-full p-3 border rounded-lg h-32 font-mono text-sm"
              placeholder="Start typing... Analysis triggers 2 seconds after you stop"
            />
            <div className="mt-2 flex justify-between text-sm text-gray-600">
              <span>Characters: {text.length}</span>
              <span>Keystrokes: {keystrokes}</span>
            </div>
          </div>
          
          <div className="mb-4 flex gap-4">
            <button
              onClick={() => setEnabled(!enabled)}
              className={`px-4 py-2 rounded ${enabled ? 'bg-green-600 text-white' : 'bg-gray-300'}`}
            >
              Analysis: {enabled ? 'ON' : 'OFF'}
            </button>
            <button
              onClick={() => setText('')}
              className="px-4 py-2 bg-gray-600 text-white rounded"
            >
              Clear Text
            </button>
            <button
              onClick={clearLogs}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              Clear Logs
            </button>
          </div>
          
          {/* Status */}
          <div className="p-4 bg-gray-100 rounded">
            <h3 className="font-semibold mb-2">Current Status</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Analysis State:</span>
                <span className={isLoading ? 'text-blue-600 font-semibold' : ''}>
                  {isLoading ? '🔄 ANALYZING...' : '✅ Idle'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Text Length:</span>
                <span className={text.length < 10 ? 'text-red-600' : 'text-green-600'}>
                  {text.length} {text.length < 10 ? '(too short)' : '(valid)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Suggestions:</span>
                <span>{suggestions.length}</span>
              </div>
              {error && (
                <div className="text-red-600 mt-2">Error: {error.message}</div>
              )}
            </div>
          </div>
          
          {/* Loading Animation */}
          {isLoading && (
            <div className="mt-4 flex items-center gap-2 text-blue-600">
              <LoadingSpinner size="sm" />
              <span className="animate-pulse">Analyzing your text...</span>
            </div>
          )}
        </div>
        
        {/* Right Column - Request Log */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Request Log</h3>
          <div className="border rounded-lg bg-gray-50 p-4 h-96 overflow-y-auto">
            {requestLogs.length === 0 ? (
              <p className="text-gray-500 text-center">
                Start typing to see debounce behavior...
              </p>
            ) : (
              <div className="space-y-2">
                {requestLogs.slice().reverse().map((log) => (
                  <div
                    key={log.id}
                    className={`p-3 rounded border ${
                      log.status === 'completed' 
                        ? 'bg-green-50 border-green-300' 
                        : log.status === 'cancelled'
                        ? 'bg-red-50 border-red-300'
                        : 'bg-yellow-50 border-yellow-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-mono text-xs text-gray-600">
                          Request #{log.id}
                        </div>
                        <div className="text-sm mt-1">
                          "{log.text}"
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xs font-semibold ${
                          log.status === 'completed' 
                            ? 'text-green-700' 
                            : log.status === 'cancelled'
                            ? 'text-red-700'
                            : 'text-yellow-700'
                        }`}>
                          {log.status.toUpperCase()}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {timeAgo(log.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Debounce Explanation */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">How Debouncing Works</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Type continuously - requests are cancelled</li>
              <li>• Stop typing for 2 seconds - analysis runs</li>
              <li>• Text under 10 characters - no analysis</li>
              <li>• Only the latest request completes</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Debug Info for W3M */}
      <div id="debounce-debug" className="sr-only">
DEBUG: Debounce Test State
==========================
Text Length: {text.length}
Keystrokes: {keystrokes}
Loading: {isLoading}
Enabled: {enabled}
Total Requests: {requestLogs.length}
Completed: {requestLogs.filter(l => l.status === 'completed').length}
Cancelled: {requestLogs.filter(l => l.status === 'cancelled').length}
Pending: {requestLogs.filter(l => l.status === 'pending').length}
Suggestions: {suggestions.length}
Error: {error?.message || 'none'}
      </div>
    </div>
  )
} 