import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect } from 'react'

interface TextEditorProps {
  content: string
  onChange: (content: string) => void
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

      {/* Highlight */}
      <button
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className={`px-3 py-1.5 rounded-lg font-medium transition-all duration-200 ${
          editor.isActive('highlight')
            ? 'bg-slate-900 text-white'
            : 'text-slate-600 hover:text-slate-900 hover:bg-ice-100'
        }`}
        title="Highlight"
      >
        <span className="bg-yellow-300 px-1">H</span>
      </button>
    </div>
  )
}

export function TextEditor({ content, onChange }: TextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight.configure({
        multicolor: true,
      }),
      Underline,
      Placeholder.configure({
        placeholder: 'Type your content here...',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange(html)
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg prose-slate max-w-none focus:outline-none min-h-[400px] [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:mb-4 [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:mb-3 [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:mb-2 [&_p]:text-base [&_p]:mb-4',
      },
    },
  })

  // Update editor content when prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  if (!editor) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400">Loading editor...</div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <Toolbar editor={editor} />
      <div className="p-6">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
} 