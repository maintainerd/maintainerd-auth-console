import LoginLayout from "@/components/layout/LoginLayout"
import LoginForm from "./components/LoginForm"
import { RedirectIfAuthenticated } from "@/components/auth/RedirectIfAuthenticated"

const LoginPage = () => {
  return (
    <RedirectIfAuthenticated>
      <LoginLayout>
        <LoginForm />
      </LoginLayout>
    </RedirectIfAuthenticated>
  )
}

export default LoginPage;
