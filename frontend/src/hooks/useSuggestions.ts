import { useState, useCallback, useEffect, useRef } from 'react'
import { debounce } from '../utils/debounce'
import type { Suggestion, SuggestionType } from '../types/suggestion'
import { useDocumentStore } from '../store/documentStore'

interface UseSuggestionsOptions {
  text: string
  documentId: string
  enabled?: boolean
  userSettings?: {
    brandTone: string
    readingLevel: number
    bannedWords: string[]
  }
}

interface UseSuggestionsReturn {
  suggestions: Suggestion[]
  isLoading: boolean
  error: Error | null
  acceptSuggestion: (suggestionId: string) => Promise<void>
  rejectSuggestion: (suggestionId: string) => Promise<void>
  debugInfo?: DebugInfo
}

interface DebugInfo {
  totalSuggestions: number
  pendingSuggestions: number
  acceptedSuggestions: number
  rejectedSuggestions: number
  lastFetchTime: string | null
  isDebugMode: boolean
}

// Temporary mock function until aiService is implemented in Task 8.1
const mockAnalyzeText = async (text: string, documentId: string, userSettings: any): Promise<{ suggestions: Suggestion[] }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800))
  
  // Generate mock suggestions based on text
  const mockSuggestions: Suggestion[] = []
  
  // Mock grammar suggestion
  if (text.toLowerCase().includes('this are')) {
    mockSuggestions.push({
      id: 'mock-1',
      startIndex: text.toLowerCase().indexOf('this are'),
      endIndex: text.toLowerCase().indexOf('this are') + 8,
      type: 'grammar',
      originalText: 'This are',
      suggestionText: 'These are',
      explanation: 'Subject-verb agreement: use "These" with plural "are"',
      confidence: 0.95,
      accepted: null
    })
  }
  
  // Mock tone suggestion
  if (text.toLowerCase().includes('hey') && userSettings?.brandTone === 'professional') {
    mockSuggestions.push({
      id: 'mock-2',
      startIndex: text.toLowerCase().indexOf('hey'),
      endIndex: text.toLowerCase().indexOf('hey') + 3,
      type: 'tone',
      originalText: 'Hey',
      suggestionText: 'Hello',
      explanation: 'More professional greeting for brand voice',
      confidence: 0.85,
      accepted: null
    })
  }
  
  // Mock persuasive suggestion
  if (text.toLowerCase().includes('good')) {
    const index = text.toLowerCase().indexOf('good')
    mockSuggestions.push({
      id: 'mock-3',
      startIndex: index,
      endIndex: index + 4,
      type: 'persuasive',
      originalText: 'good',
      suggestionText: 'exceptional',
      explanation: 'Stronger, more persuasive language',
      confidence: 0.75,
      accepted: null
    })
  }
  
  return { suggestions: mockSuggestions }
}

