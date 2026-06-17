import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import LoginLayout from "@/components/layout/LoginLayout"
import LoginForm from "./components/LoginForm"
import { useTenant } from '@/hooks/useTenant'

const LoginPage = () => {
  const { tenantId } = useParams<{ tenantId?: string }>()
  const { fetchByIdentifier, fetchDefault, currentTenant } = useTenant()

  useEffect(() => {
    if (tenantId) {
      fetchByIdentifier(tenantId)
    } else if (!currentTenant) {
      fetchDefault()
    }
    // Only re-fetch when tenantId changes or component mounts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenantId])

  return (
    <LoginLayout branding={currentTenant?.branding}>
      <LoginForm />
    </LoginLayout>
  )
}

export default LoginPage;
