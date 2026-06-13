import { useEffect } from 'react'
import LoginLayout from "@/components/layout/LoginLayout"
import ForgotPasswordForm from "./components/ForgotPasswordForm"
import { RedirectIfAuthenticated } from "@/components/auth/RedirectIfAuthenticated"
import { useTenant } from '@/hooks/useTenant'

const ForgotPasswordPage = () => {
  const { fetchDefault, currentTenant } = useTenant()

  useEffect(() => {
    if (!currentTenant) fetchDefault()
  }, [currentTenant, fetchDefault])

  return (
    <RedirectIfAuthenticated>
      <LoginLayout branding={currentTenant?.branding}>
        <ForgotPasswordForm />
      </LoginLayout>
    </RedirectIfAuthenticated>
  )
}

export default ForgotPasswordPage

