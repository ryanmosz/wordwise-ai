import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useDocumentStore } from '../store/documentStore'
import { TextEditor, type TextEditorRef } from '../components/editor/TextEditor'
import { DocumentSelector } from '../components/editor/DocumentSelector'
import { LoadingSpinner } from '../components/common/LoadingSpinner'
import { analyzeText, type Suggestion } from '../services/aiService'

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
    updateDocumentDebounced,
    cleanupEmptyDocuments
  } = useDocumentStore()
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isLoadingDocument, setIsLoadingDocument] = useState(true)
  
  // Demo states for AI analysis
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [selectedText, setSelectedText] = useState<string>('')
  const [completeRewrite, setCompleteRewrite] = useState<string>('')

  // Ref to access TextEditor methods
  const textEditorRef = useRef<TextEditorRef>(null)

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
      
      // Clean up any existing empty documents
      await cleanupEmptyDocuments()
      console.log('[Editor] Cleanup completed')
      
      setIsInitialized(true)
    }
    initializeDocuments()
  }, [loadDocuments, cleanupEmptyDocuments, isInitialized])

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
      setIsLoadingDocument(true)
      
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
      // Don't auto-create documents anymore - let user decide
      else {
        console.log('[Editor] No documents found, showing empty state')
      }
      
      setIsLoadingDocument(false)
    }
    selectDocument()
  }, [documents, currentDocument, loadDocument, isInitialized])

  // Cleanup empty documents on unmount
  useEffect(() => {
    return () => {
      // If we're leaving with an unsaved new document that has no content, don't save it
      const state = useDocumentStore.getState()
      if (state.isNewDocument && !state.hasContentOrTitle(state.currentDocument)) {
        console.log('[Editor] Leaving with empty new document, not saving')
      }
    }
  }, [])

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

  // Demo handler for AI analysis
  const handleAnalyze = async () => {
    console.log('[Demo] Analyze with AI clicked')
    
    // Get selected text from editor
    const text = textEditorRef.current?.getSelectedText() || ''
    
    if (!text) {
      alert('Please select some text first')
      return
    }
    
    console.log('[Demo] Selected text for analysis:', text)
    setSelectedText(text) // Store the selected text
    setIsAnalyzing(true)
    
    try {
      // Make both API calls in parallel
      console.log('[Demo] Starting parallel API calls...')
      
      const suggestionsResult = await analyzeText(text)
      
      // Handle suggestions result
      console.log('[Demo] Suggestions received:', suggestionsResult)
      console.log('[Demo] Raw suggestions array:', suggestionsResult.suggestions)
      console.log('[Demo] Number of suggestions:', suggestionsResult.suggestions?.length || 0)
      setSuggestions(suggestionsResult.suggestions || [])
      setIsAnalyzing(false)
      
      // For complete rewrite, look for a readability suggestion or build from corrections
      const suggestions = suggestionsResult.suggestions || []
      let rewrite = text
      
      // First, check if there's a readability suggestion that covers the whole text
      const fullRewrite = suggestions.find(s => 
        s.type === 'readability' && 
        s.originalText.trim() === text.trim()
      )
      
      if (fullRewrite) {
        console.log('[Demo] Found readability suggestion for complete rewrite:', fullRewrite.suggestionText)
        rewrite = fullRewrite.suggestionText
      } else {
        console.log('[Demo] No readability suggestion found, applying individual corrections')
        // Apply simple replacements based on suggestions
        suggestions.forEach(suggestion => {
          if (rewrite.includes(suggestion.originalText)) {
            rewrite = rewrite.replace(suggestion.originalText, suggestion.suggestionText)
          }
        })
      }
      
      console.log('[Demo] Complete rewrite:', rewrite)
      setCompleteRewrite(rewrite)
      
    } catch (error) {
      console.error('[Demo] Analysis failed:', error)
      alert('Failed to analyze text. Please try again.')
      setIsAnalyzing(false)
    }
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

  // Show loading spinner while initializing
  if (!isInitialized || isLoadingDocument) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-200 via-slate-100 to-white flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="xl" />
          <p className="mt-4 text-slate-600">Loading editor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-200 via-slate-100 to-white flex flex-col">
      {/* Header Bar */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/documents')}
              className="text-slate-600 hover:text-slate-900 hover:bg-ice-100 px-3 py-1.5 rounded-lg font-medium transition-all duration-200 flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Documents
            </button>
            <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
              WordWise AI
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze with AI'}
            </button>
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
          <DocumentSelector />
          <div className="flex items-center space-x-2">
            {saveStatus === 'saving' ? (
              <svg className="animate-spin h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : saveStatus === 'saved' ? (
              <span className="text-sm font-medium text-green-600">Saved</span>
            ) : (
              <span className="text-sm font-medium text-red-600">Error saving</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Section (2/3 width) */}
        <div className="flex-1 flex flex-col bg-white">
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
              {currentDocument ? (
                <TextEditor 
                  ref={textEditorRef}
                  content={currentDocument.content || ''} 
                  onChange={handleContentChange} 
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="mb-8">
                    <svg className="w-24 h-24 mx-auto text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-semibold text-slate-700 mb-2">
                    {documents.length === 0 ? 'Welcome to WordWise AI' : 'Select a Document'}
                  </h2>
                  <p className="text-slate-500 mb-6 max-w-md">
                    {documents.length === 0 
                      ? 'Start creating amazing marketing copy with AI-powered suggestions.'
                      : 'Choose a document from the dropdown above or create a new one.'}
                  </p>
                  <button
                    onClick={() => {
                      const { createNewDocument } = useDocumentStore.getState()
                      createNewDocument()
                    }}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create New Document
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Suggestions Panel (1/3 width) */}
        <aside className="w-80 bg-slate-50 border-l border-slate-200 flex flex-col">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800">Suggestions</h2>
          </div>
          <div className="flex-1 p-6 overflow-y-auto">
            {isAnalyzing ? (
              <div className="text-center">
                <LoadingSpinner size="md" />
                <p className="mt-4 text-slate-600">Analyzing your text...</p>
              </div>
            ) : suggestions.length > 0 ? (
              <div className="space-y-3">
                {suggestions.map((suggestion, index) => (
                  <div key={index} className="p-3 border border-slate-200 rounded-lg bg-white">
                    <div className="font-semibold text-sm text-blue-600 uppercase">
                      {suggestion.type}
                    </div>
                    <div className="text-sm mt-1">
                      <span className="line-through text-red-600">
                        {suggestion.originalText}
                      </span>
                      {' → '}
                      <span className="text-green-600">
                        {suggestion.suggestionText}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 mt-2">
                      {suggestion.explanation}
                    </div>
                    {suggestion.confidence && (
                      <div className="text-xs text-slate-500 mt-1">
                        Confidence: {(suggestion.confidence * 100).toFixed(0)}%
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Complete Rewrite Suggestion */}
                {suggestions.length > 0 && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">✨ Complete Rewrite</h3>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Original:</p>
                        <p className="text-gray-800 italic">{selectedText}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Suggested Rewrite:</p>
                        <p className="text-green-700 font-medium">
                          {completeRewrite || selectedText}
                        </p>
                      </div>
                      <p className="text-xs text-blue-700 mt-2">
                        This combines all the suggested improvements into a single, polished version.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : selectedText ? (
              // We've analyzed text but found no suggestions
              <div className="text-center">
                <div className="mb-4">
                  <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-slate-600 font-medium">Perfect! No improvements needed.</p>
                <p className="text-slate-500 text-sm mt-2">Your text is already well-written.</p>
              </div>
            ) : (
              // Haven't analyzed anything yet
              <p className="text-slate-400 text-center">
                No suggestions yet
              </p>
            )}
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