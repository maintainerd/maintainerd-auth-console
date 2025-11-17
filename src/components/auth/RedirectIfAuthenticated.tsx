/**
 * Redirect If Authenticated Component
 * Redirects authenticated users away from auth pages (login, register, etc.)
 */

import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useTenant } from '@/hooks/useTenant'

interface RedirectIfAuthenticatedProps {
  children: ReactNode
  redirectTo?: string
  fallback?: ReactNode
}

export function RedirectIfAuthenticated({
  children,
  redirectTo,
}: RedirectIfAuthenticatedProps) {
  const location = useLocation()
  const { isAuthenticated } = useAuth()
  const { currentTenant } = useTenant()

  // Redirect to dashboard if authenticated
  if (isAuthenticated) {
    // Get current tenant to determine redirect URL
    const defaultRedirect = currentTenant ? `/${currentTenant.identifier}/dashboard` : '/def4ult/dashboard'

    // Check if there's a redirect location from the login state
    const from = (location.state as any)?.from?.pathname || redirectTo || defaultRedirect
    return <Navigate to={from} replace />
  }

  // Render auth content (login, register, etc.)
  return <>{children}</>
}

export default RedirectIfAuthenticated
