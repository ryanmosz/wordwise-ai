import React from 'react'
import type { SuggestionType } from '../../types/suggestion'
import { getSuggestionBorderClass, getSuggestionHoverClass } from '../../utils/suggestionColors'

interface SuggestionHighlightProps {
  type: SuggestionType
  children: React.ReactNode
  onClick: () => void
}

export function SuggestionHighlight({ type, children, onClick }: SuggestionHighlightProps) {
  const borderClass = getSuggestionBorderClass(type)
  const hoverClass = getSuggestionHoverClass(type)
  
  return (
    <span
      className={`cursor-pointer border-b-2 ${borderClass} ${hoverClass} transition-colors duration-200`}
      onClick={onClick}
    >
      {children}
    </span>
  )
} 