import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
      </div>
    )
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />
}
