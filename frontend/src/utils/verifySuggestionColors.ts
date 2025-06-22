import type { SuggestionType } from '../types/suggestion'
import { SUGGESTION_COLORS, getColorScheme } from './suggestionColors'

export function verifySuggestionColors(): boolean {
  console.log('Verifying suggestion colors...')
  
  const expectedTypes: SuggestionType[] = [
    'grammar', 'tone', 'persuasive', 'conciseness',
    'headline', 'readability', 'vocabulary', 'ab_test'
  ]
  
  let allValid = true
  
  // Check all expected types have color schemes
  for (const type of expectedTypes) {
    if (!SUGGESTION_COLORS[type]) {
      console.error(`Missing color scheme for type: ${type}`)
      allValid = false
    } else {
      const scheme = SUGGESTION_COLORS[type]
      
      // Verify all required properties exist
      if (!scheme.border || !scheme.bg || !scheme.text || !scheme.icon || !scheme.hoverBg) {
        console.error(`Incomplete color scheme for type: ${type}`)
        allValid = false
      }
      
      // Verify Tailwind classes follow expected patterns
      if (!scheme.border.includes('border-') || !scheme.border.includes('-500')) {
        console.error(`Invalid border class for ${type}: ${scheme.border}`)
        allValid = false
      }
      
      if (!scheme.bg.includes('bg-') || !scheme.bg.includes('-50')) {
        console.error(`Invalid background class for ${type}: ${scheme.bg}`)
        allValid = false
      }
      
      if (!scheme.text.includes('text-') || !scheme.text.includes('-700')) {
        console.error(`Invalid text class for ${type}: ${scheme.text}`)
        allValid = false
      }
      
      if (!scheme.hoverBg.includes('hover:bg-') || !scheme.hoverBg.includes('-50')) {
        console.error(`Invalid hover background class for ${type}: ${scheme.hoverBg}`)
        allValid = false
      }
    }
  }
  
  // Test fallback for unknown type
  const unknownScheme = getColorScheme('unknown' as SuggestionType)
  if (unknownScheme !== SUGGESTION_COLORS.grammar) {
    console.error('Fallback for unknown type not working correctly')
    allValid = false
  }
  
  // Verify all colors are unique
  const colorSet = new Set<string>()
  for (const type of expectedTypes) {
    const borderClass = SUGGESTION_COLORS[type].border
    if (colorSet.has(borderClass)) {
      console.error(`Duplicate color found: ${borderClass} used by ${type}`)
      allValid = false
    }
    colorSet.add(borderClass)
  }
  
  if (allValid) {
    console.log('✅ All suggestion colors verified successfully!')
    console.log(`Total types: ${expectedTypes.length}`)
    console.log(`All colors unique: ${colorSet.size === expectedTypes.length}`)
  } else {
    console.error('❌ Suggestion color verification failed!')
  }
  
  return allValid
} 