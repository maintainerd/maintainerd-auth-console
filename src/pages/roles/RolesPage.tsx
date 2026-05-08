import { RoleListing } from "./components/RoleListing"
import { PageContainer, PageHeader } from "@/components/layout"

export default function RolesPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Role Management"
        description="Create and manage roles with specific permissions to control what users can access and do."
      />
      <RoleListing />
    </PageContainer>
  )
}
