import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect, useRef, useImperativeHandle, forwardRef, useState } from 'react'
import { LoadingSpinner } from '../common/LoadingSpinner'
import { SuggestionMark } from './SuggestionMark'
import { useSuggestionHover } from '../../hooks/useSuggestionHover'

interface TextEditorProps {
  content: string
  onChange: (content: string) => void
}

export interface TextEditorHandle {
  getEditor: () => ReturnType<typeof useEditor>
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

export const TextEditor = forwardRef<TextEditorHandle, TextEditorProps>(({ content, onChange }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  
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
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
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
  const hoverControls = useSuggestionHover(containerRef)

  // Expose editor methods via ref
  useImperativeHandle(ref, () => ({
    getEditor: () => editor
  }), [editor])

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

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
      <div ref={containerRef} className="p-6">
        <EditorContent editor={editor} className="prose prose-lg max-w-none" />
      </div>
    </div>
  )
})

TextEditor.displayName = 'TextEditor' 