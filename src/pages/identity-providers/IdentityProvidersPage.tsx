import { IdentityProviderListing } from "./components/IdentityProviderListing"
import { PageHeader } from "@/components/layout"

export default function IdentityProvidersPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
      <PageHeader
        title="Identity Providers"
        description="Manage identity providers for user authentication. Use the built-in system or integrate external providers like AWS Cognito, Auth0, and others for enhanced authentication capabilities."
      />
      <IdentityProviderListing tableInCard />
    </div>
  )
}
