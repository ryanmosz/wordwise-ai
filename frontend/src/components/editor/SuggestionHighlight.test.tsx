import { render, screen, fireEvent } from '@testing-library/react'
import { SuggestionHighlight } from './SuggestionHighlight'
import { SuggestionType } from '../../types/suggestion'

describe('SuggestionHighlight', () => {
  const mockOnClick = jest.fn()

  beforeEach(() => {
    mockOnClick.mockClear()
  })

  test('renders children correctly', () => {
    render(
      <SuggestionHighlight type="grammar" onClick={mockOnClick}>
        Test content
      </SuggestionHighlight>
    )
    
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  test('applies correct color classes for each type', () => {
    const testCases: { type: SuggestionType; expectedClass: string }[] = [
      { type: 'grammar', expectedClass: 'border-red-500' },
      { type: 'tone', expectedClass: 'border-yellow-500' },
      { type: 'persuasive', expectedClass: 'border-blue-500' },
      { type: 'headline', expectedClass: 'border-green-500' },
    ]

    testCases.forEach(({ type, expectedClass }) => {
      const { container } = render(
        <SuggestionHighlight type={type} onClick={mockOnClick}>
          Test
        </SuggestionHighlight>
      )
      
      const span = container.querySelector('span')
      expect(span?.className).toContain(expectedClass)
    })
  })

  test('calls onClick when clicked', () => {
    render(
      <SuggestionHighlight type="grammar" onClick={mockOnClick}>
        Click me
      </SuggestionHighlight>
    )
    
    const span = screen.getByText('Click me')
    fireEvent.click(span)
    
    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })

  test('has cursor pointer and hover styles', () => {
    const { container } = render(
      <SuggestionHighlight type="tone" onClick={mockOnClick}>
        Hover test
      </SuggestionHighlight>
    )
    
    const span = container.querySelector('span')
    expect(span?.className).toContain('cursor-pointer')
    expect(span?.className).toContain('hover:bg-gray-100')
  })
}) 