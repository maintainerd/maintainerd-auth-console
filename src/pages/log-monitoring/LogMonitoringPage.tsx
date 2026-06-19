import { PageContainer, PageHeader } from "@/components/layout"
import { DetailsContainer } from "@/components/container"
import { AuthEventListing } from "./components/AuthEventListing"

export default function LogMonitoringPage() {
  return (
    <DetailsContainer>
      <PageContainer>
        <PageHeader
          title="Monitoring"
          description="Monitor authentication, authorization, and security events across your tenant. Filter by category, severity, result, or search by event type and IP."
        />
        <AuthEventListing />
      </PageContainer>
    </DetailsContainer>
  )
}
