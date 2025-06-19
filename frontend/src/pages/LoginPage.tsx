import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { AuthForm } from '../components/auth/AuthForm'

export function LoginPage() {
  const [error, setError] = useState('')
  const [isTestLoading, setIsTestLoading] = useState(false)
  const { signIn } = useAuthStore()
  const navigate = useNavigate()

  const handleLogin = async (data: { email: string; password: string }) => {
    setError('')
    try {
      await signIn(data.email, data.password)
      navigate('/editor')
    } catch (err: any) {
      setError(err.message || 'Login failed')
      throw err // Re-throw so AuthForm can handle loading state
    }
  }

  const handleTestLogin = async () => {
    setError('')
    setIsTestLoading(true)

    try {
      await signIn('test@wordwise.ai', 'testpass123')
      navigate('/editor')
    } catch (err: any) {
      setError(err.message || 'Test login failed')
    } finally {
      setIsTestLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-sm w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-extrabold text-slate-800 mb-3 tracking-tight">
            WordWise AI
          </h1>
          <p className="text-slate-600 text-lg font-medium">
            Your AI-powered marketing copy assistant
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          <AuthForm
            mode="login"
            onSubmit={handleLogin}
            error={error}
          />

          <div className="text-center mt-6">
            <Link 
              to="/signup" 
              className="text-slate-600 hover:text-slate-800 text-sm font-medium transition-colors duration-200"
            >
              I don't have an account
            </Link>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-slate-600 font-medium">Or</span>
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={handleTestLogin}
              disabled={isTestLoading}
              className="w-full bg-slate-600 hover:bg-slate-500 text-white font-semibold py-3.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-600/50 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isTestLoading ? 'Signing in...' : 'Test User Login'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-slate-600">
          By signing in, you don't agree to anything
        </p>
      </div>
    </div>
  )
} 