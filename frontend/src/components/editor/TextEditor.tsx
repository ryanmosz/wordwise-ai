import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect, useRef, useImperativeHandle, forwardRef, useState } from 'react'
import { LoadingSpinner } from '../common/LoadingSpinner'
import { SuggestionMark } from './SuggestionMark'
import { useSuggestionHover } from '../../hooks/useSuggestionHover'
import { SuggestionCard } from './SuggestionCard'
import type { Suggestion } from '../../types/suggestion'
import { characterToEditorPosition, getTextAtPosition } from '../../utils/editorUtils'

interface TextEditorProps {
  content: string
  onChange: (content: string) => void
  suggestions?: Suggestion[]
  onAcceptSuggestion?: (suggestionId: string) => void
  onRejectSuggestion?: (suggestionId: string) => void
}

export interface TextEditorHandle {
  getEditor: () => ReturnType<typeof useEditor>
  getText: () => string
}

interface ToolbarProps {
  editor: ReturnType<typeof useEditor>
}

function Toolbar({ editor }: ToolbarProps) {
  if (!editor) {
    return null
  }

  return (
    <div className="border-b border-slate-200 p-2 flex items-center space-x-2 flex-wrap">
      {/* Bold */}
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`px-3 py-1.5 rounded-lg font-medium transition-all duration-200 ${
          editor.isActive('bold')
            ? 'bg-slate-900 text-white'
            : 'text-slate-600 hover:text-slate-900 hover:bg-ice-100'
        }`}
        title="Bold (Cmd+B)"
      >
        B
      </button>

      {/* Italic */}
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`px-3 py-1.5 rounded-lg font-medium italic transition-all duration-200 ${
          editor.isActive('italic')
            ? 'bg-slate-900 text-white'
            : 'text-slate-600 hover:text-slate-900 hover:bg-ice-100'
        }`}
        title="Italic (Cmd+I)"
      >
        I
      </button>

      {/* Underline */}
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        disabled={!editor.can().chain().focus().toggleUnderline().run()}
        className={`px-3 py-1.5 rounded-lg font-medium underline transition-all duration-200 ${
          editor.isActive('underline')
            ? 'bg-slate-900 text-white'
            : 'text-slate-600 hover:text-slate-900 hover:bg-ice-100'
        }`}
        title="Underline (Cmd+U)"
      >
        U
      </button>

      {/* Strikethrough */}
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={`px-3 py-1.5 rounded-lg font-medium line-through transition-all duration-200 ${
          editor.isActive('strike')
            ? 'bg-slate-900 text-white'
            : 'text-slate-600 hover:text-slate-900 hover:bg-ice-100'
        }`}
        title="Strikethrough"
      >
        S
      </button>

      {/* Separator */}
      <div className="w-px h-6 bg-slate-300 mx-1" />

      {/* Paragraph */}
      <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={`px-3 py-1.5 rounded-lg font-medium transition-all duration-200 ${
          editor.isActive('paragraph')
            ? 'bg-slate-900 text-white'
            : 'text-slate-600 hover:text-slate-900 hover:bg-ice-100'
        }`}
        title="Normal text"
      >
        ¶
      </button>

      {/* Heading 1 */}
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`px-3 py-1.5 rounded-lg font-medium transition-all duration-200 ${
          editor.isActive('heading', { level: 1 })
            ? 'bg-slate-900 text-white'
            : 'text-slate-600 hover:text-slate-900 hover:bg-ice-100'
        }`}
        title="Heading 1"
      >
        H1
      </button>

      {/* Heading 2 */}
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`px-3 py-1.5 rounded-lg font-medium transition-all duration-200 ${
          editor.isActive('heading', { level: 2 })
            ? 'bg-slate-900 text-white'
            : 'text-slate-600 hover:text-slate-900 hover:bg-ice-100'
        }`}
        title="Heading 2"
      >
        H2
      </button>

      {/* Heading 3 */}
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`px-3 py-1.5 rounded-lg font-medium transition-all duration-200 ${
          editor.isActive('heading', { level: 3 })
            ? 'bg-slate-900 text-white'
            : 'text-slate-600 hover:text-slate-900 hover:bg-ice-100'
        }`}
        title="Heading 3"
      >
        H3
      </button>

      {/* Separator */}
      <div className="w-px h-6 bg-slate-300 mx-1" />

      {/* Highlight - Yellow */}
      <button
        onClick={() => editor.chain().focus().toggleHighlight({ color: '#fde047' }).run()}
        className={`px-3 py-1.5 rounded-lg font-medium transition-all duration-200 ${
          editor.isActive('highlight', { color: '#fde047' })
            ? 'bg-slate-900 text-white'
            : 'text-slate-600 hover:text-slate-900 hover:bg-ice-100'
        }`}
        title="Highlight Yellow"
      >
        <span className="bg-yellow-300 px-1 rounded">H</span>
      </button>

      {/* Highlight - Red */}
      <button
        onClick={() => editor.chain().focus().toggleHighlight({ color: '#fca5a5' }).run()}
        className={`px-3 py-1.5 rounded-lg font-medium transition-all duration-200 ${
          editor.isActive('highlight', { color: '#fca5a5' })
            ? 'bg-slate-900 text-white'
            : 'text-slate-600 hover:text-slate-900 hover:bg-ice-100'
        }`}
        title="Highlight Red"
      >
        <span className="bg-red-300 px-1 rounded">H</span>
      </button>

      {/* Highlight - Blue */}
      <button
        onClick={() => editor.chain().focus().toggleHighlight({ color: '#93c5fd' }).run()}
        className={`px-3 py-1.5 rounded-lg font-medium transition-all duration-200 ${
          editor.isActive('highlight', { color: '#93c5fd' })
            ? 'bg-slate-900 text-white'
            : 'text-slate-600 hover:text-slate-900 hover:bg-ice-100'
        }`}
        title="Highlight Blue"
      >
        <span className="bg-blue-300 px-1 rounded">H</span>
      </button>

      {/* Clear Highlight */}
      <button
        onClick={() => editor.chain().focus().unsetHighlight().run()}
        disabled={!editor.isActive('highlight') || editor.state.selection.empty}
        className={`px-3 py-1.5 rounded-lg font-medium transition-all duration-200 ${
          !editor.isActive('highlight') || editor.state.selection.empty
            ? 'text-slate-400 cursor-not-allowed'
            : 'text-slate-600 hover:text-slate-900 hover:bg-ice-100'
        }`}
        title="Remove Highlight"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

