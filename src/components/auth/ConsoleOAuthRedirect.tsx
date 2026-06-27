import { useEffect, useRef } from 'react'
import { useTenant } from '@/hooks/useTenant'
import AppLoadingScreen from '@/components/layout/AppLoadingScreen'
import { startConsoleOAuthLogin, tryConsoleSilentOAuthLogin } from '@/services/api/oauth'

export function ConsoleOAuthRedirect({ returnTo }: { returnTo: string }) {
  const { currentTenant } = useTenant()
  const startedRef = useRef(false)

  useEffect(() => {
    if (startedRef.current || !currentTenant?.identifier) return
    startedRef.current = true

    const run = async () => {
      const silent = await tryConsoleSilentOAuthLogin(currentTenant.identifier, returnTo)
      if (silent) {
        // Reload the protected URL so bootstrap reads the freshly stored token.
        window.location.replace(returnTo || window.location.href)
        return
      }
      await startConsoleOAuthLogin(currentTenant.identifier, returnTo)
    }
    run().catch((error) => {
        console.error('[console-oauth] failed to start hosted identity OAuth flow', error)
        window.location.replace('/service-unavailable')
      })
  }, [currentTenant?.identifier, returnTo])

  return <AppLoadingScreen branding={currentTenant?.branding} />
}

export default ConsoleOAuthRedirect
