import { UserListing } from "./components/UserListing"
import { PageContainer, PageHeader } from "@/components/layout"

export default function UsersPage() {
  return (
    <PageContainer>
      <PageHeader
        title="User Management"
        description="Manage user accounts, authentication settings, and security features like 2FA and email verification."
      />
      <UserListing />
    </PageContainer>
  )
}
