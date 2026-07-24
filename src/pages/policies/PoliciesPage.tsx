import { PolicyListing } from "./components/PolicyListing"
import { PageHeader } from "@/components/layout"

export default function PoliciesPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
      <PageHeader
        title="Policies"
        description="Create and manage IAM policies that control service access with allow and deny statements."
      />
      <PolicyListing tableInCard />
    </div>
  )
}
