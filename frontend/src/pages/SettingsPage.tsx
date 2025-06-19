import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export function SettingsPage() {
  const navigate = useNavigate()
  const { signOut } = useAuthStore()

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/login')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-slate-800">WordWise AI - Settings</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/editor')}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all duration-200 font-medium"
            >
              Editor
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all duration-200 font-medium"
            >
              Dashboard
            </button>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all duration-200 font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Brand Voice Settings</h1>
          <p className="text-slate-600">Settings interface will be implemented in task 9</p>
        </div>
      </div>
    </div>
  )
} 