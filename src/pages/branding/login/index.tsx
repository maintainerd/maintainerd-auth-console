import { LoginBrandingDataTable } from "./components/LoginBrandingDataTable"
import { loginBrandingColumns } from "./components/LoginBrandingColumns"
import { MOCK_LOGIN_BRANDINGS } from "./constants"

export default function LoginBrandingPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">Login Branding</h1>
          <p className="text-muted-foreground">
            Design and customize login pages for your applications. Create multiple branded login experiences 
            with custom themes, layouts, and content that can be applied to different onboarding flows.
          </p>
        </div>

        <LoginBrandingDataTable columns={loginBrandingColumns} data={MOCK_LOGIN_BRANDINGS} />
      </div>
    </div>
  )
}
