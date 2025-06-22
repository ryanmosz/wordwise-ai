import { useEffect, useRef } from 'react'

// Color mapping for different suggestion types
const SUGGESTION_HOVER_COLORS: Record<string, string> = {
  'suggestion-grammar': 'rgb(254, 242, 242)', // red-50
  'suggestion-tone': 'rgb(254, 252, 232)', // yellow-50
  'suggestion-persuasive': 'rgb(239, 246, 255)', // blue-50
  'suggestion-conciseness': 'rgb(250, 245, 255)', // purple-50
  'suggestion-headline': 'rgb(240, 253, 244)', // green-50
  'suggestion-readability': 'rgb(238, 242, 255)', // indigo-50
  'suggestion-vocabulary': 'rgb(255, 247, 237)', // orange-50
  'suggestion-ab_test': 'rgb(240, 253, 250)', // teal-50
}

export function useSuggestionHover(containerRef: React.RefObject<HTMLElement>) {
  const currentHoveredId = useRef<string | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Add a small delay to prevent immediate hover detection on mount
    const timeoutId = setTimeout(() => {
      // Clean up any existing hover states on initialization
      const existingHovers = container.querySelectorAll('.suggestion-hover')
      existingHovers.forEach(el => {
        el.classList.remove('suggestion-hover')
        const htmlEl = el as HTMLElement
        htmlEl.style.backgroundColor = ''
      })
      
      const handleMouseOver = (e: MouseEvent) => {
        const target = e.target as HTMLElement
        
        // Find the suggestion element (could be the target or a parent)
        const suggestionElement = target.closest('[data-suggestion-id]') as HTMLElement
        
        if (suggestionElement) {
          const suggestionId = suggestionElement.getAttribute('data-suggestion-id')
          
          if (suggestionId && suggestionId !== currentHoveredId.current) {
            console.log('✅ Found suggestion element:', {
              id: suggestionId,
              classes: suggestionElement.className,
              hoveredElement: target.tagName
            })
            
            // Remove hover from previous suggestion
            if (currentHoveredId.current) {
              console.log('🔄 Switching hover from', currentHoveredId.current, 'to', suggestionId)
              removeHoverFromSuggestion(container, currentHoveredId.current)
            }
            
            // Add hover to new suggestion
            addHoverToSuggestion(container, suggestionId)
            currentHoveredId.current = suggestionId
          }
        } else if (currentHoveredId.current) {
          // Mouse moved to non-suggestion element
          console.log('🔀 Moving to non-suggestion element')
          removeHoverFromSuggestion(container, currentHoveredId.current)
          currentHoveredId.current = null
        }
      }

      const addHoverToSuggestion = (container: HTMLElement, suggestionId: string) => {
        const elements = container.querySelectorAll(`[data-suggestion-id="${suggestionId}"]`)
        console.log(`Adding hover to ${elements.length} elements`)
        
        elements.forEach((el, index) => {
          el.classList.add('suggestion-hover')
          console.log(`Element ${index} classes after:`, el.className)
          
          // ALWAYS apply inline style - don't rely on CSS
          const htmlEl = el as HTMLElement
          const suggestionType = Array.from(el.classList).find(cls => cls.startsWith('suggestion-') && cls !== 'suggestion' && cls !== 'suggestion-hover')
          if (suggestionType && SUGGESTION_HOVER_COLORS[suggestionType]) {
            // Force inline style with !important equivalent by setting it directly
            htmlEl.style.setProperty('background-color', SUGGESTION_HOVER_COLORS[suggestionType], 'important')
            console.log(`Applied inline style for ${suggestionType}:`, SUGGESTION_HOVER_COLORS[suggestionType])
            
            // Force a repaint to ensure the style is applied
            void htmlEl.offsetHeight // Read property to force repaint
            
            // Double-check the style was applied
            const appliedBg = window.getComputedStyle(htmlEl).backgroundColor
            console.log(`Verified applied background: ${appliedBg}`)
          } else {
            console.log(`WARNING: No color mapping for type: ${suggestionType}`)
          }
        })
      }

      const removeHoverFromSuggestion = (container: HTMLElement, suggestionId: string) => {
        const elements = container.querySelectorAll(`[data-suggestion-id="${suggestionId}"]`)
        elements.forEach(el => {
          el.classList.remove('suggestion-hover')
          // Remove inline style
          const htmlEl = el as HTMLElement
          htmlEl.style.backgroundColor = ''
        })
      }

      const handleMouseOut = (e: MouseEvent) => {
        const target = e.target as HTMLElement
        const relatedTarget = e.relatedTarget as HTMLElement
        
        // Check if we're still within a suggestion with the same ID
        const fromSuggestion = target.closest('[data-suggestion-id]') as HTMLElement
        const toSuggestion = relatedTarget?.closest('[data-suggestion-id]') as HTMLElement
        
        if (fromSuggestion && toSuggestion) {
          const fromId = fromSuggestion.getAttribute('data-suggestion-id')
          const toId = toSuggestion.getAttribute('data-suggestion-id')
          
          if (fromId === toId) {
            // Still hovering the same suggestion
            return
          }
        }
        
        // If we've left the suggestion entirely
        if (fromSuggestion && !toSuggestion) {
          const suggestionId = fromSuggestion.getAttribute('data-suggestion-id')
          if (suggestionId === currentHoveredId.current) {
            console.log('🔀 Moving to non-suggestion element')
            removeHoverFromSuggestion(container, suggestionId)
            currentHoveredId.current = null
          }
        }
      }

      // Use mouseover/mouseout for better nested element support
      container.addEventListener('mouseover', handleMouseOver, true)
      container.addEventListener('mouseout', handleMouseOut, true)
      
      console.log('🎨 SuggestionHover hook initialized on container:', container)

      return () => {
        container.removeEventListener('mouseover', handleMouseOver, true)
        container.removeEventListener('mouseout', handleMouseOut, true)
        
        // Clean up any remaining hover states
        if (currentHoveredId.current) {
          removeHoverFromSuggestion(container, currentHoveredId.current)
        }
      }
    }, 200) // 200ms delay to allow DOM to settle and prevent initial hover detection

    return () => {
      clearTimeout(timeoutId)
    }
  }, [containerRef])
} 