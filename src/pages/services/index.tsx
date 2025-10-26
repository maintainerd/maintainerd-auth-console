import { ServiceDataTable } from "./components/ServiceDataTable"
import { serviceColumns } from "./components/ServiceColumns"
import { MOCK_SERVICES } from "./constants"

export default function ServicesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Service Management</h1>
        <p className="text-muted-foreground">
          Manage microservices, their APIs, and permissions within your authentication system.
        </p>
      </div>
      
      <ServiceDataTable columns={serviceColumns} data={MOCK_SERVICES} />
    </div>
  )
}
