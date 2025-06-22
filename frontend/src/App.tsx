import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignupPage'
import { DocumentsPage } from './pages/DocumentsPage'
import { EditorPage } from './pages/EditorPage'
import { SettingsPage } from './pages/SettingsPage'
import { DashboardPage } from './pages/DashboardPage'
import { TestSuggestionHighlight } from './pages/TestSuggestionHighlight'
import { TestSuggestionColors } from './pages/TestSuggestionColors'
import { TestSuggestionMark } from './pages/TestSuggestionMark'
import { TestHoverDebug } from './pages/TestHoverDebug'
import { TestUseSuggestions } from './pages/TestUseSuggestions'
import { TestUseSuggestionsEnhanced } from './pages/TestUseSuggestionsEnhanced'
import TestSuggestionStateManagement from './pages/TestSuggestionStateManagement'
import { TestAcceptReject } from './pages/TestAcceptReject'
import { TestAIService } from './pages/TestAIService'
import { ProtectedRoute } from './components/common/ProtectedRoute'
import { LoadingSpinner } from './components/common/LoadingSpinner'
import { useAuthStore } from './store/authStore'
import { useEffect } from 'react'
import { supabase } from './services/supabase'
import { TestDebounce } from './pages/TestDebounce'

function AuthRedirect() {
  const { user, loading, checkUser } = useAuthStore()

  useEffect(() => {
    checkUser()
  }, [checkUser])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="xl" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return user ? <Navigate to="/documents" replace /> : <Navigate to="/login" replace />
}

function App() {
  const { checkUser, loading } = useAuthStore()

  useEffect(() => {
    // Check user on mount
    checkUser()

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('[Auth] Auth state changed:', _event)
      if (session) {
        checkUser()
      } else {
        // User logged out
        useAuthStore.setState({ user: null, loading: false })
      }
    })

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe()
    }
  }, [checkUser])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="xl" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/test-suggestion" element={<TestSuggestionHighlight />} />
        <Route path="/test-colors" element={<TestSuggestionColors />} />
        <Route path="/test-marks" element={<TestSuggestionMark />} />
        <Route path="/test-hover" element={<TestHoverDebug />} />
        <Route path="/test-use-suggestions" element={<TestUseSuggestions />} />
        <Route path="/test-use-suggestions-enhanced" element={<TestUseSuggestionsEnhanced />} />
        <Route path="/test-suggestion-state" element={<TestSuggestionStateManagement />} />
        <Route path="/test-accept-reject" element={<TestAcceptReject />} />
        <Route path="/test-ai-service" element={<TestAIService />} />
        <Route path="/test-debounce" element={<TestDebounce />} />
        <Route 
          path="/documents" 
          element={
            <ProtectedRoute>
              <DocumentsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/editor" 
          element={
            <ProtectedRoute>
              <EditorPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
        <Route path="/" element={<AuthRedirect />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
