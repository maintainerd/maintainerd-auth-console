import { SocialProviderListing } from "./components/SocialProviderListing"
import { PageContainer, PageHeader } from "@/components/layout"

export default function SocialProvidersPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Social Provider Management"
        description="Manage social authentication providers like Google, Facebook, GitHub, and more. Configure OAuth settings and monitor user authentication through social platforms."
      />
      <SocialProviderListing />
    </PageContainer>
  )
}
