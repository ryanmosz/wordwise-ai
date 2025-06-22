import { Mark, mergeAttributes } from '@tiptap/core'
import type { SuggestionType } from '../../types/suggestion'

export interface SuggestionMarkOptions {
  HTMLAttributes: Record<string, any>
}

export const SuggestionMark = Mark.create<SuggestionMarkOptions>({
  name: 'suggestion',

  // Higher priority to ensure it wraps other marks
  priority: 1001,

  // Allow this mark to wrap other marks
  inclusive: true,
  
  // Allow this mark to span multiple nodes
  spanning: true,
  
  // This mark should not exclude other marks
  excludes: '',
  
  // Allow this mark to be split by other marks
  group: 'inline',
  
  // Prevent this mark from being removed when other marks are toggled
  exitable: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      suggestionId: {
        default: null,
        parseHTML: element => element.getAttribute('data-suggestion-id'),
        renderHTML: attributes => {
          if (!attributes.suggestionId) {
            return {}
          }
          return {
            'data-suggestion-id': attributes.suggestionId,
          }
        },
      },
      suggestionType: {
        default: 'grammar',
        parseHTML: element => element.getAttribute('data-suggestion-type') || 'grammar',
        renderHTML: attributes => {
          return {
            'data-suggestion-type': attributes.suggestionType || 'grammar',
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-suggestion-id]',
        getAttrs: element => {
          const el = element as HTMLElement
          const suggestionType = el.getAttribute('data-suggestion-type') || 'grammar'
          
          // Also try to extract type from class if data attribute is missing
          const classMatch = el.className.match(/suggestion-(\w+)/)
          const typeFromClass = classMatch && classMatch[1] !== 'suggestion' ? classMatch[1] : null
          
          console.log('🔍 parseHTML called for span:', {
            id: el.getAttribute('data-suggestion-id'),
            type: suggestionType,
            typeFromClass,
            classes: el.className,
            html: el.outerHTML.substring(0, 100)
          })
          
          return {
            suggestionId: el.getAttribute('data-suggestion-id'),
            suggestionType: el.getAttribute('data-suggestion-type') || typeFromClass || 'grammar',
          }
        },
      },
      {
        // Also match spans with suggestion class
        tag: 'span.suggestion',
        getAttrs: element => {
          const el = element as HTMLElement
          
          // Extract type from class
          const classMatch = el.className.match(/suggestion-(\w+)/)
          const typeFromClass = classMatch ? classMatch[1] : 'grammar'
          
          console.log('🔍 parseHTML called for span.suggestion:', {
            id: el.getAttribute('data-suggestion-id'),
            typeFromClass,
            classes: el.className,
            html: el.outerHTML.substring(0, 100)
          })
          
          return {
            suggestionId: el.getAttribute('data-suggestion-id') || `parsed-${Date.now()}`,
            suggestionType: el.getAttribute('data-suggestion-type') || typeFromClass,
          }
        },
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    console.log('🔍 SuggestionMark renderHTML called with:', { HTMLAttributes, node: HTMLAttributes.node, nodeType: HTMLAttributes.nodeType })
    
    // Extract attributes
    const suggestionId = HTMLAttributes.suggestionId || HTMLAttributes['data-suggestion-id']
    const suggestionType = HTMLAttributes.suggestionType || HTMLAttributes['data-suggestion-type'] || 'grammar'
    
    // Also try to get type from the mark itself if available
    const typeFromMark = HTMLAttributes.mark?.attrs?.suggestionType || suggestionType
    
    console.log('📍 Determined type:', typeFromMark)
    
    return ['span', mergeAttributes(HTMLAttributes, {
      'data-suggestion-id': suggestionId,
      'data-suggestion-type': typeFromMark,
      'class': `suggestion suggestion-${typeFromMark}`,
    }), 0]
  },

  addCommands() {
    return {
      setSuggestionMark: (attributes: { suggestionId: string; suggestionType: string }) => ({ commands }) => {
        return commands.setMark(this.name, attributes)
      },
      toggleSuggestionMark: (attributes: { suggestionId: string; suggestionType: string }) => ({ commands }) => {
        return commands.toggleMark(this.name, attributes)
      },
      unsetSuggestionMark: () => ({ commands }) => {
        return commands.unsetMark(this.name)
      },
    }
  },
}) 