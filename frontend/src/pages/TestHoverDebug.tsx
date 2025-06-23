import { useRef, useEffect } from 'react'
import { useSuggestionHover } from '../hooks/useSuggestionHover'

export function TestHoverDebug() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { triggerHover, clearHover } = useSuggestionHover(containerRef)
  
  useEffect(() => {
    console.log('TestHoverDebug mounted, ref:', containerRef.current)
  }, [])
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Hover Debug Test</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Static Test (no editor)</h2>
          
          <div ref={containerRef} className="space-y-4">
            <p>
              This is a <span data-suggestion-id="1" data-suggestion-type="grammar" className="suggestion suggestion-grammar">grammar error</span> in the text.
            </p>
            
            <p>
              Here's some <span data-suggestion-id="2" data-suggestion-type="vocabulary" className="suggestion suggestion-vocabulary">vocabulary</span> that could be improved.
            </p>
          </div>
          
          <div className="mt-4 space-x-2">
            <button 
              onClick={() => triggerHover('1')}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Trigger Hover on Grammar
            </button>
            <button 
              onClick={() => triggerHover('2')}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              Trigger Hover on Vocabulary
            </button>
            <button 
              onClick={() => clearHover()}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Clear Hover
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 