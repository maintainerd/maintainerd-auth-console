import LoginLayout from "@/components/layout/LoginLayout"
import ForgotPasswordForm from "./components/ForgotPasswordForm"
import { RedirectIfAuthenticated } from "@/components/auth/RedirectIfAuthenticated"

const ForgotPasswordPage = () => {
  return (
    <RedirectIfAuthenticated>
      <LoginLayout>
        <ForgotPasswordForm />
      </LoginLayout>
    </RedirectIfAuthenticated>
  )
}

export default ForgotPasswordPage

