import type { SuggestionType } from '../types/suggestion'

interface ColorScheme {
  border: string
  bg: string
  text: string
  icon: string
  hoverBg: string
}

export const SUGGESTION_COLORS: Record<SuggestionType, ColorScheme> = {
  grammar: {
    border: 'border-red-500',
    bg: 'bg-red-50',
    text: 'text-red-700',
    icon: '📝',
    hoverBg: 'hover:bg-red-50'
  },
  tone: {
    border: 'border-yellow-500',
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    icon: '🎯',
    hoverBg: 'hover:bg-yellow-50'
  },
  persuasive: {
    border: 'border-blue-500',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    icon: '💪',
    hoverBg: 'hover:bg-blue-50'
  },
  conciseness: {
    border: 'border-purple-500',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    icon: '✂️',
    hoverBg: 'hover:bg-purple-50'
  },
  headline: {
    border: 'border-green-500',
    bg: 'bg-green-50',
    text: 'text-green-700',
    icon: '📰',
    hoverBg: 'hover:bg-green-50'
  },
  readability: {
    border: 'border-indigo-500',
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    icon: '📖',
    hoverBg: 'hover:bg-indigo-50'
  },
  vocabulary: {
    border: 'border-orange-500',
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    icon: '📚',
    hoverBg: 'hover:bg-orange-50'
  },
  ab_test: {
    border: 'border-teal-500',
    bg: 'bg-teal-50',
    text: 'text-teal-700',
    icon: '🔄',
    hoverBg: 'hover:bg-teal-50'
  }
}

export function getColorScheme(type: SuggestionType): ColorScheme {
  return SUGGESTION_COLORS[type] || SUGGESTION_COLORS.grammar
}

export function getSuggestionBorderClass(type: SuggestionType): string {
  return getColorScheme(type).border
}

export function getSuggestionBackgroundClass(type: SuggestionType): string {
  return getColorScheme(type).bg
}

export function getSuggestionTextClass(type: SuggestionType): string {
  return getColorScheme(type).text
}

export function getSuggestionIcon(type: SuggestionType): string {
  return getColorScheme(type).icon
}

export function getSuggestionHoverClass(type: SuggestionType): string {
  return getColorScheme(type).hoverBg
} 