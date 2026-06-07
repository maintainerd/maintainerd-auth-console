import { UserPoolListing } from "./components/UserPoolListing"
import { PageContainer, PageHeader } from "@/components/layout"

export default function UserPoolsPage() {
  return (
    <PageContainer>
      <PageHeader
        title="User Pools"
        description="Manage the user pools for this tenant — each pool is an isolated namespace for users, roles, clients, and settings."
      />
      <UserPoolListing />
    </PageContainer>
  )
}
