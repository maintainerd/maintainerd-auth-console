import { PageContainer, PageHeader } from "@/components/layout"
import { Building2 } from "lucide-react"
import { TenantListing } from "./components/TenantListing"

export default function TenantsPage() {
  return (
    <PageContainer>
      <PageHeader
        icon={Building2}
        title="Tenants"
        description="Manage your tenant organizations, their status, visibility, and authentication settings."
      />
      <TenantListing />
    </PageContainer>
  )
}
