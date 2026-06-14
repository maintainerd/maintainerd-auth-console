import { useEffect } from 'react'
import LoginLayout from "@/components/layout/LoginLayout"
import RegisterProfileForm from "./components/RegisterProfileForm"
import { useTenant } from '@/hooks/useTenant'

// Step gating (must be authenticated, email verified, no profile yet) is handled
// centrally by RouteGuard before this page renders.
const RegisterProfilePage = () => {
  const { fetchDefault, currentTenant } = useTenant()

  useEffect(() => {
    if (!currentTenant) fetchDefault()
  }, [currentTenant, fetchDefault])

  return (
    <LoginLayout branding={currentTenant?.branding}>
      <RegisterProfileForm />
    </LoginLayout>
  )
}

export default RegisterProfilePage
