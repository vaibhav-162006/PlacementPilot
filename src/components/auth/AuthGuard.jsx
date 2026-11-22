import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@contexts/AuthContext.jsx'
import { LoadingSpinner } from '@components/common/LoadingSpinner.jsx'

export function AuthGuard({ children, requireAuth = true }) {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export function AdminGuard({ children }) {
  const { user, isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  const isAdmin = user?.email?.includes('admin') || user?.user_metadata?.role === 'admin'

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}