import { useState, useRef, useEffect } from 'react'
import { useDocumentStore } from '../../store/documentStore'

export function DocumentTitle() {
  const { currentDocument, updateDocumentDebounced } = useDocumentStore()
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(currentDocument?.title || '')
  const inputRef = useRef<HTMLInputElement>(null)

  // Update local title when document changes
  useEffect(() => {
    setTitle(currentDocument?.title || '')
  }, [currentDocument])

  const handleStartEdit = () => {
    setIsEditing(true)
    // Focus input after render
    setTimeout(() => {
      inputRef.current?.focus()
      inputRef.current?.select()
    }, 0)
  }

  const handleSave = () => {
    const trimmedTitle = title.trim()
    if (trimmedTitle && trimmedTitle !== currentDocument?.title) {
      updateDocumentDebounced({ title: trimmedTitle })
    } else {
      // Revert to original if empty
      setTitle(currentDocument?.title || 'Untitled Document')
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      setTitle(currentDocument?.title || 'Untitled Document')
      setIsEditing(false)
    }
  }

  if (!currentDocument) return null

  return (
    <div className="flex items-center">
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="text-xl font-semibold text-slate-800 bg-transparent border-b-2 border-blue-500 outline-none px-1"
          placeholder="Document title"
        />
      ) : (
        <h2
          onClick={handleStartEdit}
          className="text-xl font-semibold text-slate-800 cursor-pointer hover:text-slate-600 transition-colors duration-200 group flex items-center"
          title="Click to edit title"
        >
          {currentDocument.title}
          <svg 
            className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </h2>
      )}
    </div>
  )
} 