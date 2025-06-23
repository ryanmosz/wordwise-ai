import { useEffect, useRef, useCallback } from 'react'

// Simplified hover hook that just handles group hover for split suggestions
export function useSuggestionHover<T extends HTMLElement = HTMLElement>(containerRef: React.RefObject<T>) {
  const currentHoveredRef = useRef<string | null>(null)
  
  // Handle group hover for split suggestions
  const handleMouseOver = useCallback((e: MouseEvent) => {
    // Skip if JavaScript hover is disabled
    const proseMirror = containerRef.current?.querySelector('.ProseMirror')
    if (proseMirror?.classList.contains('disable-js-hover')) {
      return
    }
    
    const target = e.target as HTMLElement
    const suggestionElement = target.closest('[data-suggestion-id]') as HTMLElement
    
    if (suggestionElement) {
      const suggestionId = suggestionElement.getAttribute('data-suggestion-id')
      
      // If we're already hovering this suggestion, do nothing
      if (currentHoveredRef.current === suggestionId) {
        return
      }
      
      // If there was a previous hover, remove it
      if (currentHoveredRef.current && containerRef.current) {
        const prevElements = containerRef.current.querySelectorAll(
          `[data-suggestion-id="${currentHoveredRef.current}"]`
        )
        prevElements.forEach(el => {
          el.classList.remove('suggestion-hover')
        })
      }
      
      // Add hover class to all elements with this suggestion ID
      if (suggestionId && containerRef.current) {
        const allElements = containerRef.current.querySelectorAll(
          `[data-suggestion-id="${suggestionId}"]`
        )
        allElements.forEach(el => {
          el.classList.add('suggestion-hover')
        })
        
        currentHoveredRef.current = suggestionId
        console.log(`🎯 Hovering suggestion: ${suggestionId} (${allElements.length} elements)`)
      }
    }
  }, [containerRef])
  
  const handleMouseOut = useCallback((e: MouseEvent) => {
    // Skip if JavaScript hover is disabled
    const proseMirror = containerRef.current?.querySelector('.ProseMirror')
    if (proseMirror?.classList.contains('disable-js-hover')) {
      return
    }
    
    const target = e.target as HTMLElement
    const relatedTarget = e.relatedTarget as HTMLElement
    const fromSuggestion = target.closest('[data-suggestion-id]')
    const toSuggestion = relatedTarget?.closest('[data-suggestion-id]')
    
    // Get suggestion IDs
    const fromId = fromSuggestion?.getAttribute('data-suggestion-id')
    const toId = toSuggestion?.getAttribute('data-suggestion-id')
    
    // Only remove hover if we're leaving the suggestion entirely
    if (fromSuggestion && fromId !== toId) {
      if (containerRef.current) {
        const allElements = containerRef.current.querySelectorAll(
          `[data-suggestion-id="${fromId}"]`
        )
        allElements.forEach(el => {
          el.classList.remove('suggestion-hover')
        })
      }
      
      if (fromId === currentHoveredRef.current) {
        currentHoveredRef.current = null
        console.log(`🔀 Left suggestion: ${fromId}`)
      }
    }
  }, [containerRef])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    console.log('🎨 SuggestionHover hook initializing (simplified version)...')
    
    // Add event listeners
    container.addEventListener('mouseover', handleMouseOver)
    container.addEventListener('mouseout', handleMouseOut)

    return () => {
      container.removeEventListener('mouseover', handleMouseOver)
      container.removeEventListener('mouseout', handleMouseOut)
      
      // Clean up any remaining hover states
      const allHovered = container.querySelectorAll('.suggestion-hover')
      allHovered.forEach(el => {
        el.classList.remove('suggestion-hover')
      })
    }
  }, [containerRef, handleMouseOver, handleMouseOut])
  
  // Expose method for programmatic hover (for testing)
  return {
    triggerHover: (suggestionId: string) => {
      if (!containerRef.current) return
      
      // Remove previous hover
      const allHovered = containerRef.current.querySelectorAll('.suggestion-hover')
      allHovered.forEach(el => {
        el.classList.remove('suggestion-hover')
      })
      
      // Add new hover
      const elements = containerRef.current.querySelectorAll(
        `[data-suggestion-id="${suggestionId}"]`
      )
      elements.forEach(el => {
        el.classList.add('suggestion-hover')
      })
      
      currentHoveredRef.current = suggestionId
    },
    clearHover: () => {
      if (!containerRef.current) return
      
      const allHovered = containerRef.current.querySelectorAll('.suggestion-hover')
      allHovered.forEach(el => {
        el.classList.remove('suggestion-hover')
      })
      
      currentHoveredRef.current = null
    }
  }
} 