import { useState, useMemo } from "react"
import { Key, Search, Plus } from "lucide-react"
import { TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { InformationCard } from "@/components/card"
import { DataTablePagination } from "@/components/data-table"
import { DeleteConfirmationDialog } from "@/components/dialog"
import { PermissionItem } from "./PermissionItem"
import { AddRolePermissionsDialog } from "./AddRolePermissionsDialog"
import { useRolePermissions } from "../hooks/useRolePermissions"
import { useRemoveRolePermission } from "@/hooks/useRoles"
import { useToast } from "@/hooks/useToast"
import {
  getCoreRowModel,
  useReactTable,
  type PaginationState,
} from "@tanstack/react-table"

interface RolePermissionsTabProps {
  roleId: string
}

interface PermissionData {
  permission_id: string
  name: string
  description: string
  api?: {
    display_name: string
    api_type: string
  }
  status: string
  is_system: boolean
  created_at: string
}

export function RolePermissionsTab({ roleId }: RolePermissionsTabProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [addPermissionsDialogOpen, setAddPermissionsDialogOpen] = useState(false)
  const [deletePermissionDialog, setDeletePermissionDialog] = useState<{
    open: boolean
    permissionId: string | null
    permissionName: string | null
  }>({
    open: false,
    permissionId: null,
    permissionName: null
  })
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const { data, isLoading, error } = useRolePermissions({
    roleId,
    limit: pagination.pageSize,
    page: pagination.pageIndex + 1,
    status: 'active'
  })
  const removePermissionMutation = useRemoveRolePermission()
  const { showSuccess, showError } = useToast()

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

  // Filter data based on search query (client-side filtering for now)
  const filteredData = useMemo(() => {
    if (!searchQuery || !data?.rows) return data?.rows || []
    return data.rows.filter((permission: PermissionData) =>
      permission.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      permission.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [data?.rows, searchQuery])

  // Get existing permission IDs for filtering in the dialog
  const existingPermissionIds = useMemo(() => {
    return data?.rows.map(p => p.permission_id) || []
  }, [data?.rows])

  // Handle delete permission
  const handleDeletePermission = async () => {
    if (!deletePermissionDialog.permissionId) return

    try {
      await removePermissionMutation.mutateAsync({
        roleId,
        permissionId: deletePermissionDialog.permissionId
      })
      showSuccess("Permission removed from role successfully")
      setDeletePermissionDialog({ open: false, permissionId: null, permissionName: null })
    } catch (error) {
      showError(error)
    }
  }

  return (
    <TabsContent value="permissions" className="space-y-6">
      <InformationCard
        title="Permissions"
        description="Permissions assigned to this role"
        icon={Key}
      >
        <div className="space-y-4">
          {/* Search filter and Add button */}
          <div className="flex items-center justify-between gap-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search permissions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button size="sm" className="gap-2" onClick={() => setAddPermissionsDialogOpen(true)}>
              <Plus className="h-4 w-4" />
              Add Permission
            </Button>
          </div>

          {/* Horizontal line */}
          <div className="border-t" />

          {/* Scrollable content area */}
          <div className="max-h-[600px] overflow-y-auto pr-2">
            {isLoading && (
              <div className="text-center py-8 text-muted-foreground">
                Loading permissions...
              </div>
            )}

            {error && (
              <div className="text-center py-8 text-destructive">
                Failed to load permissions
              </div>
            )}

            {filteredData && filteredData.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery ? "No permissions found matching your search" : "No permissions assigned to this role"}
              </div>
            )}

            {filteredData && filteredData.length > 0 && (
              <>
                {filteredData.map((permission: PermissionData) => (
                  <PermissionItem
                    key={permission.permission_id}
                    permission={permission}
                    onDelete={(permissionId, permissionName) => 
                      setDeletePermissionDialog({
                        open: true,
                        permissionId,
                        permissionName
                      })
                    }
                  />
                ))}
              </>
            )}
          </div>

          {/* Pagination controls */}
          {data && data.total > 0 && !searchQuery && (
            <div className="pt-4 border-t">
              <DataTablePagination table={table} rowCount={data.total} />
            </div>
          )}
        </div>
      </InformationCard>

      {/* Add Permissions Dialog */}
      <AddRolePermissionsDialog
        open={addPermissionsDialogOpen}
        onOpenChange={setAddPermissionsDialogOpen}
        roleId={roleId}
        existingPermissionIds={existingPermissionIds}
      />

      {/* Delete Permission Dialog */}
      <DeleteConfirmationDialog
        open={deletePermissionDialog.open}
        onOpenChange={(open) => {
          if (!open) {
            setDeletePermissionDialog({ open: false, permissionId: null, permissionName: null })
          }
        }}
        onConfirm={handleDeletePermission}
        title="Remove Permission"
        description={
          deletePermissionDialog.permissionName
            ? `This will permanently remove the permission "${deletePermissionDialog.permissionName}" from this role. This action cannot be undone.`
            : "This will permanently remove this permission from the role. This action cannot be undone."
        }
        confirmationText="remove"
        itemName={deletePermissionDialog.permissionName || ""}
        isDeleting={removePermissionMutation.isPending}
      />
    </TabsContent>
  )
}
