import { useState, useMemo } from "react"
import { Users, Search, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { InformationCard } from "@/components/card"
import { DataTablePagination } from "@/components/data-table"
import { DeleteConfirmationDialog } from "@/components/dialog"
import { MemberItem } from "./MemberItem"
import { AddMemberDialog } from "./AddMemberDialog"
import { UpdateMemberRoleDialog } from "@/pages/settings/components/UpdateMemberRoleDialog"
import { useTenantMembers, useDeleteTenantMember } from "@/hooks/useTenantMembers"
import { useToast } from "@/hooks/useToast"
import { useAppSelector } from '@/store/hooks'
import type { TenantMember } from "@/services/api/tenant/members"
import {
  getCoreRowModel,
  useReactTable,
  type PaginationState,
} from "@tanstack/react-table"

export function MembersSettings() {
  const currentTenant = useAppSelector((state) => state.tenant.currentTenant)
  const tenantId = currentTenant?.tenant_id || ''
  
  const [searchQuery, setSearchQuery] = useState("")
  const [addMemberDialogOpen, setAddMemberDialogOpen] = useState(false)
  const [updateRoleDialog, setUpdateRoleDialog] = useState<{
    open: boolean
    member: TenantMember | null
  }>({
    open: false,
    member: null
  })
  const [deleteMemberDialog, setDeleteMemberDialog] = useState<{
    open: boolean
    memberId: string | null
    memberName: string | null
    username: string | null
  }>({
    open: false,
    memberId: null,
    memberName: null,
    username: null
  })
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const { data, isLoading, error } = useTenantMembers(tenantId, {
    limit: pagination.pageSize,
    page: pagination.pageIndex + 1,
    sort_by: 'created_at',
    sort_order: 'desc'
  })
  const deleteMemberMutation = useDeleteTenantMember(tenantId)
  const { showSuccess, showError } = useToast()

  // Create a simple table instance for pagination
  const columns = useMemo(() => [], [])
  const tableData = data?.data || []

  const table = useReactTable({
    data: tableData,
    columns,
    pageCount: Math.ceil((tableData.length) / pagination.pageSize),
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  })

  // Filter data based on search query (client-side filtering)
  const filteredData = useMemo(() => {
    if (!searchQuery || !data?.data) return data?.data || []
    return data.data.filter((member: TenantMember) =>
      member.user.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.user.username.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [data?.data, searchQuery])

  // Handle delete member
  const handleDeleteMember = async () => {
    if (!deleteMemberDialog.memberId) return

    try {
      await deleteMemberMutation.mutateAsync(deleteMemberDialog.memberId)
      showSuccess("Member removed successfully")
      setDeleteMemberDialog({ open: false, memberId: null, memberName: null, username: null })
    } catch (error) {
      showError(error)
    }
  }

  return (
    <>
      <InformationCard
        title="Tenant Members"
        description="Manage users who have access to this tenant"
        icon={Users}
      >
        <div className="space-y-4">
          {/* Search filter and Add button */}
          <div className="flex items-center justify-between gap-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button size="sm" className="gap-2" onClick={() => setAddMemberDialogOpen(true)}>
              <Plus className="h-4 w-4" />
              Add Member
            </Button>
          </div>

          {/* Horizontal line */}
          <div className="border-t" />

          {/* Scrollable content area */}
          <div className="max-h-[600px] overflow-y-auto pr-2">
            {isLoading && (
              <div className="text-center py-8 text-muted-foreground">
                Loading members...
              </div>
            )}

            {error && (
              <div className="text-center py-8 text-destructive">
                Failed to load members
              </div>
            )}

            {filteredData && filteredData.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery ? "No members found matching your search" : "No members found"}
              </div>
            )}

            {filteredData && filteredData.length > 0 && (
              <>
                {filteredData.map((member: TenantMember) => (
                  <MemberItem
                    key={member.tenant_user_id}
                    member={member}
                    onUpdateRole={() => 
                      setUpdateRoleDialog({
                        open: true,
                        member: member
                      })
                    }
                    onDelete={(memberId, memberName) => 
                      setDeleteMemberDialog({
                        open: true,
                        memberId,
                        memberName,
                        username: member.user.username
                      })
                    }
                  />
                ))}
              </>
            )}
          </div>

          {/* Pagination controls */}
          {data && data.data && data.data.length > 0 && !searchQuery && (
            <div className="pt-4 border-t">
              <DataTablePagination table={table} rowCount={data.data.length} />
            </div>
          )}
        </div>
      </InformationCard>

      {/* Add Member Dialog */}
      <AddMemberDialog
        open={addMemberDialogOpen}
        onOpenChange={setAddMemberDialogOpen}
      />

      {/* Update Role Dialog */}
      {updateRoleDialog.member && (
        <UpdateMemberRoleDialog
          open={updateRoleDialog.open}
          onOpenChange={(open) => {
            if (!open) {
              setUpdateRoleDialog({ open: false, member: null })
            }
          }}
          member={updateRoleDialog.member}
        />
      )}

      {/* Delete Member Dialog */}
      <DeleteConfirmationDialog
        open={deleteMemberDialog.open}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteMemberDialog({ open: false, memberId: null, memberName: null, username: null })
          }
        }}
        onConfirm={handleDeleteMember}
        title="Remove Member"
        description={
          deleteMemberDialog.memberName
            ? `Are you sure you want to remove "${deleteMemberDialog.memberName}" from this tenant?`
            : "Are you sure you want to remove this member from the tenant?"
        }
        confirmationText="This will permanently remove this member from the tenant and revoke their access. This action cannot be undone."
        itemName={deleteMemberDialog.username || ""}
        isDeleting={deleteMemberMutation.isPending}
      />
    </>
  )
}
