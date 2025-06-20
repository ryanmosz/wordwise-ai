import { useState, useRef, useEffect } from 'react'
import { useDocumentStore } from '../../store/documentStore'

export function DocumentSelector() {
  const [isOpen, setIsOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingTitle, setEditingTitle] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  const { 
    currentDocument, 
    documents, 
    loadDocument, 
    createNewDocument,
    deleteDocument,
    updateDocument 
  } = useDocumentStore()

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleDocumentSelect = async (documentId: string) => {
    await loadDocument(documentId)
    setIsOpen(false)
  }

  const handleNewDocument = async () => {
    createNewDocument()
    setIsOpen(false)
  }

  const handleDeleteDocument = async (e: React.MouseEvent, documentId: string) => {
    e.stopPropagation() // Prevent document selection
    
    if (confirmDeleteId === documentId) {
      // Confirmed - proceed with delete
      await deleteDocument(documentId)
      
      // If we deleted the current document, load another one or create new
      if (currentDocument?.id === documentId) {
        if (documents.length > 1) {
          const remainingDocs = documents.filter(d => d.id !== documentId)
          if (remainingDocs.length > 0) {
            await loadDocument(remainingDocs[0].id)
          }
        } else {
          createNewDocument() // Create in memory only
        }
      }
      setConfirmDeleteId(null)
    } else {
      // Show confirmation
      setConfirmDeleteId(documentId)
      // Auto-hide after 3 seconds
      setTimeout(() => {
        setConfirmDeleteId(null)
      }, 3000)
    }
  }

  const handleTitleClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent dropdown from opening
    if (currentDocument) {
      setIsEditing(true)
      setEditingTitle(currentDocument.title)
      // Focus input after state update
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }

  const handleTitleSave = async () => {
    if (currentDocument && editingTitle.trim()) {
      setIsSaving(true)
      try {
        await updateDocument({ 
          title: editingTitle.trim() 
        })
      } finally {
        setIsSaving(false)
      }
    }
    setIsEditing(false)
  }

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleTitleSave()
    } else if (e.key === 'Escape') {
      setIsEditing(false)
      setEditingTitle('')
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex items-center">
        {isEditing ? (
          <div className="flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={editingTitle}
              onChange={(e) => setEditingTitle(e.target.value)}
              onBlur={handleTitleSave}
              onKeyDown={handleTitleKeyDown}
              className="font-medium text-slate-800 bg-transparent border-b-2 border-blue-500 outline-none px-1 mr-2"
              onClick={(e) => e.stopPropagation()}
              disabled={isSaving}
            />
            {isSaving && (
              <svg className="animate-spin h-4 w-4 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
          </div>
        ) : (
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center space-x-2 text-slate-800 hover:text-slate-900 hover:bg-ice-100 px-3 py-1 rounded-lg cursor-pointer transition-all duration-200 group"
          >
            <span 
              className="font-medium hover:text-blue-600"
              onClick={handleTitleClick}
              title="Click to edit title"
            >
              {currentDocument?.title || 'Untitled Document'}
            </span>
            <svg 
              className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50">
          {/* New Document Option */}
          <button
            onClick={handleNewDocument}
            className="w-full px-4 py-2 text-left text-slate-700 hover:bg-ice-100 hover:text-slate-900 transition-colors duration-200 flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>New Document</span>
          </button>

          {/* Divider */}
          <div className="my-2 border-t border-slate-200"></div>

          {/* Document List */}
          <div className="max-h-96 overflow-y-auto">
            {documents.map((doc) => (
              <div
                key={doc.id}
                onClick={() => handleDocumentSelect(doc.id)}
                className={`w-full px-4 py-2 text-left text-slate-700 hover:bg-ice-100 hover:text-slate-900 transition-colors duration-200 cursor-pointer flex items-center justify-between group ${
                  currentDocument?.id === doc.id ? 'bg-slate-100' : ''
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{doc.title}</div>
                  <div className="text-xs text-slate-500">
                    {new Date(doc.updated_at).toLocaleDateString()}
                  </div>
                </div>
                
                {/* Delete button - only show for non-current documents or if there's more than one */}
                {(currentDocument?.id !== doc.id || documents.length > 1) && (
                  confirmDeleteId === doc.id ? (
                    <div className="flex items-center bg-red-50 rounded px-2 py-0.5">
                      <span className="text-xs text-red-600 mr-1">Delete?</span>
                      <button
                        onClick={(e) => handleDeleteDocument(e, doc.id)}
                        className="p-0.5 text-red-600 hover:text-red-700"
                        title="Confirm"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setConfirmDeleteId(null)
                        }}
                        className="p-0.5 text-slate-400 hover:text-slate-600"
                        title="Cancel"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => handleDeleteDocument(e, doc.id)}
                      className="opacity-0 group-hover:opacity-100 ml-2 p-1 text-slate-400 hover:text-red-600 transition-all duration-200"
                      title="Delete document"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )
                )}
              </div>
            ))}
          </div>

          {/* Empty state */}
          {documents.length === 0 && (
            <div className="px-4 py-8 text-center text-slate-500">
              No documents yet. Create your first one!
            </div>
          )}
        </div>
      )}
    </div>
  )
} 