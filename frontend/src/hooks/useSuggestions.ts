import { useState, useCallback, useEffect, useRef } from 'react'
import { debounce } from '../utils/debounce'
import type { Suggestion, SuggestionType } from '../types/suggestion'
import { useDocumentStore } from '../store/documentStore'
import { aiService } from '../services/aiService'

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
  debounceMetrics?: {
    requestsInitiated: number
    requestsCompleted: number
    requestsCancelled: number
    lastDebounceTime: number
  }
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
  
  // Debounce metrics tracking
  const debounceMetricsRef = useRef({
    requestsInitiated: 0,
    requestsCompleted: 0,
    requestsCancelled: 0,
    lastDebounceTime: 0
  })
  
  // Check for debug mode
  const isDebugMode = typeof window !== 'undefined' && 
    new URLSearchParams(window.location.search).has('debug')
  
  // Store refs for stable callback
  const documentIdRef = useRef(documentId)
  const userSettingsRef = useRef(userSettings)
  
  // Update refs when props change
  useEffect(() => {
    documentIdRef.current = documentId
    userSettingsRef.current = userSettings
  }, [documentId, userSettings])
  
  // Create stable debounced analyze function
  const analyzeText = useRef(
    debounce(async (text: string) => {
      // Skip if too short
      if (text.length < 10) {
        console.log('[useSuggestions] Text too short, skipping analysis')
        clearSuggestions()
        return
      }
      
      // Track request number
      const requestId = ++requestRef.current
      debounceMetricsRef.current.requestsInitiated++
      debounceMetricsRef.current.lastDebounceTime = Date.now()
      
      setIsLoading(true)
      setError(null)
      
      try {
        console.log('[useSuggestions] Starting analysis for text length:', text.length)
        
        // Use the real AI service with current refs
        const result = await aiService.analyzeText({
          text,
          documentId: documentIdRef.current,
          userSettings: userSettingsRef.current
        })
        
        // Only update if this is still the latest request
        if (requestId === requestRef.current) {
          // Clear existing suggestions and add new ones
          clearSuggestions()
          
          // Add unique IDs to suggestions if they don't have them
          const suggestionsWithIds = result.suggestions.map((suggestion, index) => ({
            ...suggestion,
            id: suggestion.id || `suggestion-${Date.now()}-${index}`
          }))
          
          addSuggestions(suggestionsWithIds)
          lastFetchTimeRef.current = new Date().toISOString()
          debounceMetricsRef.current.requestsCompleted++
          console.log('[useSuggestions] Analysis complete, suggestions:', suggestionsWithIds.length)
        } else {
          // This request was superseded by a newer one
          debounceMetricsRef.current.requestsCancelled++
          console.log('[useSuggestions] Request cancelled (superseded by newer request)')
        }
      } catch (err) {
        // Only show error for latest request
        if (requestId === requestRef.current) {
          const error = err instanceof Error ? err : new Error('Analysis failed')
          setError(error)
          console.error('[useSuggestions] Analysis error:', error)
        } else {
          debounceMetricsRef.current.requestsCancelled++
        }
      } finally {
        if (requestId === requestRef.current) {
          setIsLoading(false)
        }
      }
    }, 2000) // 2 second delay
  ).current
  
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
      // Cancel any pending API request
      aiService.cancelAnalysis()
    }
  }, [text, enabled]) // analyzeText is stable, no need in deps
  
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
    isDebugMode: true,
    debounceMetrics: { ...debounceMetricsRef.current }
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
Debounce Metrics:
  Initiated: ${debounceMetricsRef.current.requestsInitiated}
  Completed: ${debounceMetricsRef.current.requestsCompleted}
  Cancelled: ${debounceMetricsRef.current.requestsCancelled}
  Efficiency: ${debounceMetricsRef.current.requestsInitiated > 0 
    ? Math.round((debounceMetricsRef.current.requestsCompleted / debounceMetricsRef.current.requestsInitiated) * 100) 
    : 0}%
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