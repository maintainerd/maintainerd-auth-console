import { ApiListing } from "./components/ApiListing"
import { PageHeader } from "@/components/layout"

export default function ApisPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
      <PageHeader
        title="APIs"
        description="Manage API groups and their permissions within your services. Each API represents a logical group of related endpoints under a service."
      />
      <ApiListing tableInCard />
    </div>
  )
}
