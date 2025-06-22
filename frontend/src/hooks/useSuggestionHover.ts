import { useEffect, useRef, useCallback } from 'react'

// Color mapping for different suggestion types
const SUGGESTION_HOVER_COLORS: Record<string, string> = {
  'suggestion-grammar': 'rgb(254, 242, 242)',     // red-50
  'suggestion-tone': 'rgb(254, 252, 232)',        // yellow-50  
  'suggestion-persuasive': 'rgb(219, 234, 254)',  // blue-100
  'suggestion-conciseness': 'rgb(243, 232, 255)', // purple-100
  'suggestion-headline': 'rgb(240, 253, 244)',    // green-50
  'suggestion-readability': 'rgb(254, 243, 199)', // amber-100
  'suggestion-vocabulary': 'rgb(254, 226, 226)',  // rose-100
  'suggestion-ab_test': 'rgb(204, 251, 241)'      // teal-100
}

export function useSuggestionHover(containerRef: React.RefObject<HTMLElement>) {
  const currentHoveredRef = useRef<string | null>(null)
  
  const removeHoverFromAll = useCallback(() => {
    if (!containerRef.current) return
    
    const allHovered = containerRef.current.querySelectorAll('.suggestion-hover')
    allHovered.forEach(el => {
      el.classList.remove('suggestion-hover')
      // Remove inline style
      const htmlEl = el as HTMLElement
      htmlEl.style.backgroundColor = ''
    })
  }, [containerRef])
  
  const handleMouseOver = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement
    
    // Check if this is a suggestion element or its child
    const suggestionEl = target.closest('[data-suggestion-id]') as HTMLElement
    
    if (suggestionEl) {
      const suggestionId = suggestionEl.getAttribute('data-suggestion-id')
      const suggestionType = suggestionEl.getAttribute('data-suggestion-type')
      
      console.log('✅ Found suggestion element:', {
        id: suggestionId,
        classes: suggestionEl.className,
        hoveredElement: target.tagName
      })
      
      // If we're already hovering this suggestion, do nothing
      if (currentHoveredRef.current === suggestionId) {
        return
      }
      
      // Remove hover from previous suggestion
      if (currentHoveredRef.current) {
        console.log(`🔄 Switching hover from ${currentHoveredRef.current} to ${suggestionId}`)
        removeHoverFromAll()
      }
      
      // Update current hovered suggestion
      currentHoveredRef.current = suggestionId
      
      // Find all elements with this suggestion ID (there might be multiple if the suggestion spans lines)
      const allElements = containerRef.current?.querySelectorAll(`[data-suggestion-id="${suggestionId}"]`)
      
      if (allElements && allElements.length > 0) {
        console.log(`Adding hover to ${allElements.length} elements`)
        
        // Apply hover to all elements
        allElements.forEach((el, index) => {
          const htmlEl = el as HTMLElement
          
          // Add hover class
          htmlEl.classList.add('suggestion-hover')
          console.log(`Element ${index} classes after:`, htmlEl.className)
          
          // Apply inline style as fallback
          const typeColors: Record<string, string> = {
            'grammar': 'rgb(254, 242, 242)',
            'tone': 'rgb(254, 252, 232)', 
            'persuasive': 'rgb(219, 234, 254)',
            'conciseness': 'rgb(243, 232, 255)',
            'headline': 'rgb(240, 253, 244)',
            'readability': 'rgb(254, 243, 199)',
            'vocabulary': 'rgb(254, 226, 226)',
            'ab_test': 'rgb(204, 251, 241)'
          }
          
          if (suggestionType && typeColors[suggestionType]) {
            htmlEl.style.setProperty('background-color', typeColors[suggestionType], 'important')
            console.log(`Applied inline style for suggestion-${suggestionType}: ${typeColors[suggestionType]}`)
            
            // Verify the style was applied
            const computed = window.getComputedStyle(htmlEl)
            console.log(`Verified applied background: ${computed.backgroundColor}`)
          }
        })
      }
    } else {
      // Not hovering over a suggestion
      if (currentHoveredRef.current) {
        removeHoverFromAll()
        currentHoveredRef.current = null
      }
    }
  }, [containerRef, removeHoverFromAll])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Add classes to enable hover behavior
    container.classList.add('interactive')
    
    // Initialize after a short delay to ensure CSS is loaded
    const initTimer = setTimeout(() => {
      // Check if CSS rules are loaded
      const testEl = document.createElement('span')
      testEl.className = 'suggestion suggestion-grammar suggestion-hover'
      container.appendChild(testEl)
      const computed = window.getComputedStyle(testEl)
      const hasBg = computed.backgroundColor !== 'rgba(0, 0, 0, 0)'
      container.removeChild(testEl)
      
      if (!hasBg) {
        console.log('⚠️ Suggestion hover CSS not loaded, using inline styles as fallback')
      }
      
      console.log('🎨 SuggestionHover hook initialized on container:', container)
    }, 100)

    const handleMouseOut = (e: MouseEvent) => {
      const relatedTarget = e.relatedTarget as HTMLElement
      const fromSuggestion = (e.target as HTMLElement).closest('[data-suggestion-id]')
      const toSuggestion = relatedTarget?.closest('[data-suggestion-id]')
      
      // Only remove hover if we're leaving the suggestion entirely
      if (fromSuggestion && !toSuggestion) {
        const suggestionId = fromSuggestion.getAttribute('data-suggestion-id')
        if (suggestionId === currentHoveredRef.current) {
          console.log('🔀 Moving to non-suggestion element')
          removeHoverFromAll()
          currentHoveredRef.current = null
        }
      }
    }

    // Add event listeners
    container.addEventListener('mouseover', handleMouseOver)
    container.addEventListener('mouseout', handleMouseOut)

    return () => {
      clearTimeout(initTimer)
      container.removeEventListener('mouseover', handleMouseOver)
      container.removeEventListener('mouseout', handleMouseOut)
      
      // Clean up any remaining hover states
      if (currentHoveredRef.current) {
        removeHoverFromAll()
      }
    }
  }, [containerRef, handleMouseOver, removeHoverFromAll])
} 