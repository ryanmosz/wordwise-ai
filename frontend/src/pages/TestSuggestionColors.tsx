import React, { useEffect } from 'react'
import type { SuggestionType } from '../types/suggestion'
import { SUGGESTION_COLORS, getColorScheme } from '../utils/suggestionColors'
import { SuggestionHighlight } from '../components/editor/SuggestionHighlight'
import { verifySuggestionColors } from '../utils/verifySuggestionColors'

export function TestSuggestionColors() {
  const suggestionTypes: SuggestionType[] = [
    'grammar', 'tone', 'persuasive', 'conciseness', 
    'headline', 'readability', 'vocabulary', 'ab_test'
  ]

  useEffect(() => {
    // Run verification on mount
    const isValid = verifySuggestionColors()
    console.log('Color verification result:', isValid)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8">Suggestion Color Test Page</h1>
      
      {/* Color Scheme Table */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Color Scheme Reference</h2>
        <div className="space-y-4">
          {suggestionTypes.map(type => {
            const scheme = getColorScheme(type)
            return (
              <div key={type} className="flex items-center gap-4 p-3 rounded border">
                <span className="text-2xl">{scheme.icon}</span>
                <div className="flex-1">
                  <h3 className="font-medium capitalize">{type.replace('_', ' ')}</h3>
                  <div className="flex gap-2 mt-1">
                    <span className={`px-2 py-1 rounded text-sm ${scheme.bg} ${scheme.text}`}>
                      Background & Text
                    </span>
                    <span className={`px-2 py-1 rounded text-sm border-2 ${scheme.border}`}>
                      Border
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Highlight Examples */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">SuggestionHighlight Examples</h2>
        <div className="space-y-3 text-lg">
          {suggestionTypes.map(type => (
            <p key={type}>
              This text has a{' '}
              <SuggestionHighlight 
                type={type} 
                onClick={() => alert(`Clicked ${type} suggestion`)}
              >
                {type} suggestion highlight
              </SuggestionHighlight>
              {' '}that you can click.
            </p>
          ))}
        </div>
      </div>

      {/* Unknown Type Test */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Fallback Test</h2>
        <p className="text-lg">
          Testing unknown type:{' '}
          <SuggestionHighlight 
            type={'unknown' as SuggestionType} 
            onClick={() => alert('Clicked unknown type')}
          >
            unknown type fallback
          </SuggestionHighlight>
          {' '}(should use grammar colors)
        </p>
      </div>
    </div>
  )
} 