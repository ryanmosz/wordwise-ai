// AI Service for WordWise Demo
// This is temporary code for the Friday demo and will be removed after

interface UserSettings {
  brandTone: string
  readingLevel: number
  bannedWords: string[]
  completeRewrite?: boolean
}

interface AnalyzeTextRequest {
  text: string
  documentId: string
  userSettings: UserSettings
}

interface Suggestion {
  startIndex: number
  endIndex: number
  type: 'grammar' | 'tone' | 'persuasive' | 'conciseness' | 'headline' | 'readability' | 'vocabulary' | 'ab_test'
  originalText: string
  suggestionText: string
  explanation: string
  confidence: number
}

interface AnalyzeTextResponse {
  suggestions: Suggestion[]
}

/**
 * Analyzes text using the Supabase edge function
 * @param text The text to analyze
 * @returns Promise with suggestions array
 */
export async function analyzeText(text: string): Promise<AnalyzeTextResponse> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('[AI Service] Missing Supabase environment variables')
    throw new Error('Supabase configuration missing')
  }

  const url = `${supabaseUrl}/functions/v1/analyze-text`
  
  console.log('[AI Service] Calling edge function at:', url)
  console.log('[AI Service] Analyzing text length:', text.length, 'characters')

  const requestBody: AnalyzeTextRequest = {
    text,
    documentId: 'demo-doc',
    userSettings: {
      brandTone: 'friendly',
      readingLevel: 8,
      bannedWords: []
    }
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })

    console.log('[AI Service] Response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[AI Service] Error response:', errorText)
      throw new Error(`Analysis failed: ${response.status} ${response.statusText}`)
    }

    const data: AnalyzeTextResponse = await response.json()
    console.log('[AI Service] Raw response from edge function:', JSON.stringify(data, null, 2))

    return data
  } catch (error) {
    console.error('[AI Service] Request failed:', error)
    throw error
  }
}

/**
 * Gets a complete rewrite of the text
 * @param text The text to rewrite
 * @returns Promise with the rewritten text
 */
export async function getCompleteRewrite(text: string): Promise<string> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('[AI Service] Missing Supabase environment variables')
    throw new Error('Supabase configuration missing')
  }

  const url = `${supabaseUrl}/functions/v1/analyze-text`
  
  console.log('[AI Service] Getting complete rewrite for text:', text)

  // Just send the text directly - the edge function will analyze it
  const requestBody: AnalyzeTextRequest = {
    text: text,
    documentId: 'demo-rewrite',
    userSettings: {
      brandTone: 'professional',
      readingLevel: 8,
      bannedWords: []
    }
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      throw new Error(`Rewrite failed: ${response.status}`)
    }

    const data: AnalyzeTextResponse = await response.json()
    console.log('[AI Service] Rewrite response:', JSON.stringify(data, null, 2))
    
    // Build the complete rewrite by applying all suggestions
    let rewrittenText = text
    
    if (data.suggestions && data.suggestions.length > 0) {
      // Sort suggestions by position (reverse order to maintain indices)
      const sortedSuggestions = [...data.suggestions].sort((a, b) => b.startIndex - a.startIndex)
      
      // Apply each suggestion
      sortedSuggestions.forEach(suggestion => {
        const before = rewrittenText.substring(0, suggestion.startIndex)
        const after = rewrittenText.substring(suggestion.endIndex)
        rewrittenText = before + suggestion.suggestionText + after
      })
      
      console.log('[AI Service] Built complete rewrite:', rewrittenText)
      return rewrittenText
    }
    
    // If no suggestions, return original
    console.warn('[AI Service] No suggestions for rewrite')
    return text
  } catch (error) {
    console.error('[AI Service] Complete rewrite failed:', error)
    throw error
  }
}

// Export types for use in components
export type { Suggestion, AnalyzeTextResponse } 