export const TextEditor = forwardRef<TextEditorHandle, TextEditorProps>(({ content, onChange, suggestions, onAcceptSuggestion, onRejectSuggestion }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null)
  const [cardPosition, setCardPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const appliedSuggestionsRef = useRef<string>('') // Track applied suggestions to prevent duplicates
  
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3]
        }
      }),
      Highlight,
      Underline,
      Placeholder.configure({
        placeholder: 'Start writing...'
      }),
      SuggestionMark
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[400px] p-4'
      }
    }
  })

  // Add classes to container and setup event delegation
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.classList.add('interactive', 'pointer-events-ready')
    }
  }, [])

  // Use the hover hook
  useSuggestionHover(containerRef as React.RefObject<HTMLElement>)

  // Expose editor methods via ref
  useImperativeHandle(ref, () => ({
    getEditor: () => editor,
    getText: () => editor?.state.doc.textContent || ''
  }), [editor])

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  // Apply suggestion marks when suggestions change
  useEffect(() => {
    if (!editor) return
    
    // If no suggestions, clear any existing marks and reset tracking
    if (!suggestions || suggestions.length === 0) {
      if (appliedSuggestionsRef.current !== '') {
        console.log('[TextEditor] No suggestions, clearing all marks')
        editor.chain()
          .focus()
          .selectAll()
          .unsetMark('suggestion')
          .setTextSelection({ from: 0, to: 0 })
          .run()
        appliedSuggestionsRef.current = ''
      }
      return
    }

    // Create a unique identifier for the current set of suggestions
    const suggestionsKey = suggestions
      .map(s => `${s.id}-${s.startIndex}-${s.endIndex}`)
      .join('|')
    
    // Skip if these suggestions have already been applied
    if (appliedSuggestionsRef.current === suggestionsKey) {
      console.log('[TextEditor] Suggestions already applied, skipping')
      return
    }

    console.log('Applying suggestion marks:', suggestions.length)
    appliedSuggestionsRef.current = suggestionsKey
    
    // Log editor state
    const editorText = editor.state.doc.textContent
    console.log('[TextEditor] Editor state:', {
      totalLength: editorText.length,
      preview: editorText.substring(0, 100) + (editorText.length > 100 ? '...' : ''),
      nodeCount: editor.state.doc.content.childCount
    })

    // Clear existing suggestion marks from the entire document
    editor.chain()
      .focus()
      .selectAll()
      .unsetMark('suggestion')
      .setTextSelection({ from: 0, to: 0 })  // Reset selection
      .run()
      
    // Debug: Check if marks were actually cleared
    let existingMarks = 0
    editor.state.doc.descendants((node) => {
      if (node.marks.length > 0) {
        node.marks.forEach(mark => {
          if (mark.type.name === 'suggestion') {
            existingMarks++
          }
        })
      }
    })
    console.log(`[TextEditor] Existing suggestion marks after clear: ${existingMarks}`)
    
    // If marks still exist, try a more thorough approach
    if (existingMarks > 0) {
      console.log('[TextEditor] Marks still exist after clear, attempting thorough removal...')
      
      // Remove marks from each text node
      const { tr } = editor.state
      editor.state.doc.descendants((node, pos) => {
        if (node.isText && node.marks.length > 0) {
          const hasSuggestionMark = node.marks.some(mark => mark.type.name === 'suggestion')
          if (hasSuggestionMark) {
            tr.removeMark(pos, pos + node.nodeSize, editor.schema.marks.suggestion)
          }
        }
      })
      
      editor.view.dispatch(tr)
      console.log('[TextEditor] Thorough mark removal completed')
    }

    // Apply new suggestion marks
    suggestions.forEach((suggestion, index) => {
      console.log(`[TextEditor] Processing suggestion [${index}]:`, {
        id: suggestion.id,
        originalText: suggestion.originalText,
        charRange: `${suggestion.startIndex}-${suggestion.endIndex}`,
        type: suggestion.type
      })
      
      const position = characterToEditorPosition(editor, suggestion.startIndex, suggestion.endIndex)
      if (!position) {
        console.warn('Could not map position for suggestion:', suggestion.id)
        return
      }
      
      console.log(`[TextEditor] Mapped position:`, {
        from: position.from,
        to: position.to,
        expectedLength: suggestion.originalText.length,
        mappedLength: position.to - position.from
      })

      // Verify the text matches
      const textAtPosition = getTextAtPosition(editor, position.from, position.to)
      if (textAtPosition !== suggestion.originalText) {
        console.warn('Text mismatch for suggestion:', {
          id: suggestion.id,
          expected: suggestion.originalText,
          actual: textAtPosition,
          position
        })
        
        // Try to find the text in the document
        const searchIndex = editorText.indexOf(suggestion.originalText)
        if (searchIndex !== -1) {
          console.log(`[TextEditor] Found text at different position: ${searchIndex} (expected: ${suggestion.startIndex})`)
        }
        
        return
      }
      
      console.log(`[TextEditor] Text verified, applying mark for suggestion [${index}]`)

      // Apply the suggestion mark
      editor.chain()
        .focus()
        .setTextSelection({ from: position.from, to: position.to })
        .setMark('suggestion', {
          suggestionId: suggestion.id,
          suggestionType: suggestion.type
        })
        .run()
        
      console.log(`[TextEditor] Mark applied successfully for suggestion [${index}]`)
    })

    // Reset selection to end of document
    editor.commands.focus('end')
    
    console.log('[TextEditor] All suggestion marks processed')
  }, [suggestions, editor])

  // Handle click on suggestions
  const handleContainerClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    
    // Check if we clicked on a suggestion span
    const suggestionElement = target.closest('[data-suggestion-id]') as HTMLElement
    if (!suggestionElement) {
      // Clicked outside of suggestion, close card if open
      if (selectedSuggestion) {
        setSelectedSuggestion(null)
      }
      return
    }

    const suggestionId = suggestionElement.getAttribute('data-suggestion-id')
    if (!suggestionId || !suggestions) return

    // Find the suggestion
    const suggestion = suggestions.find(s => s.id === suggestionId)
    if (!suggestion) {
      console.warn('Suggestion not found:', suggestionId)
      return
    }

    // Calculate position for the card
    const rect = suggestionElement.getBoundingClientRect()
    setCardPosition({
      x: rect.left,
      y: rect.bottom + 5 // Position below the text
    })
    setSelectedSuggestion(suggestion)
  }

  // Handle accept/reject
  const handleAcceptSuggestion = () => {
    if (!selectedSuggestion || !editor) return

    console.log('[TextEditor] Accepting suggestion:', {
      id: selectedSuggestion.id,
      originalText: selectedSuggestion.originalText,
      suggestionText: selectedSuggestion.suggestionText,
      range: `${selectedSuggestion.startIndex}-${selectedSuggestion.endIndex}`
    })

    // Find the position of the suggestion
    const position = characterToEditorPosition(
      editor,
      selectedSuggestion.startIndex,
      selectedSuggestion.endIndex
    )
    if (!position) {
      console.error('[TextEditor] Could not find position for accepted suggestion')
      return
    }
    
    console.log('[TextEditor] Replacing text at positions:', position)

    // First, remove the suggestion mark from the selected range
    // Use a transaction to ensure the mark is removed
    const { tr } = editor.state
    tr.removeMark(position.from, position.to, editor.schema.marks.suggestion)
    editor.view.dispatch(tr)
      
    console.log('[TextEditor] Mark removed from selection using transaction')

    // Then replace the text
    editor.chain()
      .focus()
      .setTextSelection({ from: position.from, to: position.to })
      .insertContent(selectedSuggestion.suggestionText)
      .run()
      
    console.log('[TextEditor] Text replaced')
    
    // Force update the applied suggestions tracking to trigger re-analysis
    appliedSuggestionsRef.current = ''

    // Call the parent's accept handler
    onAcceptSuggestion?.(selectedSuggestion.id)
    
    // Close the card
    setSelectedSuggestion(null)
  }

  const handleRejectSuggestion = () => {
    if (!selectedSuggestion || !editor) return

    console.log('[TextEditor] Rejecting suggestion:', {
      id: selectedSuggestion.id,
      originalText: selectedSuggestion.originalText,
      range: `${selectedSuggestion.startIndex}-${selectedSuggestion.endIndex}`
    })

    // Find the position of the suggestion
    const position = characterToEditorPosition(
      editor,
      selectedSuggestion.startIndex,
      selectedSuggestion.endIndex
    )
    if (!position) {
      console.error('[TextEditor] Could not find position for rejected suggestion')
      return
    }
    
    console.log('[TextEditor] Removing mark at positions:', position)

    // Remove the mark
    editor.chain()
      .focus()
      .setTextSelection({ from: position.from, to: position.to })
      .unsetMark('suggestion')
      .run()
      
    console.log('[TextEditor] Mark removed')
    
    // Force update the applied suggestions tracking
    appliedSuggestionsRef.current = ''

    // Call the parent's reject handler
    onRejectSuggestion?.(selectedSuggestion.id)
    
    // Close the card
    setSelectedSuggestion(null)
  }

  if (!editor) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <LoadingSpinner size="xl" />
          <p className="mt-4 text-slate-600">Loading editor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <Toolbar editor={editor} />
      <div ref={containerRef} className="p-6" onClick={handleContainerClick}>
        <EditorContent editor={editor} className="prose prose-lg max-w-none" />
      </div>
      
      {/* Render SuggestionCard when a suggestion is selected */}
      {selectedSuggestion && (
        <SuggestionCard
          suggestion={selectedSuggestion}
          position={cardPosition}
          onAccept={handleAcceptSuggestion}
          onReject={handleRejectSuggestion}
          onClose={() => setSelectedSuggestion(null)}
        />
      )}
    </div>
  )
})

TextEditor.displayName = 'TextEditor' 