import { useEffect } from 'react'
import LoginLayout from "@/components/layout/LoginLayout"
import RegisterForm from "./components/RegisterForm"
import { useTenant } from '@/hooks/useTenant'

// Access to this page (incl. the self-registration-disabled redirect) is
// enforced centrally by RouteGuard via resolveGuardRedirect.
const RegisterPage = () => {
  const { fetchDefault, currentTenant } = useTenant()

  useEffect(() => {
    if (!currentTenant) fetchDefault()
  }, [currentTenant, fetchDefault])

  return (
    <LoginLayout branding={currentTenant?.branding}>
      <RegisterForm />
    </LoginLayout>
  )
}

export default RegisterPage;
