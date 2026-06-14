import { useEffect } from 'react'
import LoginLayout from "@/components/layout/LoginLayout"
import ResetPasswordForm from "./components/ResetPasswordForm"
import { useTenant } from '@/hooks/useTenant'

const ResetPasswordPage = () => {
  const { fetchDefault, currentTenant } = useTenant()

  useEffect(() => {
    if (!currentTenant) fetchDefault()
  }, [currentTenant, fetchDefault])

  return (
    <LoginLayout branding={currentTenant?.branding}>
      <ResetPasswordForm />
    </LoginLayout>
  )
}

export default ResetPasswordPage

