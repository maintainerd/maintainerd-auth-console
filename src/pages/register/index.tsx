import LoginLayout from "@/components/layout/LoginLayout"
import RegisterForm from "./components/RegisterForm"
import { RedirectIfAuthenticated } from "@/components/auth/RedirectIfAuthenticated"

const RegisterPage = () => {
  return (
    <RedirectIfAuthenticated>
      <LoginLayout>
        <RegisterForm />
      </LoginLayout>
    </RedirectIfAuthenticated>
  )
}

export default RegisterPage;
