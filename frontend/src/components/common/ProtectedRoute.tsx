import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { LoadingSpinner } from './LoadingSpinner'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuthStore()

  console.log('[ProtectedRoute] Checking auth:', {
    hasUser: !!user,
    userEmail: user?.email,
    loading
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="xl" />
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    console.log('[ProtectedRoute] No user, redirecting to login')
    return <Navigate to="/login" replace />
  }

  console.log('[ProtectedRoute] User authenticated, rendering children')
  return <>{children}</>
} 