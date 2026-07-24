import { ServiceListing } from "./components/ServiceListing"
import { PageHeader } from "@/components/layout"

export default function ServicesPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
      <PageHeader
        title="Services"
        description="Manage microservices, their APIs, and permissions within your authentication system."
      />
      <ServiceListing tableInCard />
    </div>
  )
}
