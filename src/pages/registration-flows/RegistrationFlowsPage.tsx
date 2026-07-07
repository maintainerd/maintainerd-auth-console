import { RegistrationFlowListing } from "./components/RegistrationFlowListing"
import { PageContainer, PageHeader } from "@/components/layout"

export default function RegistrationFlowsPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Registration"
        description="Define how users authenticate and onboard into your applications, with automatic role assignment per flow."
      />
      <RegistrationFlowListing />
    </PageContainer>
  )
}
