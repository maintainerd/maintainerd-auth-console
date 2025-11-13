/**
 * Redirect If Authenticated Component
 * Redirects authenticated users away from auth pages (login, register, etc.)
 */

import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { getCurrentTenant } from '@/services'
import { useAuth } from '@/hooks/useAuth'
import { Loader2 } from 'lucide-react'

interface RedirectIfAuthenticatedProps {
  children: ReactNode
  redirectTo?: string
  fallback?: ReactNode
}

export function RedirectIfAuthenticated({
  children,
  redirectTo,
  fallback
}: RedirectIfAuthenticatedProps) {
  const location = useLocation()
  const { isAuthenticated, isLoading } = useAuth()

  // Show loading spinner while auth is being initialized
  if (isLoading) {
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

  // Redirect to dashboard if authenticated
  if (isAuthenticated) {
    // Get current tenant to determine redirect URL
    const currentTenant = getCurrentTenant()
    const defaultRedirect = currentTenant ? `/${currentTenant.identifier}/dashboard` : '/def4ult/dashboard'

    // Check if there's a redirect location from the login state
    const from = (location.state as any)?.from?.pathname || redirectTo || defaultRedirect
    return <Navigate to={from} replace />
  }

  // Render auth content (login, register, etc.)
  return <>{children}</>
}

export default RedirectIfAuthenticated
