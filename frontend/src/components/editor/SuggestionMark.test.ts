import { describe, it, expect } from 'vitest'
import { SuggestionMark } from './SuggestionMark'

describe('SuggestionMark', () => {
  it('should have the correct name', () => {
    expect(SuggestionMark.name).toBe('suggestion')
  })

  it('should define suggestionId and suggestionType attributes', () => {
    const attributes = SuggestionMark.config.addAttributes?.()
    expect(attributes).toBeDefined()
    expect(attributes?.suggestionId).toBeDefined()
    expect(attributes?.suggestionType).toBeDefined()
  })

  it('should parse HTML with data-suggestion-id attribute', () => {
    const parseRules = SuggestionMark.config.parseHTML?.()
    expect(parseRules).toBeDefined()
    expect(parseRules?.[0].tag).toBe('span[data-suggestion-id]')
  })

  it('should render HTML with correct class names', () => {
    const renderHTML = SuggestionMark.config.renderHTML
    if (renderHTML) {
      const result = renderHTML({ 
        HTMLAttributes: { 
          'data-suggestion-type': 'grammar',
          'data-suggestion-id': 'test-123'
        } 
      })
      expect(result).toEqual([
        'span',
        {
          'data-suggestion-type': 'grammar',
          'data-suggestion-id': 'test-123',
          class: 'suggestion suggestion-grammar'
        },
        0
      ])
    }
  })

  it('should provide custom commands', () => {
    const commands = SuggestionMark.config.addCommands?.()
    expect(commands).toBeDefined()
    expect(commands?.setSuggestionMark).toBeDefined()
    expect(commands?.toggleSuggestionMark).toBeDefined()
    expect(commands?.unsetSuggestionMark).toBeDefined()
  })
}) 