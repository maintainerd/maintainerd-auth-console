import { useState, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, Calendar, Plus, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { InformationCard } from "@/components/card"
import { DataTablePagination } from "@/components/data-table"
import { DeleteConfirmationDialog } from "@/components/dialog"
import { useSignupFlowRoles, useRemoveSignupFlowRole } from "@/hooks/useSignupFlows"
import { useToast } from "@/hooks/useToast"
import { AssignSignupFlowRolesDialog } from "./AssignSignupFlowRolesDialog"
import type { SignupFlowRoleType } from "@/services/api/signup-flow/types"
import {
  getCoreRowModel,
  useReactTable,
  type PaginationState,
} from "@tanstack/react-table"

interface SignupFlowRolesProps {
  signupFlowId: string
}

export function SignupFlowRoles({ signupFlowId }: SignupFlowRolesProps) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<SignupFlowRoleType | null>(null)

  const { showSuccess, showError } = useToast()
  const removeRoleMutation = useRemoveSignupFlowRole()

  const { data, isLoading, isError } = useSignupFlowRoles(signupFlowId, {
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

  const handleDeleteRole = (role: SignupFlowRoleType) => {
    setSelectedRole(role)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedRole) return

    try {
      await removeRoleMutation.mutateAsync({
        signupFlowId,
        roleId: selectedRole.role_id,
      })
      showSuccess('Role removed successfully')
      setDeleteDialogOpen(false)
      setSelectedRole(null)
    } catch (error) {
      showError(error)
    }
  }

  const existingRoleIds = data?.rows.map(r => r.role_id) || []

  return (
    <>
      <InformationCard
        title="Assigned Roles"
        description="Roles that will be automatically assigned to users completing this sign up flow"
        icon={Shield}
        action={
          <Button
            onClick={() => setAssignDialogOpen(true)}
            size="sm"
          >
            <Plus className="mr-2 h-4 w-4" />
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
              No roles assigned to this sign up flow
            </div>
          )}

          {data && data.rows.length > 0 && (
            <div className="space-y-3">
              {data.rows.map((role: SignupFlowRoleType) => (
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
                        <Badge
                          className={
                            role.status === 'active'
                              ? 'bg-green-100 text-green-800 border-green-200 text-xs'
                              : 'bg-red-100 text-red-800 border-red-200 text-xs'
                          }
                        >
                          {role.status.charAt(0).toUpperCase() + role.status.slice(1)}
                        </Badge>
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
                    onClick={() => handleDeleteRole(role)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
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

      <AssignSignupFlowRolesDialog
        open={assignDialogOpen}
        onOpenChange={setAssignDialogOpen}
        signupFlowId={signupFlowId}
        existingRoleIds={existingRoleIds}
      />

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Remove Role from Sign Up Flow"
        description="This action will remove the role from this sign up flow."
        confirmationText={`This will remove the role from this sign up flow. The role itself will not be deleted. Type "${selectedRole?.name}" to confirm.`}
        itemName={selectedRole?.name || ""}
        isDeleting={removeRoleMutation.isPending}
      />
    </>
  )
}
