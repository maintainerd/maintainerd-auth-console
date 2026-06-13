import { useEffect } from 'react'
import LoginLayout from "@/components/layout/LoginLayout"
import LoginForm from "./components/LoginForm"
import { RedirectIfAuthenticated } from "@/components/auth/RedirectIfAuthenticated"
import { useTenant } from '@/hooks/useTenant'

const LoginPage = () => {
  const { fetchDefault, currentTenant } = useTenant()

  useEffect(() => {
    if (!currentTenant) {
      fetchDefault()
    }
  }, [currentTenant, fetchDefault])

  return (
    <RedirectIfAuthenticated>
      <LoginLayout branding={currentTenant?.branding}>
        <LoginForm />
      </LoginLayout>
    </RedirectIfAuthenticated>
  )
}

export default LoginPage;
