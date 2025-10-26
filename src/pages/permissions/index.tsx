import { PermissionDataTable } from "./components/PermissionDataTable"
import { permissionColumns } from "./components/PermissionColumns"
import { MOCK_PERMISSIONS } from "./constants"

export default function PermissionsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Permission Management</h1>
        <p className="text-muted-foreground">
          Manage API permissions with resource:action syntax. Control access to specific actions within your APIs.
        </p>
      </div>

      <PermissionDataTable columns={permissionColumns} data={MOCK_PERMISSIONS} />
    </div>
  )
}
