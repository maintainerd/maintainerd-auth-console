import { useState, useMemo } from "react"
import { Key, Search, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { InformationCard } from "@/components/card"
import { DataTablePagination } from "@/components/data-table"
import { PermissionItem } from "./PermissionItem"
import { PermissionFormDialog } from "./PermissionFormDialog"
import { useApiPermissions } from "../hooks/useApiPermissions"
import type { PermissionEntity } from "@/services/api/permission/types"
import {
  getCoreRowModel,
  useReactTable,
  type PaginationState,
} from "@tanstack/react-table"

interface ApiPermissionsTabProps {
  tenantId: string
  apiId: string
}

export function ApiPermissionsTab({ apiId }: ApiPermissionsTabProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPermission, setEditingPermission] = useState<PermissionEntity | null>(null)
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const { data, isLoading, error } = useApiPermissions({
    apiId,
    limit: pagination.pageSize,
    page: pagination.pageIndex + 1,
    name: searchQuery || undefined
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

  return (
    <TabsContent value="permissions" className="space-y-6">
      <InformationCard
        title="Permissions"
        description="Manage permissions for this API"
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
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setPagination({ pageIndex: 0, pageSize: 10 }) // Reset to first page on search
                }}
                className="pl-8"
              />
            </div>
            <Button variant="outline" size="sm" onClick={() => setIsDialogOpen(true)} className="gap-2">
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

            {data && data.rows.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery ? "No permissions found matching your search" : "No permissions found for this API"}
              </div>
            )}

            {data && data.rows.length > 0 && (
              <>
                {data.rows.map((permission) => (
                  <PermissionItem
                    key={permission.permission_id}
                    permission={permission}
                    onEdit={() => {
                      setEditingPermission(permission)
                      setIsDialogOpen(true)
                    }}
                  />
                ))}
              </>
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

      {/* Permission Form Dialog */}
      <PermissionFormDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) {
            setEditingPermission(null)
          }
        }}
        apiId={apiId}
        permission={editingPermission || undefined}
      />
    </TabsContent>
  )
}

