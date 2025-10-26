import * as React from "react"
import { UserDataTable } from "./components/UserDataTable"
import { userColumns, type User } from "./components/UserColumns"
import { MOCK_USERS } from "./constants"

export default function UsersPage() {
  const [users, setUsers] = React.useState<User[]>(MOCK_USERS)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">
          Manage user accounts, roles, and permissions across your organization.
        </p>
      </div>
      <UserDataTable columns={userColumns} data={users} />
    </div>
  )
}
