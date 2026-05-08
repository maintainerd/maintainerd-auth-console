import { PolicyListing } from "./components/PolicyListing"
import { PageContainer, PageHeader } from "@/components/layout"

export default function PoliciesPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Policy Management"
        description="Manage AWS-style policies that control access to services and resources. Create, configure, and apply policies with fine-grained permissions using allow and deny statements for comprehensive access control."
      />
      <PolicyListing />
    </PageContainer>
  )
}
