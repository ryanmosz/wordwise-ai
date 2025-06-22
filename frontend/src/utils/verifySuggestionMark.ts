import { SuggestionMark } from '../components/editor/SuggestionMark'

export function verifySuggestionMark() {
  const results = {
    extensionName: false,
    hasAttributes: false,
    hasCommands: false,
    canParseHTML: false,
    canRenderHTML: false,
  }

  // Check extension name
  results.extensionName = SuggestionMark.name === 'suggestion'

  // Check attributes
  const attributes = SuggestionMark.config.addAttributes?.()
  results.hasAttributes = !!(attributes?.suggestionId && attributes?.suggestionType)

  // Check commands
  const commands = SuggestionMark.config.addCommands?.()
  results.hasCommands = !!(
    commands?.setSuggestionMark &&
    commands?.toggleSuggestionMark &&
    commands?.unsetSuggestionMark
  )

  // Check HTML parsing
  const parseRules = SuggestionMark.config.parseHTML?.()
  results.canParseHTML = !!(parseRules && parseRules[0]?.tag === 'span[data-suggestion-id]')

  // Check HTML rendering
  results.canRenderHTML = !!SuggestionMark.config.renderHTML

  return results
}

export function logSuggestionMarkVerification() {
  const results = verifySuggestionMark()
  console.log('SuggestionMark Verification:', results)
  
  const allPassed = Object.values(results).every(v => v === true)
  if (allPassed) {
    console.log('✅ All SuggestionMark checks passed!')
  } else {
    console.error('❌ Some SuggestionMark checks failed:', 
      Object.entries(results).filter(([_, v]) => !v).map(([k]) => k)
    )
  }
  
  return allPassed
} 