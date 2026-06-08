import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Users, Mail, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { InformationCard } from "@/components/card"
import { EmptyState, ListSkeleton, StatusBadge } from "@/components/details"
import { DataTablePagination, usePaginationTable, RowActions, type RowActionItem } from "@/components/data-table"
import { useUsers, useRemoveUserRole } from "@/hooks/useUsers"
import { useToast } from "@/hooks/useToast"
import { AssignUsersToRoleDialog } from "./AssignUsersToRoleDialog"
import type { User } from "@/services/api/users/types"
import { type PaginationState } from "@tanstack/react-table"

interface RoleUsersProps {
  roleId: string
}

export function RoleUsers({ roleId }: RoleUsersProps) {
  const { tenantId } = useParams<{ tenantId: string }>()
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()
  const removeRoleMutation = useRemoveUserRole()

  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })
  const [isAddOpen, setIsAddOpen] = useState(false)

  const { data, isLoading, isError } = useUsers({
    role_id: roleId,
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    sort_by: "created_at",
    sort_order: "desc",
  })

  const table = usePaginationTable({
    pagination,
    onPaginationChange: setPagination,
    pageCount: data?.total_pages ?? 0,
  })

  const existingUserIds = data?.rows.map((u) => u.user_id) ?? []

  const removeUser = async (user: User) => {
    try {
      await removeRoleMutation.mutateAsync({ userId: user.user_id, roleId })
      showSuccess(`Removed ${user.fullname || user.username} from role`)
    } catch (error) {
      showError(error)
    }
  }

  return (
    <>
      <InformationCard
        title="Users"
        description="Users assigned to this role"
        icon={Users}
        action={
          <Button onClick={() => setIsAddOpen(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Users
          </Button>
        }
      >
        <div className="space-y-4">
          {isLoading && <ListSkeleton />}

          {isError && (
            <p className="py-8 text-center text-sm text-destructive">Failed to load users</p>
          )}

          {data && data.rows.length === 0 && (
            <EmptyState
              icon={Users}
              title="No users"
              description="No users are currently assigned to this role."
            />
          )}

          {data && data.rows.length > 0 && data.rows.map((user: User) => {
            const actions: RowActionItem[] = [
              {
                key: "remove",
                label: "Remove from Role",
                icon: Trash2,
                destructive: true,
                onSelect: () => removeUser(user),
                confirm: {
                  title: "Remove from Role",
                  description: `Remove ${user.fullname || user.username} from this role? They will lose all permissions granted by it.`,
                  confirmText: "Remove",
                },
              },
            ]

            return (
              <div
                key={user.user_id}
                className="flex items-center justify-between gap-3 rounded-lg border p-4"
              >
                <div
                  className="flex min-w-0 items-start gap-3 flex-1 cursor-pointer"
                  onClick={() => navigate(`/${tenantId}/users/${user.user_id}`)}
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      navigate(`/${tenantId}/users/${user.user_id}`)
                    }
                  }}
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-semibold text-white shadow-sm shadow-blue-500/20">
                    {(user.fullname || user.username).slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold">
                        {user.fullname || user.username}
                      </span>
                      <StatusBadge status={user.status} />
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1 font-mono">
                        @{user.username}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Mail className="size-3" />
                        {user.email}
                      </span>
                    </div>
                  </div>
                </div>
                <RowActions items={actions} />
              </div>
            )
          })}

          {data && data.total > 0 && (
            <div className="border-t pt-4">
              <DataTablePagination table={table} rowCount={data.total} />
            </div>
          )}
        </div>
      </InformationCard>

      <AssignUsersToRoleDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        roleId={roleId}
        existingUserIds={existingUserIds}
      />
    </>
  )
}
