import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export function EditorPage() {
  // Visual reference: docs/screenshots/editor-layout-v1.png
  // Hover effects use ice-100 (#d9f0ff) with text-slate-900
  const navigate = useNavigate()
  const { signOut } = useAuthStore()
  const [documentTitle, setDocumentTitle] = useState('Untitled Document')
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved')
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)

  // Add console log for debugging
  console.log('EditorPage mounted - Layout verification')

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
                <span className="font-medium">{documentTitle}</span>
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
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 text-lg">
                  Type your content here...
                </p>
                <p className="text-slate-600 text-base mt-4">
                  This editor area is centered with a maximum width to provide optimal reading experience. 
                  The content will expand as you type, maintaining proper spacing and typography.
                </p>
              </div>
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