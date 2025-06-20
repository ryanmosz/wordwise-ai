import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useDocumentStore } from '../store/documentStore'
import { TextEditor } from '../components/editor/TextEditor'

export function EditorPage() {
  // Visual reference: docs/screenshots/editor-layout-v1.png
  // Hover effects use ice-100 (#d9f0ff) with text-slate-900
  const navigate = useNavigate()
  const { signOut } = useAuthStore()
  const { 
    currentDocument, 
    documents,
    saveStatus, 
    loadDocuments, 
    loadDocument,
    createDocument,
    updateDocumentDebounced 
  } = useDocumentStore()
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const [isInitialized, setIsInitialized] = useState(false)

  // Add console log for debugging
  console.log('EditorPage mounted - Layout verification')

  // Load documents on mount
  useEffect(() => {
    const initializeDocuments = async () => {
      if (isInitialized) {
        console.log('[Editor] Already initialized, skipping document load')
        return
      }
      
      console.log('[Editor] Starting document initialization...')
      await loadDocuments()
      console.log('[Editor] loadDocuments completed')
      setIsInitialized(true)
    }
    initializeDocuments()
  }, [loadDocuments, isInitialized])

  // Handle document selection after documents are loaded
  useEffect(() => {
    if (!isInitialized) {
      console.log('[Editor] Not initialized yet, skipping document selection')
      return
    }
    
    console.log('[Editor] Document selection effect triggered')
    console.log('[Editor] Current state:', {
      documentsCount: documents.length,
      hasCurrentDocument: !!currentDocument,
      currentDocumentId: currentDocument?.id,
      documentsIds: documents.map(d => d.id)
    })
    
    const selectDocument = async () => {
      // If we have documents but no current document, load the most recent one
      if (documents.length > 0 && !currentDocument) {
        // Check if we have a last edited document ID in localStorage
        const lastDocumentId = localStorage.getItem('lastDocumentId')
        console.log('[Editor] Last document ID from localStorage:', lastDocumentId)
        console.log('[Editor] Available documents:', documents.map(d => ({ id: d.id, title: d.title })))
        
        // Try to find the last edited document in the current documents list
        const lastDocument = lastDocumentId 
          ? documents.find(doc => doc.id === lastDocumentId)
          : null
        
        if (lastDocument) {
          console.log('[Editor] Found last edited document, loading:', lastDocument.id)
          await loadDocument(lastDocument.id)
        } else if (documents.length > 0) {
          // Fall back to the most recent document
          console.log('[Editor] Last document not found, loading most recent:', documents[0].id)
          await loadDocument(documents[0].id)
        }
      } 
      // If no documents exist at all, create a new one
      else if (documents.length === 0 && !currentDocument) {
        console.log('[Editor] No documents found, creating new one...')
        await createDocument()
      } else {
        console.log('[Editor] Document already loaded or being loaded, skipping selection')
      }
    }
    selectDocument()
  }, [documents, currentDocument, loadDocument, createDocument, isInitialized])

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const handleSettings = () => {
    navigate('/settings')
  }

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export clicked')
  }

  const handleContentChange = (newContent: string) => {
    // Calculate word and character count
    const parser = new DOMParser()
    const doc = parser.parseFromString(newContent, 'text/html')
    
    // Get text content but preserve line breaks between block elements
    const blocks = doc.body.querySelectorAll('p, h1, h2, h3, h4, h5, h6, div, li')
    let text = ''
    
    if (blocks.length > 0) {
      // Extract text from each block element and join with spaces
      const textArray = Array.from(blocks).map(block => (block.textContent || '').trim())
      text = textArray.filter(t => t.length > 0).join(' ')
    } else {
      // Fallback for inline content
      text = doc.body.textContent || ''
    }
    
    // Better word counting - split by any whitespace and filter out empty strings
    const words = text.trim().split(/\s+/).filter(word => word.length > 0)
    const wordCount = text.trim() === '' ? 0 : words.length
    
    setWordCount(wordCount)
    setCharCount(text.length)
    
    // Auto-save the content with debounce
    updateDocumentDebounced({ content: newContent })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-200 via-slate-100 to-white flex flex-col">
      {/* Header Bar */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
            WordWise AI
          </h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleSettings}
              className="text-slate-600 hover:text-slate-900 hover:bg-ice-100 px-3 py-1.5 rounded-lg font-medium transition-all duration-200"
            >
              Settings
            </button>
            <button
              onClick={handleExport}
              className="text-slate-600 hover:text-slate-900 hover:bg-ice-100 px-3 py-1.5 rounded-lg font-medium transition-all duration-200"
            >
              Export
            </button>
            <button
              onClick={handleSignOut}
              className="text-slate-600 hover:text-slate-900 hover:bg-ice-100 px-3 py-1.5 rounded-lg font-medium transition-all duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Document Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="flex items-center space-x-2 text-slate-800 hover:text-slate-900 hover:bg-ice-100 px-3 py-1 rounded-lg cursor-pointer transition-all duration-200">
                <span className="font-medium">{currentDocument?.title || 'Untitled Document'}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`text-sm font-medium ${
              saveStatus === 'saved' ? 'text-green-600' : 
              saveStatus === 'saving' ? 'text-blue-600' : 
              'text-red-600'
            }`}>
              {saveStatus === 'saved' ? 'Saved' : 
               saveStatus === 'saving' ? 'Saving...' : 
               'Error saving'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Section (2/3 width) */}
        <div className="flex-1 flex flex-col bg-white">
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
              <TextEditor content={currentDocument?.content || ''} onChange={handleContentChange} />
            </div>
          </div>
        </div>

        {/* Suggestions Panel (1/3 width) */}
        <aside className="w-80 bg-slate-50 border-l border-slate-200 flex flex-col">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800">Suggestions</h2>
          </div>
          <div className="flex-1 p-6 overflow-y-auto">
            <p className="text-slate-400 text-center">
              No suggestions yet
            </p>
          </div>
        </aside>
      </div>

      {/* Footer Bar */}
      <footer className="bg-white border-t border-slate-200 px-6 py-3">
        <div className="flex items-center justify-between text-sm text-slate-600">
          <div className="flex items-center space-x-6">
            <span>Words: {wordCount}</span>
            <span>Characters: {charCount}</span>
            <span>Readability: N/A</span>
          </div>
        </div>
      </footer>
    </div>
  )
} 