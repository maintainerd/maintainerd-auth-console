import { useEffect } from 'react'
import LoginLayout from "@/components/layout/LoginLayout"
import ForgotPasswordForm from "./components/ForgotPasswordForm"
import { useTenant } from '@/hooks/useTenant'

const ForgotPasswordPage = () => {
  const { fetchDefault, currentTenant } = useTenant()

  useEffect(() => {
    if (!currentTenant) fetchDefault()
  }, [currentTenant, fetchDefault])

  return (
    <LoginLayout branding={currentTenant?.branding}>
      <ForgotPasswordForm />
    </LoginLayout>
  )
}

export default ForgotPasswordPage

