/**
 * Protected Route Component
 * Handles authentication checks for protected routes
 */

import { ReactNode, useState, useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { getUserProfile, validateAuthentication } from '@/services'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: ReactNode
  fallback?: ReactNode
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const location = useLocation()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user profile exists in localStorage
        const userProfile = getUserProfile()
        if (!userProfile) {
          setIsAuthenticated(false)
          return
        }

        // Validate with backend
        const isValid = await validateAuthentication()
        setIsAuthenticated(isValid)
      } catch (error) {
        console.error('Auth check error:', error)
        setIsAuthenticated(false)
      }
    }

    checkAuth()
  }, [])

  // Show loading spinner while checking authentication
  if (isAuthenticated === null) {
    return (
      fallback || (
        <div className="flex min-h-screen items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        </div>
      )
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Render protected content
  return <>{children}</>
}

export default ProtectedRoute
