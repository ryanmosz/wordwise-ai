import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useDocumentStore } from '../store/documentStore'
import { supabase } from '../services/supabase'
import { formatDistanceToNow } from 'date-fns'
import { LoadingSpinner } from '../components/common/LoadingSpinner'

export function DocumentsPage() {
  const navigate = useNavigate()
  const { signOut } = useAuthStore()
  const { documents, loadDocuments, loadDocument, createNewDocument, deleteDocument, updateDocument } = useDocumentStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [editingDocumentId, setEditingDocumentId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [savingDocumentId, setSavingDocumentId] = useState<string | null>(null)
  const [deletingDocumentId, setDeletingDocumentId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  useEffect(() => {
    const initializeDocuments = async () => {
      setIsLoading(true)
      await loadDocuments()
      
      // Check if this is a new user (no documents)
      const { documents } = useDocumentStore.getState()
      if (documents.length === 0) {
        // Create sample document for new users
        await createSampleDocument()
        await loadDocuments() // Reload to show the sample document
      }
      
      setIsLoading(false)
    }
    
    initializeDocuments()
  }, [loadDocuments])

  const createSampleDocument = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const sampleContent = `<h1>Welcome to WordWise AI - Your Writing Assistant</h1>
<p>This is a sample document to help you get started with WordWise AI. As you can see, their are several grammatical and spelling errors in this document that WordWise AI will help you fix.</p>
<p>Lets explore some common writing mistakes:</p>
<h2>Grammar and Spelling</h2>
<p>Its important to use proper grammer and spelling in you're writing. Many people confuse "your" and "you're" or "its" and "it's". These are common mistakes that effects the credibility of your writing.</p>
<h2>Punctuation Errors</h2>
<p>Proper punctuation is also crucial Have you ever read a sentence without proper punctuation it can be very confusing to understand what the writer is trying to say</p>
<p>Heres another example: using to many commas, or not using them, when they are needed, can make, your writing, hard to read.</p>
<h2>Conciseness and Clarity</h2>
<p>Being concise is very extremely important in order to communicate your ideas in a way that is clear and easy for readers to understand what you are trying to say without using too many unnecessary words that don't add value to your message.</p>
<p>Start editing this document to see how WordWise AI can help improve your writing!</p>`

    try {
      const { error } = await supabase
        .from('documents')
        .insert([{
          title: 'Welcome to WordWise - Sample Document',
          content: sampleContent,
          user_id: user.id
        }])
      
      if (error) throw error
      console.log('Sample document created for new user')
    } catch (error) {
      console.error('Failed to create sample document:', error)
    }
  }

  const handleDocumentClick = async (documentId: string) => {
    await loadDocument(documentId)
    navigate('/editor')
  }

  const handleDeleteDocument = async (e: React.MouseEvent, documentId: string) => {
    e.stopPropagation()
    
    // First click shows confirmation, second click deletes
    if (confirmDeleteId === documentId) {
      setDeletingDocumentId(documentId)
      try {
        await deleteDocument(documentId)
        await loadDocuments() // Refresh the list
      } finally {
        setDeletingDocumentId(null)
        setConfirmDeleteId(null)
      }
    } else {
      // Show confirmation
      setConfirmDeleteId(documentId)
      // Auto-hide confirmation after 3 seconds
      setTimeout(() => {
        setConfirmDeleteId(null)
      }, 3000)
    }
  }

  const handleNewDocument = () => {
    createNewDocument()
    navigate('/editor')
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const handleRenameDocument = async (e: React.MouseEvent, documentId: string, currentTitle: string) => {
    e.stopPropagation()
    setEditingDocumentId(documentId)
    setEditingTitle(currentTitle)
  }

  const handleSaveRename = async (documentId: string) => {
    const trimmedTitle = editingTitle.trim()
    if (trimmedTitle) {
      setSavingDocumentId(documentId)
      try {
        await updateDocument({ id: documentId, title: trimmedTitle })
        await loadDocuments() // Refresh to show updated title
      } finally {
        setSavingDocumentId(null)
      }
    }
    setEditingDocumentId(null)
    setEditingTitle('')
  }

  const handleCancelRename = () => {
    setEditingDocumentId(null)
    setEditingTitle('')
  }

  const handleKeyDown = (e: React.KeyboardEvent, documentId: string) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSaveRename(documentId)
    } else if (e.key === 'Escape') {
      handleCancelRename()
    }
  }

  // Filter documents based on search query
  const filteredDocuments = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Extract text preview from HTML content
  const getPreviewText = (htmlContent: string) => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlContent, 'text/html')
    const text = doc.body.textContent || ''
    return text.length > 150 ? text.substring(0, 150) + '...' : text
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-200 via-slate-100 to-white flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="xl" />
          <p className="mt-4 text-slate-600">Loading documents...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-200 via-slate-100 to-white">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
            WordWise AI
          </h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleSignOut}
              className="text-slate-600 hover:text-slate-900 hover:bg-ice-100 px-3 py-1.5 rounded-lg font-medium transition-all duration-200"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-6">Documents</h2>
          
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <button
              onClick={handleNewDocument}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New document
            </button>
            
            <div className="flex-1 max-w-md">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Documents Grid */}
          {filteredDocuments.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-24 h-24 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">
                {searchQuery ? 'No documents found' : 'No documents yet'}
              </h3>
              <p className="text-slate-500 mb-6">
                {searchQuery ? 'Try a different search term' : 'Create your first document to get started'}
              </p>
              {!searchQuery && (
                <button
                  onClick={handleNewDocument}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create your first document
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocuments.map((document) => (
                <div
                  key={document.id}
                  onClick={() => handleDocumentClick(document.id)}
                  className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-lg hover:border-slate-300 transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-3">
                    {editingDocumentId === document.id ? (
                      <div className="flex-1 flex items-center">
                        <input
                          type="text"
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, document.id)}
                          onBlur={() => handleSaveRename(document.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="flex-1 text-lg font-semibold text-slate-800 bg-transparent border-b-2 border-blue-500 outline-none"
                          autoFocus
                          disabled={savingDocumentId === document.id}
                        />
                        {savingDocumentId === document.id && (
                          <div className="ml-2">
                            <svg className="animate-spin h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          </div>
                        )}
                      </div>
                    ) : (
                      <h3 className="text-lg font-semibold text-slate-800 line-clamp-1 flex-1">
                        {document.title}
                      </h3>
                    )}
                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-all duration-200 ml-2">
                      {editingDocumentId !== document.id && (
                        <button
                          onClick={(e) => handleRenameDocument(e, document.id, document.title)}
                          className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                          title="Rename document"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      )}
                      {confirmDeleteId === document.id ? (
                        <div className="flex items-center bg-red-50 rounded px-2 py-1 ml-1">
                          <span className="text-xs text-red-600 mr-2">Delete?</span>
                          <button
                            onClick={(e) => handleDeleteDocument(e, document.id)}
                            className="p-0.5 text-red-600 hover:text-red-700"
                            title="Confirm delete"
                          >
                            {deletingDocumentId === document.id ? (
                              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setConfirmDeleteId(null)
                            }}
                            className="p-0.5 text-slate-400 hover:text-slate-600 ml-1"
                            title="Cancel"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => handleDeleteDocument(e, document.id)}
                          className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                          title="Delete document"
                          disabled={deletingDocumentId === document.id}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-600 mb-4 line-clamp-3">
                    {getPreviewText(document.content)}
                  </p>
                  
                  <div className="flex items-center text-xs text-slate-500">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {formatDistanceToNow(new Date(document.updated_at), { addSuffix: true })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
} 