export function useSuggestions({ 
  text, 
  documentId, 
  enabled = true,
  userSettings = {
    brandTone: 'friendly',
    readingLevel: 8,
    bannedWords: []
  }
}: UseSuggestionsOptions): UseSuggestionsReturn {
  // Get store methods and state
  const { 
    activeSuggestions, 
    suggestionStatus,
    addSuggestions, 
    updateSuggestionStatus, 
    clearSuggestions,
    getSuggestionById 
  } = useDocumentStore()
  
  // Convert Map to array for the return value
  const suggestions = Array.from(activeSuggestions.values())
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const requestRef = useRef<number>(0)
  const lastFetchTimeRef = useRef<string | null>(null)
  
  // Check for debug mode
  const isDebugMode = typeof window !== 'undefined' && 
    new URLSearchParams(window.location.search).has('debug')
  
  // Create debounced analyze function
  const analyzeText = useCallback(
    debounce(async (text: string) => {
      // Skip if too short
      if (text.length < 10) {
        console.log('[useSuggestions] Text too short, skipping analysis')
        clearSuggestions()
        return
      }
      
      // Track request number
      const requestId = ++requestRef.current
      
      setIsLoading(true)
      setError(null)
      
      try {
        console.log('[useSuggestions] Starting analysis for text length:', text.length)
        
        // TODO: Replace with actual aiService.analyzeText when implemented
        const result = await mockAnalyzeText(text, documentId, userSettings)
        
        // Only update if this is still the latest request
        if (requestId === requestRef.current) {
          // Clear existing suggestions and add new ones
          clearSuggestions()
          addSuggestions(result.suggestions)
          lastFetchTimeRef.current = new Date().toISOString()
          console.log('[useSuggestions] Analysis complete, suggestions:', result.suggestions.length)
        }
      } catch (err) {
        // Only show error for latest request
        if (requestId === requestRef.current) {
          const error = err instanceof Error ? err : new Error('Analysis failed')
          setError(error)
          console.error('[useSuggestions] Analysis error:', error)
        }
      } finally {
        if (requestId === requestRef.current) {
          setIsLoading(false)
        }
      }
    }, 2000), // 2 second delay
    [documentId, userSettings, clearSuggestions, addSuggestions]
  )
  
  // Effect to trigger analysis when text changes
  useEffect(() => {
    if (!enabled) {
      console.log('[useSuggestions] Hook disabled, skipping analysis')
      return
    }
    
    analyzeText(text)
    
    // Cleanup function to cancel pending analysis
    return () => {
      analyzeText.cancel()
      // Note: When aiService is implemented, also cancel the API request here
    }
  }, [text, analyzeText, enabled])
  
  // Accept suggestion handler
  const acceptSuggestion = useCallback(async (suggestionId: string) => {
    console.log('[useSuggestions] Accepting suggestion:', suggestionId)
    
    // Update status in store
    updateSuggestionStatus(suggestionId, 'accepted')
    
    // TODO: Send to analytics service when implemented
    // await analyticsService.trackSuggestion({
    //   suggestionId,
    //   action: 'accepted',
    //   type: suggestion.type,
    //   confidence: suggestion.confidence
    // })
  }, [updateSuggestionStatus])
  
  // Reject suggestion handler
  const rejectSuggestion = useCallback(async (suggestionId: string) => {
    console.log('[useSuggestions] Rejecting suggestion:', suggestionId)
    
    // Update status in store
    updateSuggestionStatus(suggestionId, 'rejected')
    
    // TODO: Send to analytics service when implemented
    // await analyticsService.trackSuggestion({
    //   suggestionId,
    //   action: 'rejected',
    //   type: suggestion.type,
    //   confidence: suggestion.confidence
    // })
  }, [updateSuggestionStatus])
  
  // Calculate debug info
  const debugInfo: DebugInfo | undefined = isDebugMode ? {
    totalSuggestions: suggestions.length,
    pendingSuggestions: suggestions.filter(s => {
      const status = suggestionStatus.get(s.id)
      return status === 'pending' || !status
    }).length,
    acceptedSuggestions: suggestions.filter(s => {
      const status = suggestionStatus.get(s.id)
      return status === 'accepted'
    }).length,
    rejectedSuggestions: suggestions.filter(s => {
      const status = suggestionStatus.get(s.id)
      return status === 'rejected'
    }).length,
    lastFetchTime: lastFetchTimeRef.current,
    isDebugMode: true
  } : undefined
  
  // Add debug output for w3m testing
  if (isDebugMode && typeof document !== 'undefined') {
    const debugElement = document.getElementById('useSuggestions-debug')
    if (debugElement) {
      debugElement.textContent = `
DEBUG: useSuggestions Hook State
================================
Text Length: ${text.length}
Document ID: ${documentId}
Enabled: ${enabled}
Loading: ${isLoading}
Error: ${error?.message || 'none'}
Total Suggestions: ${suggestions.length}
Pending: ${debugInfo?.pendingSuggestions || 0}
Accepted: ${debugInfo?.acceptedSuggestions || 0}
Rejected: ${debugInfo?.rejectedSuggestions || 0}
Last Fetch: ${lastFetchTimeRef.current || 'never'}
Request Number: ${requestRef.current}
      `.trim()
    }
  }
  
  return {
    suggestions,
    isLoading,
    error,
    acceptSuggestion,
    rejectSuggestion,
    ...(debugInfo && { debugInfo })
  }
} 