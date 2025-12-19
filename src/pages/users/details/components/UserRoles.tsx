import { useState, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, Calendar, Plus, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { InformationCard } from "@/components/card"
import { DataTablePagination } from "@/components/data-table"
import { DeleteConfirmationDialog } from "@/components/dialog"
import { useUserRoles, useRemoveUserRole } from "@/hooks/useUsers"
import { useToast } from "@/hooks/useToast"
import type { UserRoleType } from "@/services/api/user/types"
import {
  getCoreRowModel,
  useReactTable,
  type PaginationState,
} from "@tanstack/react-table"
import { AssignUserRolesDialog } from "./AssignUserRolesDialog"

interface UserRolesProps {
  userId: string
}

export function UserRoles({ userId }: UserRolesProps) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean
    role: UserRoleType | null
  }>({
    open: false,
    role: null
  })

  const { showSuccess, showError } = useToast()
  const removeRoleMutation = useRemoveUserRole()

  const { data, isLoading, isError } = useUserRoles(userId, {
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    sort_by: 'created_at',
    sort_order: 'desc',
  })

  // Create a simple table instance for pagination
  const columns = useMemo(() => [], [])
  const tableData = data?.rows || []

  const table = useReactTable({
    data: tableData,
    columns,
    pageCount: data?.total_pages || 0,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  })

  const handleRemoveRole = async () => {
    if (!deleteDialog.role) return

    try {
      await removeRoleMutation.mutateAsync({
        userId,
        roleId: deleteDialog.role.role_id
      })
      showSuccess(`Role "${deleteDialog.role.name}" removed successfully`)
      setDeleteDialog({ open: false, role: null })
    } catch (error) {
      showError(error)
    }
  }

  // Get existing role IDs for the assign dialog
  const existingRoleIds = data?.rows.map(role => role.role_id) || []

  return (
    <>
      <InformationCard
        title="User Roles"
        description="Roles and permissions assigned to this user"
        icon={Shield}
        action={
          <Button size="sm" className="gap-2" onClick={() => setAssignDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Assign Role
          </Button>
        }
      >
      <div className="space-y-4">
        {/* Horizontal line */}
        <div className="border-t" />

        {/* Scrollable content area */}
        <div className="max-h-[600px] overflow-y-auto pr-2">
          {isLoading && (
            <div className="text-center py-8 text-muted-foreground">
              Loading roles...
            </div>
          )}

          {isError && (
            <div className="text-center py-8 text-destructive">
              Failed to load roles
            </div>
          )}

          {data && data.rows.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No roles assigned to this user
            </div>
          )}

          {data && data.rows.length > 0 && (
            <div className="space-y-3">
              {data.rows.map((role: UserRoleType) => (
                <div
                  key={role.role_id}
                  className="flex items-start justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Shield className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{role.name}</p>
                        {role.is_system && (
                          <Badge variant="secondary" className="text-xs">
                            System
                          </Badge>
                        )}
                        {role.is_default && (
                          <Badge variant="outline" className="text-xs">
                            Default
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{role.description}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        Added {format(new Date(role.created_at), "PPP")}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteDialog({ open: true, role })}
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination controls */}
        {data && data.total > 0 && (
          <div className="pt-4 border-t">
            <DataTablePagination table={table} rowCount={data.total} />
          </div>
        )}
      </div>
    </InformationCard>

      {/* Assign Roles Dialog */}
      <AssignUserRolesDialog
        open={assignDialogOpen}
        onOpenChange={setAssignDialogOpen}
        userId={userId}
        existingRoleIds={existingRoleIds}
      />

      {/* Delete Role Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, role: null })}
        onConfirm={handleRemoveRole}
        title="Remove Role from User"
        description="This action will remove the role from this user."
        confirmationText="This will remove the role from this user. The role itself will not be deleted."
        itemName={deleteDialog.role?.name || ""}
        isDeleting={removeRoleMutation.isPending}
      />
    </>
  )
}
