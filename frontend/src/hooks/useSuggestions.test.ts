import { renderHook, act, waitFor } from '@testing-library/react'
import { useSuggestions } from './useSuggestions'

describe('useSuggestions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Mock console.log to reduce noise in tests
    jest.spyOn(console, 'log').mockImplementation()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should return initial state', () => {
    const { result } = renderHook(() =>
      useSuggestions({
        text: '',
        documentId: 'test-123',
        enabled: true,
      })
    )

    expect(result.current.suggestions).toEqual([])
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBe(null)
    expect(typeof result.current.acceptSuggestion).toBe('function')
    expect(typeof result.current.rejectSuggestion).toBe('function')
  })

  it('should skip analysis for short text', async () => {
    const { result } = renderHook(() =>
      useSuggestions({
        text: 'short',
        documentId: 'test-123',
        enabled: true,
      })
    )

    // Wait a bit to ensure no analysis starts
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100))
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.suggestions).toEqual([])
  })

  it('should trigger analysis for text >= 10 characters', async () => {
    const { result } = renderHook(() =>
      useSuggestions({
        text: 'This are a test sentence',
        documentId: 'test-123',
        enabled: true,
      })
    )

    // Should start loading after debounce
    await waitFor(() => {
      expect(result.current.isLoading).toBe(true)
    }, { timeout: 3000 })

    // Should complete and return suggestions
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
      expect(result.current.suggestions.length).toBeGreaterThan(0)
    }, { timeout: 4000 })

    // Check the grammar suggestion
    const grammarSuggestion = result.current.suggestions.find(s => s.type === 'grammar')
    expect(grammarSuggestion).toBeDefined()
    expect(grammarSuggestion?.originalText).toBe('This are')
    expect(grammarSuggestion?.suggestionText).toBe('These are')
  })

  it('should accept suggestions', async () => {
    const { result } = renderHook(() =>
      useSuggestions({
        text: 'This are a test',
        documentId: 'test-123',
        enabled: true,
      })
    )

    // Wait for suggestions
    await waitFor(() => {
      expect(result.current.suggestions.length).toBeGreaterThan(0)
    }, { timeout: 4000 })

    const suggestionId = result.current.suggestions[0].id

    // Accept the suggestion
    await act(async () => {
      await result.current.acceptSuggestion(suggestionId)
    })

    // Check it's marked as accepted
    const acceptedSuggestion = result.current.suggestions.find(s => s.id === suggestionId)
    expect(acceptedSuggestion?.accepted).toBe(true)
  })

  it('should reject suggestions', async () => {
    const { result } = renderHook(() =>
      useSuggestions({
        text: 'This are a test',
        documentId: 'test-123',
        enabled: true,
      })
    )

    // Wait for suggestions
    await waitFor(() => {
      expect(result.current.suggestions.length).toBeGreaterThan(0)
    }, { timeout: 4000 })

    const suggestionId = result.current.suggestions[0].id

    // Reject the suggestion
    await act(async () => {
      await result.current.rejectSuggestion(suggestionId)
    })

    // Check it's marked as rejected
    const rejectedSuggestion = result.current.suggestions.find(s => s.id === suggestionId)
    expect(rejectedSuggestion?.accepted).toBe(false)
  })

  it('should not analyze when disabled', async () => {
    const { result } = renderHook(() =>
      useSuggestions({
        text: 'This are a long enough text',
        documentId: 'test-123',
        enabled: false,
      })
    )

    // Wait to ensure no analysis starts
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 2500))
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.suggestions).toEqual([])
  })

  it('should handle professional tone suggestions', async () => {
    const { result } = renderHook(() =>
      useSuggestions({
        text: 'Hey folks, this is good stuff',
        documentId: 'test-123',
        enabled: true,
        userSettings: {
          brandTone: 'professional',
          readingLevel: 8,
          bannedWords: []
        }
      })
    )

    // Wait for suggestions
    await waitFor(() => {
      expect(result.current.suggestions.length).toBeGreaterThan(0)
    }, { timeout: 4000 })

    // Should have tone and persuasive suggestions
    const toneSuggestion = result.current.suggestions.find(s => s.type === 'tone')
    const persuasiveSuggestion = result.current.suggestions.find(s => s.type === 'persuasive')

    expect(toneSuggestion).toBeDefined()
    expect(toneSuggestion?.originalText).toBe('Hey')
    expect(toneSuggestion?.suggestionText).toBe('Hello')

    expect(persuasiveSuggestion).toBeDefined()
    expect(persuasiveSuggestion?.originalText).toBe('good')
    expect(persuasiveSuggestion?.suggestionText).toBe('exceptional')
  })
}) 