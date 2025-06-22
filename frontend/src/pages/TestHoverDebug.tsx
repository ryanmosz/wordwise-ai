import { useRef, useEffect } from 'react'
import { useSuggestionHover } from '../hooks/useSuggestionHover'

export function TestHoverDebug() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Use the hover hook
  useSuggestionHover(containerRef)
  
  useEffect(() => {
    console.log('TestHoverDebug mounted, ref:', containerRef.current)
  }, [])
  
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Hover Debug Test</h1>
        
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Static Test (no editor)</h2>
          
          <div ref={containerRef} className="space-y-4">
            <p>
              This is a <span data-suggestion-id="1" data-suggestion-type="grammar" className="suggestion suggestion-grammar">grammar error</span> in the text.
            </p>
            
            <p>
              This text has <span data-suggestion-id="2" data-suggestion-type="tone" className="suggestion suggestion-tone">tone issues that need to be more professional</span> for the audience.
            </p>
            
            <p>
              Split suggestion: <span data-suggestion-id="3" data-suggestion-type="persuasive" className="suggestion suggestion-persuasive">This is the first part</span> and then some normal text and then <span data-suggestion-id="3" data-suggestion-type="persuasive" className="suggestion suggestion-persuasive">this is the second part of the same suggestion</span>.
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-semibold mb-4">Instructions</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Open browser console to see debug logs</li>
            <li>Hover over the underlined text above</li>
            <li>Check if background color changes</li>
            <li>Check console for hover events</li>
          </ol>
        </div>
      </div>
    </div>
  )
} 