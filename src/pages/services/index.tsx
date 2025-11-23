import { ServiceDataTable } from "./components/ServiceDataTable"
import { PageContainer, PageHeader } from "@/components/layout"

export default function ServicesPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Service Management"
        description="Manage microservices, their APIs, and permissions within your authentication system."
      />
      <ServiceDataTable />
    </PageContainer>
  )
}
