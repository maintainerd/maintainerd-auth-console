import { ServiceListing } from "./components/ServiceListing"
import { PageContainer, PageHeader } from "@/components/layout"

export default function ServicesPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Services"
        description="Manage microservices, their APIs, and permissions within your authentication system."
      />
      <ServiceListing />
    </PageContainer>
  )
}
