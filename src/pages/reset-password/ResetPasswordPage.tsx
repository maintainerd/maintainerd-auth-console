import { useEffect } from 'react'
import LoginLayout from "@/components/layout/LoginLayout"
import ResetPasswordForm from "./components/ResetPasswordForm"
import { RedirectIfAuthenticated } from "@/components/auth/RedirectIfAuthenticated"
import { useTenant } from '@/hooks/useTenant'

const ResetPasswordPage = () => {
  const { fetchDefault, currentTenant } = useTenant()

  useEffect(() => {
    if (!currentTenant) fetchDefault()
  }, [currentTenant, fetchDefault])

  return (
    <RedirectIfAuthenticated>
      <LoginLayout branding={currentTenant?.branding}>
        <ResetPasswordForm />
      </LoginLayout>
    </RedirectIfAuthenticated>
  )
}

export default ResetPasswordPage

