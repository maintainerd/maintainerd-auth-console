"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  MoreHorizontal,
  Trash2,
  ArrowRightLeft
} from "lucide-react"
import { DeleteConfirmationDialog } from "@/components/dialog"
import { TransferOwnershipDialog } from "./TransferOwnershipDialog"
import { useDeleteTenantMember } from "@/hooks/useTenantMembers"
import { useToast } from "@/hooks/useToast"
import { useAppSelector } from '@/store/hooks'
import type { TenantMember } from "@/services/api/tenants/members"

interface MemberActionsProps {
  member: TenantMember
}

export function MemberActions({ member }: MemberActionsProps) {
  const currentTenant = useAppSelector((state) => state.tenant.currentTenant)
  const tenantId = currentTenant?.tenant_id || ''
  const isSystemTenant = currentTenant?.is_system ?? false
  const { showSuccess, showError } = useToast()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showTransferDialog, setShowTransferDialog] = useState(false)

  const deleteMemberMutation = useDeleteTenantMember(tenantId)

  const isOwner = member.role === 'owner'
  const isProtectedOwner = isSystemTenant && isOwner

  const handleDelete = async () => {
    try {
      await deleteMemberMutation.mutateAsync(member.tenant_member_id)
      showSuccess("Member removed successfully")
    } catch (error) {
      showError(error)
    }
  }

  if (isProtectedOwner) {
    return null
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
          {isOwner && (
            <DropdownMenuItem onClick={() => setShowTransferDialog(true)}>
              <ArrowRightLeft className="mr-2 h-4 w-4" />
              Transfer Ownership
            </DropdownMenuItem>
          )}
          {!isOwner && (
            <DropdownMenuItem
              onClick={() => setShowDeleteDialog(true)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remove Member
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {!isOwner && (
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
      )}

      {isOwner && (
        <TransferOwnershipDialog
          open={showTransferDialog}
          onOpenChange={setShowTransferDialog}
          tenantId={tenantId}
          currentOwner={member}
        />
      )}
    </>
  )
}
