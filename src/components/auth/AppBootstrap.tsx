import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useTenant } from '@/hooks/useTenant'
import { determineTenantIdentifier } from '@/utils/tenant'
import { SERVICE_UNAVAILABLE_ROUTE, isPublicConsoleRoute } from '@/utils/postAuthRoute'
import AppLoadingScreen from '@/components/layout/AppLoadingScreen'
import { RouteGuard } from './RouteGuard'

/**
 * App initialization gate.
 *
 * Runs once on first load / reload / direct-URL entry: kicks off auth and tenant
 * initialization and shows a single full-screen loading splash until both have
 * settled. Only then does it render the route tree (wrapped in RouteGuard, which
 * decides where the user actually belongs).
 *
 * It is NOT re-shown during in-app navigation — once the app has booted, the
 * splash never returns; runtime gating is handled instantly by RouteGuard.
 */
export function AppBootstrap({ children }: { children: ReactNode }) {
  const location = useLocation()
  const { initializeAuth, isInitialized } = useAuth()
  const { initializeFromLocation, currentTenant, error: tenantError } = useTenant()

  const authStartedRef = useRef(false)
  const lastTenantIdentifierRef = useRef<string | null | undefined>(undefined)
  const [tenantSettled, setTenantSettled] = useState(false)

  // Initialize auth once on mount (fetches /account if a session cookie exists).
  useEffect(() => {
    if (authStartedRef.current) return
    authStartedRef.current = true
    initializeAuth().catch(() => {
      /* handled inside initializeAuth */
    })
  }, [initializeAuth])

  // Initialize tenant from the current URL. Re-runs on tenant switches but never
  // un-settles, so the splash only appears for the very first resolution.
  useEffect(() => {
    const run = async () => {
      const searchParams = new URLSearchParams(location.search)
      const tenantIdentifier = determineTenantIdentifier(location.pathname, searchParams)
      if (lastTenantIdentifierRef.current === tenantIdentifier) {
        setTenantSettled(true)
        return
      }
      lastTenantIdentifierRef.current = tenantIdentifier

      // Setup routes have no tenant yet — skip initialization entirely.
      if (location.pathname.startsWith('/setup')) {
        setTenantSettled(true)
        return
      }

      try {
        await initializeFromLocation(location.pathname, location.search)
      } catch {
        /* error already surfaced in initializeFromLocation */
      } finally {
        setTenantSettled(true)
      }
    }
    run()
  }, [location.pathname, location.search, initializeFromLocation])

  const ready = isInitialized && tenantSettled
  if (!ready) {
    return <AppLoadingScreen branding={currentTenant?.branding} />
  }

  // Public routes (login / landing, setup wizard, error / callback pages) must
  // render even when the tenant couldn't be resolved — otherwise logging out
  // could bounce to service-unavailable instead of the login page. Only
  // protected routes fall back to the service-unavailable screen.
  if (!currentTenant && tenantError && !isPublicConsoleRoute(location.pathname)) {
    return <Navigate to={SERVICE_UNAVAILABLE_ROUTE} replace />
  }

  return <RouteGuard>{children}</RouteGuard>
}

export default AppBootstrap
