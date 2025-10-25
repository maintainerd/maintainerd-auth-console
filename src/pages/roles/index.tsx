import * as React from "react"
import { RoleDataTable } from "./components/RoleDataTable"
import { roleColumns, type Role } from "./components/RoleColumns"
import { MOCK_ROLES } from "./constants"

export default function RolesPage() {
  const [roles, setRoles] = React.useState<Role[]>(MOCK_ROLES)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Role Management</h1>
        <p className="text-muted-foreground">
          Manage roles, permissions, and access control across your organization.
        </p>
      </div>
      <RoleDataTable columns={roleColumns} data={roles} />
    </div>
  )
}
