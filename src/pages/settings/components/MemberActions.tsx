"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  MoreHorizontal,
  Shield,
  Trash2
} from "lucide-react"
import { DeleteConfirmationDialog } from "@/components/dialog"
import { useDeleteTenantMember } from "@/hooks/useTenantMembers"
import { useToast } from "@/hooks/useToast"
import { useAppSelector } from '@/store/hooks'
import type { TenantMember } from "@/services/api/tenant/members"
import { UpdateMemberRoleDialog } from "@/pages/settings/components/UpdateMemberRoleDialog"

interface MemberActionsProps {
  member: TenantMember
}

export function MemberActions({ member }: MemberActionsProps) {
  const currentTenant = useAppSelector((state) => state.tenant.currentTenant)
  const tenantId = currentTenant?.tenant_id || ''
  const { showSuccess, showError } = useToast()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showUpdateRoleDialog, setShowUpdateRoleDialog] = useState(false)

  const deleteMemberMutation = useDeleteTenantMember(tenantId)

  const handleUpdateRole = () => {
    setShowUpdateRoleDialog(true)
  }

  const handleDelete = async () => {
    try {
      await deleteMemberMutation.mutateAsync(member.tenant_user_id)
      showSuccess("Member removed successfully")
    } catch (error) {
      showError(error)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleUpdateRole}>
            <Shield className="mr-2 h-4 w-4" />
            Update Role
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Remove Member
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        title="Remove Member"
        description={`Are you sure you want to remove ${member.user.fullname} from this tenant? This action cannot be undone.`}
        confirmationText="DELETE"
        itemName="DELETE"
        isDeleting={deleteMemberMutation.isPending}
      />

      <UpdateMemberRoleDialog
        open={showUpdateRoleDialog}
        onOpenChange={setShowUpdateRoleDialog}
        member={member}
      />
    </>
  )
}
