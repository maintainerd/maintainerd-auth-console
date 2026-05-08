import { ApiListing } from "./components/ApiListing"
import { PageContainer, PageHeader } from "@/components/layout"

export default function ApisPage() {
  return (
    <PageContainer>
      <PageHeader
        title="API Management"
        description="Manage API groups and their permissions within your services. Each API represents a logical group of related endpoints under a service."
      />
      <ApiListing />
    </PageContainer>
  )
}
