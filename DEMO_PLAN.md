# Friday Demo Implementation Plan

## Overview
Quick implementation to demonstrate AI integration for Friday demo. This is temporary code that will be removed after the demo.

## DEMO.1: Create minimal AI service to call edge function

### Goal
Create a simple service that can communicate with our deployed Supabase edge function.

### Implementation Steps
1. Create `frontend/src/services/aiService.ts`
2. Add a single function `analyzeText` that:
   - Takes the selected text as input
   - Gets Supabase URL and anon key from environment
   - Makes a POST request to `/functions/v1/analyze-text`
   - Includes proper headers (Authorization, Content-Type)
   - Returns the raw response or throws on error

### Code Structure
```typescript
// Simple fetch wrapper
export async function analyzeText(text: string) {
  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-text`
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${anonKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text,
      documentId: 'demo-doc',
      userSettings: {
        brandTone: 'friendly',
        readingLevel: 8,
        bannedWords: []
      }
    })
  })
  
  if (!response.ok) {
    throw new Error('Analysis failed')
  }
  
  return response.json()
}
```

### Verification
- Console.log the response to ensure we get suggestions back
- Check network tab for successful API call

---

## DEMO.2: Add "Analyze with AI" button to editor toolbar

### Goal
Add a visible button to the editor that users can click.

### Implementation Steps
1. Open `frontend/src/pages/EditorPage.tsx`
2. In the header section (where Settings/Export/Logout are):
   - Add a button with text "Analyze with AI"
   - Style with Tailwind: blue background, white text
   - Add state: `const [isAnalyzing, setIsAnalyzing] = useState(false)`
   - Disable button when `isAnalyzing` is true

### Button Placement
```
WordWise AI    [Analyze with AI] [Settings] [Export] [Logout]
```

### Code Addition
```jsx
<button
  onClick={handleAnalyze}
  disabled={isAnalyzing}
  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
>
  {isAnalyzing ? 'Analyzing...' : 'Analyze with AI'}
</button>
```

### Verification
- Button appears in toolbar
- Button has proper styling
- Button can be clicked

---

## DEMO.3: Implement text selection and analysis flow

### Goal
Get selected text from TipTap editor and send to AI service.

### Implementation Steps

1. In TextEditor component, expose a method to get selected text:
   - Use TipTap's `editor.state.selection`
   - Get text between selection bounds
   - Return empty string if no selection

2. Add to TextEditor component:
```typescript
// Add this method to get selected text
const getSelectedText = () => {
  if (!editor) return ''
  
  const { from, to } = editor.state.selection
  const selectedText = editor.state.doc.textBetween(from, to)
  return selectedText
}

// Expose via ref or prop callback
```

3. In EditorPage, create click handler:
```typescript
const handleAnalyze = async () => {
  const selectedText = getSelectedText() // from editor ref
  
  if (!selectedText) {
    alert('Please select some text first')
    return
  }
  
  setIsAnalyzing(true)
  setSuggestions([]) // Clear previous suggestions
  
  try {
    const result = await analyzeText(selectedText)
    setSuggestions(result.suggestions || [])
  } catch (error) {
    console.error('Analysis failed:', error)
    alert('Failed to analyze text. Please try again.')
  } finally {
    setIsAnalyzing(false)
  }
}
```

### Verification
- Selecting text and clicking button triggers the API call
- No selection shows alert
- Errors are handled gracefully

---

## DEMO.4: Display raw suggestions in sidebar

### Goal
Show the AI suggestions in the existing sidebar.

### Implementation Steps

1. Add state in EditorPage:
```typescript
const [suggestions, setSuggestions] = useState<any[]>([])
```

2. In the sidebar section (currently shows "No suggestions yet"):
```jsx
<aside className="w-80 border-l p-4 overflow-y-auto">
  <h3 className="font-semibold mb-4">Suggestions</h3>
  
  {suggestions.length === 0 ? (
    <p className="text-gray-500">No suggestions yet</p>
  ) : (
    <div className="space-y-3">
      {suggestions.map((s, i) => (
        <div key={i} className="p-3 border rounded-lg bg-gray-50">
          <div className="font-bold text-sm text-blue-600">
            {s.type.toUpperCase()}
          </div>
          <div className="text-sm mt-1">
            <span className="line-through text-red-600">
              {s.originalText}
            </span>
            {' → '}
            <span className="text-green-600">
              {s.suggestionText}
            </span>
          </div>
          <div className="text-xs text-gray-600 mt-2">
            {s.explanation}
          </div>
          {s.confidence && (
            <div className="text-xs text-gray-500 mt-1">
              Confidence: {(s.confidence * 100).toFixed(0)}%
            </div>
          )}
        </div>
      ))}
    </div>
  )}
</aside>
```

### Verification
- Suggestions appear in sidebar after analysis
- Each suggestion shows type, original/suggested text, and explanation
- Multiple suggestions display in a list

---

## DEMO.5: Add loading state during analysis

### Goal
Show visual feedback while waiting for AI response.

### Implementation Steps

1. Update the sidebar to show loading state:
```jsx
<aside className="w-80 border-l p-4 overflow-y-auto">
  <h3 className="font-semibold mb-4">Suggestions</h3>
  
  {isAnalyzing ? (
    <div className="flex flex-col items-center justify-center py-8">
      <LoadingSpinner size="md" />
      <p className="mt-4 text-gray-600">Analyzing your text...</p>
    </div>
  ) : suggestions.length === 0 ? (
    <p className="text-gray-500">No suggestions yet</p>
  ) : (
    // ... suggestions display
  )}
</aside>
```

2. Button already shows loading state from DEMO.2

### Verification
- Click button → see "Analyzing..." in sidebar with spinner
- Button shows "Analyzing..." and is disabled
- When complete, suggestions replace loading state

---

## Complete Demo Flow Test

### Test Scenario
1. Type text with intentional errors:
   ```
   "This are a great product for marketing professionals. 
   We provides the best solutions."
   ```

2. Select the entire text

3. Click "Analyze with AI" button

4. Observe:
   - Loading spinner appears in sidebar
   - Button changes to "Analyzing..." and is disabled
   - After 1-2 seconds, suggestions appear

5. Expected suggestions:
   - Grammar: "are" → "is"
   - Grammar: "provides" → "provide"
   - Possibly tone/persuasiveness suggestions

### Success Criteria
- ✅ API call succeeds
- ✅ Loading states work correctly
- ✅ Suggestions display properly
- ✅ Can analyze different text selections
- ✅ Error handling works (test with network off)

---

## Demo Talking Points

1. **Introduction**: "WordWise AI helps marketers write better copy with real-time AI suggestions"

2. **Demonstration**:
   - Show the editor interface
   - Type sample marketing copy with errors
   - Select text and click "Analyze with AI"
   - Show the AI suggestions appearing

3. **Value Props**:
   - "Catches grammar errors instantly"
   - "Ensures brand voice consistency"
   - "Suggests more persuasive language"
   - "All powered by GPT-4"

4. **Next Steps**: "We're building inline suggestions and one-click fixes"

---

## Cleanup Notes (for DEMO.9)

After demo, remove:
1. The "Analyze with AI" button from EditorPage
2. The demo-specific `analyzeText` function from aiService.ts
3. The `isAnalyzing` and `suggestions` state from EditorPage
4. The suggestion display logic from sidebar
5. Any demo-specific imports

Keep:
- The edge function (already deployed)
- The LoadingSpinner component (will be reused)
- The basic project structure 