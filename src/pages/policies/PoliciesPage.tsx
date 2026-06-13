import { PolicyListing } from "./components/PolicyListing"
import { PageContainer, PageHeader } from "@/components/layout"

export default function PoliciesPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Policy Management"
        description="Create and manage IAM policies that control service access with allow and deny statements."
      />
      <PolicyListing />
    </PageContainer>
  )
}
