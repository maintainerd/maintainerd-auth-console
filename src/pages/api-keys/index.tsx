import { ApiKeyListing } from "./components/ApiKeyListing"
import { PageContainer, PageHeader } from "@/components/layout"

export default function ApiKeysPage() {
  return (
    <PageContainer>
      <PageHeader
        title="API Key Management"
        description="Manage API keys for programmatic access to your authentication system. Create, configure, and monitor API keys with different permission levels for secure integration with external services and applications."
      />
      <ApiKeyListing />
    </PageContainer>
  )
}
