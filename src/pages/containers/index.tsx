import { ContainerDataTable } from "./components/ContainerDataTable"
import { containerColumns } from "./components/ContainerColumns"
import { MOCK_CONTAINERS } from "./constants"

export default function ContainersPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Auth Containers</h1>
        <p className="text-muted-foreground">
          Manage isolated authentication environments that separate and organize users into different containers.
        </p>
      </div>

      <ContainerDataTable columns={containerColumns} data={MOCK_CONTAINERS} />
    </div>
  )
}
