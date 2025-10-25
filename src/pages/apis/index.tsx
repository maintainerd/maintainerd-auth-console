import { ApiDataTable } from "./components/ApiDataTable"
import { apiColumns } from "./components/ApiColumns"
import { MOCK_APIS } from "./constants"

export default function ApisPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">API Management</h1>
        <p className="text-muted-foreground">
          Manage API groups and their permissions within your services. Each API represents a logical group of related endpoints under a service.
        </p>
      </div>
      
      <ApiDataTable columns={apiColumns} data={MOCK_APIS} />
    </div>
  )
}
