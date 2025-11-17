import LoginLayout from "@/components/layout/LoginLayout"
import ResetPasswordForm from "./components/ResetPasswordForm"
import { RedirectIfAuthenticated } from "@/components/auth/RedirectIfAuthenticated"

const ResetPasswordPage = () => {
  return (
    <RedirectIfAuthenticated>
      <LoginLayout>
        <ResetPasswordForm />
      </LoginLayout>
    </RedirectIfAuthenticated>
  )
}

export default ResetPasswordPage

