import { SocialProviderDataTable } from "./components/SocialProviderDataTable"
import { socialProviderColumns } from "./components/SocialProviderColumns"
import { MOCK_SOCIAL_PROVIDERS } from "./constants"

export default function SocialProvidersPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Social Provider Management</h1>
        <p className="text-muted-foreground">
          Manage social authentication providers like Google, Facebook, GitHub, and more. Configure OAuth settings and monitor user authentication through social platforms.
        </p>
      </div>

      <SocialProviderDataTable columns={socialProviderColumns} data={MOCK_SOCIAL_PROVIDERS} />
    </div>
  )
}
