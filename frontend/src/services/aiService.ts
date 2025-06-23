import type { Suggestion } from '../types/suggestion'

interface UserSettings {
  brandTone: string
  readingLevel: number
  bannedWords: string[]
}

interface AnalyzeTextOptions {
  text: string
  documentId: string
  userSettings: UserSettings
}

interface AnalyzeTextResponse {
  suggestions: Suggestion[]
}

interface ErrorResponse {
  error: string
  suggestions?: []
}

class AIService {
  private baseUrl: string
  private anonKey: string
  private abortController: AbortController | null = null
  
  constructor() {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables')
    }
    
    this.baseUrl = supabaseUrl
    this.anonKey = supabaseAnonKey
  }
  
  /**
   * Analyze text and get AI-powered suggestions
   */
  async analyzeText(options: AnalyzeTextOptions): Promise<AnalyzeTextResponse> {
    // Cancel any previous request
    if (this.abortController) {
      this.abortController.abort()
    }
    
    // Create new abort controller for this request
    this.abortController = new AbortController()
    
    try {
      console.log('[AIService] Analyzing text:', {
        textLength: options.text.length,
        documentId: options.documentId,
        brandTone: options.userSettings.brandTone
      })
      
      console.log('[AIService] Full text being analyzed:', options.text)
      
      const response = await fetch(`${this.baseUrl}/functions/v1/analyze-text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.anonKey}`
        },
        body: JSON.stringify({
          text: options.text,
          documentId: options.documentId,
          userSettings: options.userSettings
        }),
        signal: this.abortController.signal
      })
      
      // Handle response
      const data = await response.json() as AnalyzeTextResponse | ErrorResponse
      
      console.log('[AIService] Response from edge function:', {
        status: response.status,
        ok: response.ok,
        data: data
      })
      
      // Log detailed suggestion info
      if ('suggestions' in data && Array.isArray(data.suggestions)) {
        console.log('[AIService] Suggestions detail:')
        data.suggestions.forEach((s, i) => {
          console.log(`  [${i}] "${s.originalText}" -> "${s.suggestionText}" at ${s.startIndex}-${s.endIndex} (${s.type})`)
        })
      }
      
      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please wait before analyzing more text.')
        } else if (response.status === 401) {
          throw new Error('Authentication failed. Please check your credentials.')
        } else if (response.status >= 500) {
          throw new Error('Analysis service temporarily unavailable. Please try again later.')
        } else {
          // Use error message from response if available
          const errorMessage = 'error' in data ? data.error : `Analysis failed: ${response.statusText}`
          throw new Error(errorMessage)
        }
      }
      
      // Validate response has suggestions array
      if (!('suggestions' in data) || !Array.isArray(data.suggestions)) {
        console.error('[AIService] Invalid response format:', data)
        return { suggestions: [] }
      }
      
      console.log('[AIService] Analysis complete:', {
        suggestionsCount: data.suggestions.length,
        types: data.suggestions.map(s => s.type)
      })
      
      return data as AnalyzeTextResponse
      
    } catch (error) {
      // Handle abort errors
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('[AIService] Request cancelled')
        return { suggestions: [] }
      }
      
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Connection issue. Please check your internet connection and try again.')
      }
      
      // Re-throw other errors
      throw error
      
    } finally {
      // Clear abort controller if this was the current request
      if (this.abortController?.signal.aborted) {
        this.abortController = null
      }
    }
  }
  
  /**
   * Cancel any pending analysis request
   */
  cancelAnalysis() {
    if (this.abortController) {
      this.abortController.abort()
      this.abortController = null
    }
  }
  
  /**
   * Retry logic wrapper for resilient API calls
   */
  private async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 2,
    delay: number = 1000
  ): Promise<T> {
    let lastError: Error | null = null
    
    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await operation()
      } catch (error) {
        lastError = error as Error
        
        // Don't retry on abort or client errors
        if (
          error instanceof Error && 
          (error.name === 'AbortError' || error.message.includes('Rate limit'))
        ) {
          throw error
        }
        
        // Wait before retrying (exponential backoff)
        if (i < maxRetries) {
          console.log(`[AIService] Retry attempt ${i + 1} after ${delay}ms`)
          await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)))
        }
      }
    }
    
    throw lastError || new Error('Operation failed after retries')
  }
  
  /**
   * Public method with retry logic
   */
  async analyzeTextWithRetry(options: AnalyzeTextOptions): Promise<AnalyzeTextResponse> {
    return this.withRetry(() => this.analyzeText(options))
  }
}

// Export singleton instance
export const aiService = new AIService() 