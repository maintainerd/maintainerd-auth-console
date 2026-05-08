import { IdentityProviderListing } from "./components/IdentityProviderListing"
import { PageContainer, PageHeader } from "@/components/layout"

export default function IdentityProvidersPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Identity Provider Management"
        description="Manage identity providers for user authentication. Use the built-in system or integrate external providers like AWS Cognito, Auth0, and others for enhanced authentication capabilities."
      />
      <IdentityProviderListing />
    </PageContainer>
  )
}
