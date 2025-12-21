import { SignupFlowListing } from "./components/SignupFlowListing"
import { PageContainer, PageHeader } from "@/components/layout"

export default function SignupFlowsPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Sign Up Flows"
        description="Manage signup flows for your applications. Create custom signup experiences with automatic role assignments."
      />
      <SignupFlowListing />
    </PageContainer>
  )
}
