import { RegistrationFlowListing } from "./components/RegistrationFlowListing"
import { PageHeader } from "@/components/layout"

export default function RegistrationFlowsPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
      <PageHeader
        title="Registration"
        description="Define how users authenticate and onboard into your applications, with automatic role assignment per flow."
      />
      <RegistrationFlowListing tableInCard />
    </div>
  )
}
