import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import LoginLayout from "@/components/layout/LoginLayout"
import RegisterForm from "./components/RegisterForm"
import { RedirectIfAuthenticated } from "@/components/auth/RedirectIfAuthenticated"
import { useTenant } from '@/hooks/useTenant'

const RegisterPage = () => {
  const { fetchDefault, currentTenant } = useTenant()

  useEffect(() => {
    if (!currentTenant) fetchDefault()
  }, [currentTenant, fetchDefault])

  // Redirect to login when self-registration is explicitly disabled.
  // When tenant is still loading (undefined), show the form rather than
  // flashing a redirect — the backend will enforce the policy if needed.
  if (currentTenant?.registration_config?.self_registration_enabled === false) {
    return <Navigate to="/login" replace />
  }

  return (
    <RedirectIfAuthenticated>
      <LoginLayout branding={currentTenant?.branding}>
        <RegisterForm requireEmailVerification={currentTenant?.registration_config?.require_email_verification ?? false} />
      </LoginLayout>
    </RedirectIfAuthenticated>
  )
}

export default RegisterPage;
