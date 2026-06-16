import { PageContainer, PageHeader } from "@/components/layout"
import { Shield } from "lucide-react"
import { IpRestrictionListing } from "./components/IpRestrictionListing"

export default function IpRestrictionsPage() {
  return (
    <PageContainer>
      <PageHeader
        icon={Shield}
        title="IP Restrictions"
        description="Manage IP allow/deny rules to control access to your authentication system."
      />
      <IpRestrictionListing />
    </PageContainer>
  )
}
