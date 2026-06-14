import { useNavigate } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import LoginLayout from '@/components/layout/LoginLayout'
import { useAuth } from '@/hooks/useAuth'
import { useTenant } from '@/hooks/useTenant'
import { resolvePostAuthRoute, LOGIN_ROUTE } from '@/utils/postAuthRoute'

/**
 * Shown when an authenticated user opens a page they're not allowed to see
 * (e.g. a different tenant's URL). The bootstrap gate / route guard routes here.
 */
const NoAccessPage = () => {
  const navigate = useNavigate()
  const { isAuthenticated, account } = useAuth()
  const { currentTenant } = useTenant()

  const handleBack = () => {
    navigate(isAuthenticated ? resolvePostAuthRoute(account, currentTenant) : LOGIN_ROUTE, {
      replace: true,
    })
  }

  return (
    <LoginLayout branding={currentTenant?.branding}>
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-amber-100">
          <ShieldAlert className="size-7 text-amber-600" />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">You don't have access</h1>
          <p className="text-sm text-muted-foreground max-w-xs">
            You're not allowed to view this page. If you think this is a mistake, contact your
            administrator.
          </p>
        </div>
        <Button className="h-11 w-full font-medium shadow-sm" onClick={handleBack}>
          {isAuthenticated ? 'Back to your dashboard' : 'Back to sign in'}
        </Button>
      </div>
    </LoginLayout>
  )
}

export default NoAccessPage
