import { useEffect } from 'react'
import LoginLayout from "@/components/layout/LoginLayout"
import RegisterInviteForm from "./components/RegisterInviteForm"
import { useTenant } from '@/hooks/useTenant'

const RegisterInvitePage = () => {
  const { fetchDefault, currentTenant } = useTenant()

  useEffect(() => {
    if (!currentTenant) fetchDefault()
  }, [currentTenant, fetchDefault])

  return (
    <LoginLayout branding={currentTenant?.branding}>
      <RegisterInviteForm />
    </LoginLayout>
  )
}

export default RegisterInvitePage
