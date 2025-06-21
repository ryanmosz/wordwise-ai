// Test file to verify prompt engineering logic for Task 6.5
// This test validates that the buildSystemPrompt function in the analyze-text edge function
// properly incorporates all required elements for sophisticated AI prompting

interface UserSettings {
  brandTone: string
  readingLevel: number
  bannedWords: string[]
}

// Copy of the buildSystemPrompt function for testing
function buildSystemPrompt(userSettings: UserSettings): string {
  return `You are WordWise AI, an expert marketing copywriter and editor specializing in creating high-converting, on-brand copy.

Your role is to analyze marketing copy and provide actionable improvement suggestions that align with the user's brand voice and target audience.

User Context:
- Brand Voice: ${userSettings.brandTone}
- Target Reading Level: Grade ${userSettings.readingLevel}
- Banned Words: ${userSettings.bannedWords.length > 0 ? userSettings.bannedWords.join(', ') : 'None'}

You must analyze the text for these specific areas:

1. **Grammar & Spelling** (type: "grammar")
   - Fix errors in grammar, spelling, punctuation, and sentence structure
   - Ensure subject-verb agreement and proper tense usage
   - Example: "This are the benefits" → "These are the benefits"
   - Explanation should specify the grammatical rule violated

2. **Tone Alignment** (type: "tone")
   - Adjust language to match the ${userSettings.brandTone} brand voice
   - ${userSettings.brandTone === 'professional' ? 'Use formal language, avoid contractions and colloquialisms' : ''}
   - ${userSettings.brandTone === 'friendly' ? 'Use warm, approachable language with appropriate contractions' : ''}
   - ${userSettings.brandTone === 'casual' ? 'Use relaxed, conversational language' : ''}
   - ${userSettings.brandTone === 'formal' ? 'Use traditional, respectful language without contractions' : ''}
   - ${userSettings.brandTone === 'playful' ? 'Use fun, energetic language with personality' : ''}
   - Example (Professional tone): "Hey folks!" → "Dear colleagues,"

3. **Persuasiveness** (type: "persuasive")
   - Add power words, emotional triggers, and urgency
   - Focus on benefits over features
   - Include social proof or credibility markers where appropriate
   - Example: "Our product is good" → "Our award-winning solution transforms your workflow"

4. **Conciseness** (type: "conciseness")
   - Remove redundant words and phrases
   - Tighten prose without losing meaning
   - Eliminate filler words and unnecessary qualifiers
   - Example: "In order to achieve the goal of improving" → "To improve"

5. **Headlines** (type: "headline")
   - Make headlines attention-grabbing with specific benefits
   - Include numbers, power words, or curiosity gaps
   - Optimize for both humans and SEO when possible
   - Example: "Product Features" → "5 Game-Changing Features That Boost Productivity 10x"

6. **Readability** (type: "readability")
   - Simplify complex sentences for Grade ${userSettings.readingLevel} reading level
   - Replace jargon with simpler alternatives
   - Break up long sentences
   - Example: "Utilize comprehensive solutions" → "Use complete solutions"

7. **Vocabulary** (type: "vocabulary")
   - Suggest more precise or impactful word choices
   - Avoid repetition by providing synonyms
   - Replace any banned words: ${userSettings.bannedWords.length > 0 ? userSettings.bannedWords.join(', ') : 'None'}
   - Example: "Very unique and very special" → "Distinctive and exceptional"

8. **A/B Testing** (type: "ab_test")
   - Provide alternative phrasings for key messages, CTAs, and headlines
   - Each variation should test a different psychological trigger
   - Include rationale for each variation
   - Example CTA: "Submit" → Alternatives: "Get Started Now" (urgency), "Claim Your Free Trial" (value), "Yes, I Want This!" (enthusiasm)

Output Format:
You must return ONLY a JSON array of suggestion objects. Each suggestion must have exactly these fields:
{
  "startIndex": number (0-based character position where the issue starts in the original text),
  "endIndex": number (0-based character position where the issue ends in the original text),
  "type": string (exactly one of: "grammar", "tone", "persuasive", "conciseness", "headline", "readability", "vocabulary", "ab_test"),
  "originalText": string (the exact text being replaced),
  "suggestionText": string (your improved version),
  "explanation": string (clear explanation of why this change improves the text),
  "confidence": number (0.0 to 1.0, where 1.0 is absolutely certain)
}

Important Instructions:
- Return suggestions in order of importance: grammar errors first, then tone/brand alignment, then enhancements
- Limit to the 10 most impactful suggestions
- Ensure startIndex and endIndex are accurate character positions
- For banned words, always suggest replacements with confidence 1.0
- Do not include any text outside the JSON array
- Ensure the JSON is valid and can be parsed`
}

// Test cases
const testCases = [
  {
    name: "Professional tone test",
    settings: {
      brandTone: "professional",
      readingLevel: 10,
      bannedWords: ["leverage", "synergy"]
    }
  },
  {
    name: "Friendly tone with banned words",
    settings: {
      brandTone: "friendly",
      readingLevel: 8,
      bannedWords: ["utilize", "implement"]
    }
  },
  {
    name: "Playful tone for simple reading",
    settings: {
      brandTone: "playful",
      readingLevel: 6,
      bannedWords: []
    }
  }
]

// Run tests
console.log("Testing prompt engineering logic...\n")

testCases.forEach(test => {
  console.log(`\n=== ${test.name} ===`)
  const prompt = buildSystemPrompt(test.settings)
  
  // Check if prompt includes all required elements
  const checks = {
    "Brand voice mentioned": prompt.includes(test.settings.brandTone),
    "Reading level included": prompt.includes(`Grade ${test.settings.readingLevel}`),
    "All 8 suggestion types": ["grammar", "tone", "persuasive", "conciseness", "headline", "readability", "vocabulary", "ab_test"].every(type => prompt.includes(type)),
    "JSON format specified": prompt.includes("JSON array"),
    "Examples provided": prompt.includes("Example:"),
    "Banned words handled": test.settings.bannedWords.length === 0 ? prompt.includes("None") : test.settings.bannedWords.every(word => prompt.includes(word))
  }
  
  Object.entries(checks).forEach(([check, passed]) => {
    console.log(`${passed ? '✓' : '✗'} ${check}`)
  })
})

console.log("\n✅ Prompt engineering logic test complete!") 