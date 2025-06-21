// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface UserSettings {
  brandTone: string
  readingLevel: number
  bannedWords: string[]
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

function buildSystemPrompt(userSettings: UserSettings): string {
  return `You are WordWise AI, an expert marketing copywriter and editor.

Your role is to analyze marketing copy and provide actionable improvement suggestions.

User Context:
- Brand Voice: ${userSettings.brandTone}
- Target Reading Level: Grade ${userSettings.readingLevel}
- Banned Words: ${userSettings.bannedWords.length > 0 ? userSettings.bannedWords.join(', ') : 'None'}

You must analyze for these specific areas:
1. Grammar & Spelling - Fix errors, improve sentence structure
2. Tone Alignment - Match the specified brand voice
3. Persuasiveness - Use power words, emotional triggers, urgency
4. Conciseness - Remove redundancy, tighten prose
5. Headlines - Make them attention-grabbing with keywords
6. Readability - Simplify complex sentences for target grade level
7. Vocabulary - Suggest synonyms, avoid repetition and banned words
8. A/B Testing - Provide alternative phrasings for key messages

Output Format:
You MUST return a JSON array of suggestion objects. Each suggestion must have ALL of these fields:
- startIndex: number (the character position where the issue starts, counting from 0)
- endIndex: number (the character position where the issue ends)
- type: string (must be exactly one of: "grammar", "tone", "persuasive", "conciseness", "headline", "readability", "vocabulary", "ab_test")
- originalText: string (the exact text from the input that needs changing)
- suggestionText: string (your improved version)
- explanation: string (why this change improves the copy)
- confidence: number (between 0.0 and 1.0)

Example response for text "This are bad":
[
  {
    "startIndex": 0,
    "endIndex": 8,
    "type": "grammar",
    "originalText": "This are",
    "suggestionText": "These are",
    "explanation": "Subject-verb agreement: 'These' is the correct plural form to match 'are'",
    "confidence": 1.0
  },
  {
    "startIndex": 9,
    "endIndex": 12,
    "type": "vocabulary",
    "originalText": "bad",
    "suggestionText": "poor",
    "explanation": "The word 'bad' is in your banned words list",
    "confidence": 1.0
  }
]

CRITICAL: 
- Return ONLY the JSON array, no other text before or after
- Count character positions carefully (spaces count as characters)
- Include suggestions for ALL issues you find
- If you find no issues, return an empty array: []`
}

function buildUserPrompt(text: string): string {
  return `Analyze this marketing copy and provide improvement suggestions:

"${text}"

Return ONLY a JSON array of suggestion objects with the exact format specified.`
}

function parseSuggestions(gptResponse: string): Suggestion[] {
  try {
    console.log('Attempting to parse GPT response:', gptResponse)
    
    // Try to parse the response as JSON
    const parsed = JSON.parse(gptResponse)
    
    // If the response has a suggestions property, use that
    if (parsed.suggestions && Array.isArray(parsed.suggestions)) {
      console.log('Found suggestions array in response')
      return parsed.suggestions
    }
    
    // Otherwise, assume the response IS the array
    if (!Array.isArray(parsed)) {
      console.error('GPT response is not an array and has no suggestions property')
      return []
    }
    
    // Valid suggestion types
    const validTypes = ['grammar', 'tone', 'persuasive', 'conciseness', 'headline', 'readability', 'vocabulary', 'ab_test']
    
    // Validate and filter suggestions
    const validated = parsed.filter((item: any) => {
      // Type validation
      const isValidType = typeof item.type === 'string' && validTypes.includes(item.type)
      
      // Basic field validation
      const hasRequiredFields = 
        typeof item.startIndex === 'number' &&
        typeof item.endIndex === 'number' &&
        typeof item.originalText === 'string' &&
        typeof item.suggestionText === 'string' &&
        typeof item.explanation === 'string' &&
        typeof item.confidence === 'number'
      
      if (!isValidType || !hasRequiredFields) {
        console.warn('Invalid suggestion filtered out:', JSON.stringify(item))
        return false
      }
      
      return true
    })
    
    console.log(`Validated ${validated.length} suggestions out of ${parsed.length}`)
    return validated
  } catch (error) {
    console.error('Failed to parse GPT response:', error)
    console.error('Raw response:', gptResponse)
    return []
  }
}

Deno.serve(async (req) => {
  // Enable CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    })
  }

  try {
    const { text, documentId, userSettings } = await req.json()
    
    console.log('Received request for document:', documentId)
    
    // Validate required fields
    if (!text || !userSettings) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: text and userSettings' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get OpenAI API key from environment
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openAIApiKey) {
      console.error('OPENAI_API_KEY not found in environment')
      throw new Error('OpenAI API key not configured')
    }

    console.log('Calling OpenAI API...')
    
    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: buildSystemPrompt(userSettings) },
          { role: 'user', content: buildUserPrompt(text) }
        ],
        temperature: 0.3,
        max_tokens: 1500
      }),
    })

    console.log('OpenAI API response status:', response.status)

    if (!response.ok) {
      const error = await response.text()
      console.error('OpenAI API error:', error)
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    console.log('OpenAI response received')
    
    // Parse the suggestions
    const content = data.choices[0].message.content
    console.log('Raw GPT response:', content)
    
    const suggestions = parseSuggestions(content)
    console.log(`Parsed ${suggestions.length} valid suggestions`)

    // Return the suggestions
    return new Response(
      JSON.stringify({ suggestions }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error in analyze-text function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        suggestions: [] 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/analyze-text' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"text":"This are a test sentence with eror.","documentId":"test-123","userSettings":{"brandTone":"friendly","readingLevel":8,"bannedWords":[]}}'

*/
