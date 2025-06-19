import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignupPage'
import { EditorPage } from './pages/EditorPage'
import { SettingsPage } from './pages/SettingsPage'
import { DashboardPage } from './pages/DashboardPage'
import { ProtectedRoute } from './components/common/ProtectedRoute'
import { useAuthStore } from './store/authStore'
import { useEffect } from 'react'

function AuthRedirect() {
  const { user, loading, checkUser } = useAuthStore()

  useEffect(() => {
    checkUser()
  }, [checkUser])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  return user ? <Navigate to="/editor" replace /> : <Navigate to="/login" replace />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
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
