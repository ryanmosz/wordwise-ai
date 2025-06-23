import { useEffect, useRef } from 'react'
import type { Suggestion } from '../../types'
import { getColorScheme, getSuggestionIcon } from '../../utils/suggestionColors'

interface SuggestionCardProps {
  suggestion: Suggestion
  position: { x: number; y: number }
  onAccept: () => void
  onReject: () => void
  onClose: () => void
}

export function SuggestionCard({ suggestion, position, onAccept, onReject, onClose }: SuggestionCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const colorScheme = getColorScheme(suggestion.type)
  const icon = getSuggestionIcon(suggestion.type)
  
  // Get label for suggestion type
  const getLabel = () => {
    const labels = {
      grammar: 'Grammar Correction',
      tone: 'Tone Adjustment',
      persuasive: 'Persuasive Language',
      conciseness: 'Conciseness',
      headline: 'Headline Optimization',
      readability: 'Readability',
      vocabulary: 'Vocabulary',
      ab_test: 'A/B Alternative'
    }
    return labels[suggestion.type] || 'Suggestion'
  }

  // Calculate position to keep card within viewport
  useEffect(() => {
    // Small delay to ensure card is rendered and dimensions are available
    const timer = setTimeout(() => {
      if (cardRef.current) {
        const card = cardRef.current
        const rect = card.getBoundingClientRect()
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight

        // Estimate card dimensions if not yet rendered properly
        const cardHeight = rect.height || 300; // 300px is a reasonable estimate
        const cardWidth = rect.width || 320; // Based on minWidth style

        // Horizontal positioning: try to position to the right of text
        let adjustedX = position.x + 2 // Add minimal 2px gap from text
        
        // If card would go off right edge, position to the left of text instead
        if (adjustedX + cardWidth > viewportWidth - 20) {
          // Try positioning to the left of the click position
          adjustedX = position.x - cardWidth - 2
          
          // If that would go off left edge, just cap at right edge
          if (adjustedX < 20) {
            adjustedX = viewportWidth - cardWidth - 20
          }
        }
        
        // Vertical positioning
        let adjustedY = position.y
        
        // Always try to position above first
        // Since position.y is now the bottom of the text, we position above it
        const preferredY = position.y - cardHeight - 5
        
        // Only position below if there's clearly not enough space above
        // Minimal 5px buffer from viewport top
        if (preferredY < 5) {
          // Position below the text instead
          adjustedY = position.y + 5
        } else {
          adjustedY = preferredY
        }
        
        // Final check: ensure card doesn't go below viewport
        if (adjustedY + cardHeight > viewportHeight - 20) {
          // If we're already trying to show above but it still goes off bottom,
          // just cap it at the bottom of viewport
          adjustedY = Math.min(adjustedY, viewportHeight - cardHeight - 20)
        }

        card.style.left = `${adjustedX}px`
        card.style.top = `${adjustedY}px`
      }
    }, 10)

    return () => clearTimeout(timer)
  }, [position])

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    // Delay to prevent immediate close on card creation
    setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside)
    }, 100)
    
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  return (
    <div
      ref={cardRef}
      className="fixed z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4 max-w-sm animate-fadeIn"
      style={{ 
        minWidth: '320px',
        left: `${position.x}px`,
        top: `${position.y}px`
      }}
    >
        {/* Header */}
        <div className={`flex items-center justify-between mb-3 pb-2 border-b ${colorScheme.bg} -m-4 mb-3 p-4 rounded-t-lg`}>
          <div className="flex items-center gap-2">
            <span className="text-xl">{icon}</span>
            <h3 className={`font-semibold ${colorScheme.text}`}>{getLabel()}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="space-y-3">
          {/* Original vs Suggested */}
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">✗</span>
              <p className="text-gray-700 line-through">{suggestion.originalText}</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <p className="text-gray-900 font-medium bg-green-50 px-2 py-1 rounded">
                {suggestion.suggestionText}
              </p>
            </div>
          </div>

          {/* Explanation */}
          <div className="text-sm text-gray-600 italic">
            {suggestion.explanation}
          </div>

          {/* Confidence Indicator */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Confidence</span>
              <span>{Math.round(suggestion.confidence * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${suggestion.confidence * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4 pt-3 border-t">
          <button
            onClick={onAccept}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Accept
          </button>
          <button
            onClick={onReject}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Reject
          </button>
        </div>
      </div>
  )
} 