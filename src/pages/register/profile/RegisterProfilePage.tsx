import { useEffect } from 'react'
import LoginLayout from "@/components/layout/LoginLayout"
import RegisterProfileForm from "./components/RegisterProfileForm"
import { useTenant } from '@/hooks/useTenant'

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
