import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SuggestionCard } from './SuggestionCard'
import { Suggestion } from '../../types/suggestion'

describe('SuggestionCard', () => {
  const mockSuggestion: Suggestion = {
    id: 'test-1',
    startIndex: 0,
    endIndex: 8,
    type: 'grammar',
    originalText: 'This are',
    suggestionText: 'This is',
    explanation: 'Subject-verb agreement error',
    confidence: 0.95
  }

  const mockHandlers = {
    onAccept: vi.fn(),
    onReject: vi.fn(),
    onClose: vi.fn()
  }

  const defaultPosition = { x: 100, y: 100 }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all suggestion details correctly', () => {
    render(
      <SuggestionCard
        suggestion={mockSuggestion}
        position={defaultPosition}
        {...mockHandlers}
      />
    )

    // Check header
    expect(screen.getByText('Grammar Correction')).toBeInTheDocument()
    
    // Check original and suggested text
    expect(screen.getByText(mockSuggestion.originalText)).toBeInTheDocument()
    expect(screen.getByText(mockSuggestion.suggestionText)).toBeInTheDocument()
    
    // Check explanation
    expect(screen.getByText(mockSuggestion.explanation)).toBeInTheDocument()
    
    // Check confidence
    expect(screen.getByText('95%')).toBeInTheDocument()
    
    // Check buttons
    expect(screen.getByText('Accept')).toBeInTheDocument()
    expect(screen.getByText('Reject')).toBeInTheDocument()
  })

  it('calls onAccept when Accept button is clicked', () => {
    render(
      <SuggestionCard
        suggestion={mockSuggestion}
        position={defaultPosition}
        {...mockHandlers}
      />
    )

    fireEvent.click(screen.getByText('Accept'))
    expect(mockHandlers.onAccept).toHaveBeenCalledTimes(1)
  })

  it('calls onReject when Reject button is clicked', () => {
    render(
      <SuggestionCard
        suggestion={mockSuggestion}
        position={defaultPosition}
        {...mockHandlers}
      />
    )

    fireEvent.click(screen.getByText('Reject'))
    expect(mockHandlers.onReject).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when close button is clicked', () => {
    render(
      <SuggestionCard
        suggestion={mockSuggestion}
        position={defaultPosition}
        {...mockHandlers}
      />
    )

    const closeButton = screen.getByLabelText('Close')
    fireEvent.click(closeButton)
    expect(mockHandlers.onClose).toHaveBeenCalledTimes(1)
  })

  it('renders correct colors for different suggestion types', () => {
    const toneSuggestion: Suggestion = {
      ...mockSuggestion,
      type: 'tone',
      explanation: 'Tone adjustment needed'
    }

    const { rerender } = render(
      <SuggestionCard
        suggestion={toneSuggestion}
        position={defaultPosition}
        {...mockHandlers}
      />
    )

    expect(screen.getByText('Tone Adjustment')).toBeInTheDocument()
    
    // Test another type
    const persuasiveSuggestion: Suggestion = {
      ...mockSuggestion,
      type: 'persuasive',
      explanation: 'Make it more persuasive'
    }

    rerender(
      <SuggestionCard
        suggestion={persuasiveSuggestion}
        position={defaultPosition}
        {...mockHandlers}
      />
    )

    expect(screen.getByText('Persuasive Language')).toBeInTheDocument()
  })

  it('displays confidence indicator correctly', () => {
    const lowConfidenceSuggestion: Suggestion = {
      ...mockSuggestion,
      confidence: 0.45
    }

    render(
      <SuggestionCard
        suggestion={lowConfidenceSuggestion}
        position={defaultPosition}
        {...mockHandlers}
      />
    )

    expect(screen.getByText('45%')).toBeInTheDocument()
  })
}) 