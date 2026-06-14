import { useEffect } from 'react'
import LoginLayout from "@/components/layout/LoginLayout"
import LoginForm from "./components/LoginForm"
import { useTenant } from '@/hooks/useTenant'

const LoginPage = () => {
  const { fetchDefault, currentTenant } = useTenant()

  useEffect(() => {
    if (!currentTenant) {
      fetchDefault()
    }
  }, [currentTenant, fetchDefault])

  return (
    <LoginLayout branding={currentTenant?.branding}>
      <LoginForm />
    </LoginLayout>
  )
}

export default LoginPage;
