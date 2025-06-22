import React, { useState, useRef, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { SuggestionMark } from '../components/editor/SuggestionMark'
import { SuggestionCard } from '../components/editor/SuggestionCard'
import type { Suggestion } from '../types'
import { useDocumentStore } from '../store/documentStore'
import './TestAcceptReject.css'

export function TestAcceptReject() {
  const editorRef = useRef<HTMLDivElement>(null)
  const [showCard, setShowCard] = useState(false)
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 })
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null)
  const [acceptedCount, setAcceptedCount] = useState(0)
  const [rejectedCount, setRejectedCount] = useState(0)
  const [testResults, setTestResults] = useState<string[]>([])
  
  const { 
    addSuggestions, 
    updateSuggestionStatus, 
    clearSuggestions,
    activeSuggestions,
    suggestionStatus 
  } = useDocumentStore()

  // Initialize editor with TipTap
  const editor = useEditor({
    extensions: [
      StarterKit,
      SuggestionMark
    ],
    content: `
      <p>
        <span data-suggestion-id="test-1" data-suggestion-type="grammar" class="suggestion suggestion-grammar">This are</span> a test sentence with 
        <span data-suggestion-id="test-2" data-suggestion-type="tone" class="suggestion suggestion-tone">very unique</span> content. 
        <span data-suggestion-id="test-3" data-suggestion-type="persuasive" class="suggestion suggestion-persuasive">Our product is good</span> and helps you achieve your goals.
      </p>
    `,
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none p-4 min-h-[200px] border rounded-lg'
      }
    }
  })

  // Mock suggestions matching the content
  const mockSuggestions: Suggestion[] = [
    {
      id: 'test-1',
      startIndex: 0,
      endIndex: 8,
      type: 'grammar',
      originalText: 'This are',
      suggestionText: 'These are',
      explanation: 'Subject-verb agreement: "This" is singular and requires "is" not "are"',
      confidence: 0.95
    },
    {
      id: 'test-2',
      startIndex: 20,
      endIndex: 31,
      type: 'tone',
      originalText: 'very unique',
      suggestionText: 'distinctive',
      explanation: 'More professional tone: "unique" already means one-of-a-kind',
      confidence: 0.85
    },
    {
      id: 'test-3',
      startIndex: 40,
      endIndex: 55,
      type: 'persuasive',
      originalText: 'Our product is good',
      suggestionText: 'Our award-winning solution transforms your workflow',
      explanation: 'Added credibility and outcome-focused language',
      confidence: 0.78
    }
  ]

  // Initialize suggestions on mount
  useEffect(() => {
    clearSuggestions()
    addSuggestions(mockSuggestions)
    addTestResult('✓ Initialized with 3 suggestions')
  }, [])

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toISOString().split('T')[1].split('.')[0]} - ${result}`])
  }

  // Handle clicking on suggestion
  useEffect(() => {
    if (!editorRef.current) return

    const handleSuggestionClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const suggestionEl = target.closest('[data-suggestion-id]')
      
      if (suggestionEl) {
        const suggestionId = suggestionEl.getAttribute('data-suggestion-id')
        const suggestion = activeSuggestions.get(suggestionId || '')
        
        if (suggestion) {
          const rect = suggestionEl.getBoundingClientRect()
          setClickPosition({ x: rect.right, y: rect.bottom })
          setSelectedSuggestion(suggestion)
          setShowCard(true)
          addTestResult(`✓ Clicked suggestion: ${suggestionId}`)
        }
      }
    }

    editorRef.current.addEventListener('click', handleSuggestionClick)
    return () => {
      editorRef.current?.removeEventListener('click', handleSuggestionClick)
    }
  }, [activeSuggestions])

  const handleAccept = async () => {
    if (!editor || !selectedSuggestion) return

    try {
      // Find the suggestion span in the editor
      const { view } = editor
      const { state } = view
      let from = -1
      let to = -1

      // Find the text position in the document
      state.doc.descendants((node, pos) => {
        if (node.isText && node.text) {
          const marks = node.marks
          const suggestionMark = marks.find(mark => 
            mark.type.name === 'suggestion' && 
            mark.attrs.suggestionId === selectedSuggestion.id
          )
          
          if (suggestionMark) {
            from = pos
            to = pos + node.text.length
            return false // stop iteration
          }
        }
      })

      if (from !== -1 && to !== -1) {
        // Replace text and remove mark
        editor.chain()
          .focus()
          .setTextSelection({ from, to })
          .unsetMark('suggestion')
          .insertContent(selectedSuggestion.suggestionText)
          .run()

        // Update status
        updateSuggestionStatus(selectedSuggestion.id, 'accepted')
        setAcceptedCount(prev => prev + 1)
        
        // Visual feedback
        showAcceptAnimation()
        addTestResult(`✓ Accepted suggestion: ${selectedSuggestion.id} - Text changed to "${selectedSuggestion.suggestionText}"`)
      }
    } catch (error) {
      addTestResult(`✗ Error accepting suggestion: ${error}`)
    }

    setShowCard(false)
  }

  const handleReject = async () => {
    if (!editor || !selectedSuggestion) return

    try {
      // Find and remove the suggestion mark
      const { view } = editor
      const { state } = view
      let from = -1
      let to = -1

      state.doc.descendants((node, pos) => {
        if (node.isText) {
          const marks = node.marks
          const suggestionMark = marks.find(mark => 
            mark.type.name === 'suggestion' && 
            mark.attrs.suggestionId === selectedSuggestion.id
          )
          
          if (suggestionMark) {
            from = pos
            to = pos + node.text!.length
            return false
          }
        }
      })

      if (from !== -1 && to !== -1) {
        // Remove mark only (keep original text)
        editor.chain()
          .focus()
          .setTextSelection({ from, to })
          .unsetMark('suggestion')
          .run()

        // Update status
        updateSuggestionStatus(selectedSuggestion.id, 'rejected')
        setRejectedCount(prev => prev + 1)
        
        // Visual feedback
        showRejectAnimation()
        addTestResult(`✓ Rejected suggestion: ${selectedSuggestion.id} - Mark removed, text unchanged`)
      }
    } catch (error) {
      addTestResult(`✗ Error rejecting suggestion: ${error}`)
    }

    setShowCard(false)
  }

  const showAcceptAnimation = () => {
    const checkmark = document.createElement('div')
    checkmark.className = 'fixed z-50 pointer-events-none text-green-500 text-4xl font-bold'
    checkmark.innerHTML = '✓'
    checkmark.style.cssText = `
      top: ${clickPosition.y}px;
      left: ${clickPosition.x}px;
      animation: acceptPulse 0.5s ease-out;
    `
    document.body.appendChild(checkmark)
    setTimeout(() => checkmark.remove(), 500)
  }

  const showRejectAnimation = () => {
    const cross = document.createElement('div')
    cross.className = 'fixed z-50 pointer-events-none text-red-500 text-4xl font-bold'
    cross.innerHTML = '✗'
    cross.style.cssText = `
      top: ${clickPosition.y}px;
      left: ${clickPosition.x}px;
      animation: rejectSlide 0.3s ease-out;
    `
    document.body.appendChild(cross)
    setTimeout(() => cross.remove(), 300)
  }

  // Debug info for W3M
  const debugInfo = {
    totalSuggestions: activeSuggestions.size,
    acceptedCount,
    rejectedCount,
    pendingCount: Array.from(suggestionStatus.values()).filter(s => s === 'pending').length,
    editorReady: editor !== null
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Test Accept/Reject Functionality</h1>
        
        {/* Instructions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>Click on any underlined text to see a suggestion</li>
            <li>Click "Accept" to replace text with the suggestion</li>
            <li>Click "Reject" to remove highlighting but keep original text</li>
            <li>Watch for visual feedback animations</li>
          </ol>
        </div>

        {/* Editor */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Editor with Suggestions</h2>
          <div ref={editorRef}>
            <EditorContent editor={editor} />
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Statistics</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{acceptedCount}</div>
              <div className="text-sm text-gray-600">Accepted</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">{rejectedCount}</div>
              <div className="text-sm text-gray-600">Rejected</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{debugInfo.pendingCount}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
          </div>
        </div>

        {/* Test Results */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          <div className="bg-gray-50 rounded p-4 max-h-64 overflow-y-auto">
            <pre className="text-sm font-mono whitespace-pre-wrap">
              {testResults.length > 0 ? testResults.join('\n') : 'No test results yet...'}
            </pre>
          </div>
        </div>

        {/* Debug Info for W3M */}
        <div className="sr-only" data-testid="accept-reject-debug">
          DEBUG: Accept/Reject Test Page
          ==============================
          Total Suggestions: {debugInfo.totalSuggestions}
          Accepted: {debugInfo.acceptedCount}
          Rejected: {debugInfo.rejectedCount}
          Pending: {debugInfo.pendingCount}
          Editor Ready: {debugInfo.editorReady ? 'yes' : 'no'}
        </div>

        {/* ASCII Visualization */}
        <pre className="sr-only" aria-label="suggestion-status">
{`Suggestion Status:
Grammar:     ${suggestionStatus.get('test-1') === 'accepted' ? '[✓]' : suggestionStatus.get('test-1') === 'rejected' ? '[✗]' : '[ ]'} ${suggestionStatus.get('test-1') || 'pending'}
Tone:        ${suggestionStatus.get('test-2') === 'accepted' ? '[✓]' : suggestionStatus.get('test-2') === 'rejected' ? '[✗]' : '[ ]'} ${suggestionStatus.get('test-2') || 'pending'}
Persuasive:  ${suggestionStatus.get('test-3') === 'accepted' ? '[✓]' : suggestionStatus.get('test-3') === 'rejected' ? '[✗]' : '[ ]'} ${suggestionStatus.get('test-3') || 'pending'}`}
        </pre>
      </div>

      {/* Render SuggestionCard */}
      {showCard && selectedSuggestion && (
        <SuggestionCard
          suggestion={selectedSuggestion}
          position={clickPosition}
          onAccept={handleAccept}
          onReject={handleReject}
          onClose={() => setShowCard(false)}
        />
      )}


    </div>
  )
} 