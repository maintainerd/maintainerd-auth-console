import { SignupFlowListing } from "./components/SignupFlowListing"
import { PageContainer, PageHeader } from "@/components/layout"

export default function SignupFlowsPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Auth Flows"
        description="Define how users authenticate and onboard into your applications, with automatic role assignment per flow."
      />
      <SignupFlowListing />
    </PageContainer>
  )
}
