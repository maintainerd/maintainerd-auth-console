import { useState } from "react"
import { Shield, Plus, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { InformationCard } from "@/components/card"
import { SystemBadge } from "@/components/badges"
import { EmptyState, ListSkeleton, StatusBadge } from "@/components/details"
import { DataTablePagination, usePaginationTable, RowActions, type RowActionItem } from "@/components/data-table"
import { useRegistrationFlowRoles, useRemoveRegistrationFlowRole } from "@/hooks/useRegistrationFlows"
import { useToast } from "@/hooks/useToast"
import { AssignRegistrationFlowRolesDialog } from "./AssignRegistrationFlowRolesDialog"
import { type PaginationState } from "@tanstack/react-table"

interface RegistrationFlowRolesProps {
  registrationFlowId: string
}

export function RegistrationFlowRoles({ registrationFlowId }: RegistrationFlowRolesProps) {
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })
  const [isAddOpen, setIsAddOpen] = useState(false)

  const { showSuccess, showError } = useToast()
  const removeRoleMutation = useRemoveRegistrationFlowRole()

  const { data, isLoading, isError } = useRegistrationFlowRoles(registrationFlowId, {
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

  const existingRoleIds = data?.rows.map((r) => r.role_id) ?? []

  const removeRole = async (roleId: string) => {
    try {
      await removeRoleMutation.mutateAsync({ registrationFlowId, roleId })
      showSuccess("Role removed successfully")
    } catch (error) {
      showError(error)
    }
  }

  return (
    <>
      <InformationCard
        title="Roles"
        description="Roles automatically assigned to users who complete this registration flow"
        icon={Shield}
        action={
          <Button onClick={() => setIsAddOpen(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Assign Role
          </Button>
        }
      >
        <div className="space-y-4">
          {isLoading && <ListSkeleton />}

          {isError && (
            <p className="py-8 text-center text-sm text-destructive">Failed to load roles</p>
          )}

          {data && data.rows.length === 0 && (
            <EmptyState
              icon={Shield}
              title="No roles assigned"
              description="Assign roles to automatically grant them to users who complete this registration flow."
            />
          )}

          {data && data.rows.length > 0 && (
            <div className="space-y-3">
              {data.rows.map((role) => {
                const actions: RowActionItem[] = [
                  {
                    key: "remove",
                    label: "Remove Role",
                    icon: Trash2,
                    destructive: true,
                    onSelect: () => removeRole(role.role_id),
                    confirm: {
                      title: "Remove Role",
                      description: `This will remove the role "${role.name}" from this registration flow. The role itself is not deleted.`,
                      confirmText: "Remove",
                    },
                  },
                ]

                return (
                  <div
                    key={role.role_id}
                    className="flex items-start justify-between gap-3 rounded-lg border p-4"
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        <Shield className="size-4" />
                      </div>
                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium">{role.name}</span>
                          <SystemBadge isSystem={role.is_system} />
                          {role.status && <StatusBadge status={role.status} />}
                        </div>
                        {role.description && (
                          <p className="text-sm text-muted-foreground">{role.description}</p>
                        )}
                        <div className="text-xs text-muted-foreground">
                          Added {format(new Date(role.created_at), "MMM dd, yyyy")}
                        </div>
                      </div>
                    </div>
                    <RowActions items={actions} />
                  </div>
                )
              })}
            </div>
          )}

          {data && data.total > 0 && (
            <div className="border-t pt-4">
              <DataTablePagination table={table} rowCount={data.total} />
            </div>
          )}
        </div>
      </InformationCard>

      <AssignRegistrationFlowRolesDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        registrationFlowId={registrationFlowId}
        existingRoleIds={existingRoleIds}
      />
    </>
  )
}
