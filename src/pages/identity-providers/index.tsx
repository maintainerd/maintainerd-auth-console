import { IdentityProviderDataTable } from "./components/IdentityProviderDataTable"
import { identityProviderColumns } from "./components/IdentityProviderColumns"
import { MOCK_IDENTITY_PROVIDERS } from "./constants"

export default function IdentityProvidersPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Identity Provider Management</h1>
        <p className="text-muted-foreground">
          Manage identity providers for user authentication. Use the built-in system or integrate external providers like AWS Cognito, Auth0, and Okta for enhanced authentication capabilities.
        </p>
      </div>

      <IdentityProviderDataTable columns={identityProviderColumns} data={MOCK_IDENTITY_PROVIDERS} />
    </div>
  )
}
