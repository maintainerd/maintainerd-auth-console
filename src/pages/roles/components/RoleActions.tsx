"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useNavigate, useParams } from "react-router-dom"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Play,
  Pause
} from "lucide-react"
import { DeleteConfirmationDialog, ConfirmationDialog } from "@/components/dialog"
import { useDeleteRole, useUpdateRoleStatus } from "@/hooks/useRoles"
import { useToast } from "@/hooks/useToast"
import type { RoleType, RoleStatusType } from "@/services/api/role/types"

interface RoleActionsProps {
  role: RoleType
}

type StatusAction = {
  status: RoleStatusType
  title: string
  description: string
}

export function RoleActions({ role }: RoleActionsProps) {
  const { tenantId } = useParams<{ tenantId: string }>()
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showStatusDialog, setShowStatusDialog] = useState(false)
  const [pendingStatusAction, setPendingStatusAction] = useState<StatusAction | null>(null)

  const deleteRoleMutation = useDeleteRole()
  const updateRoleStatusMutation = useUpdateRoleStatus()

  const isActive = role.status === "active"
  const isInactive = role.status === "inactive"

  // Action handlers
  const handleViewDetails = () => {
    navigate(`/${tenantId}/roles/${role.role_id}`)
  }

  const handleUpdateRole = () => {
    navigate(`/${tenantId}/roles/${role.role_id}/edit`)
  }

  const handleStatusChange = (status: RoleStatusType, title: string, description: string) => {
    setPendingStatusAction({ status, title, description })
    setShowStatusDialog(true)
  }

  const handleConfirmStatusChange = async () => {
    if (!pendingStatusAction) return

    try {
      await updateRoleStatusMutation.mutateAsync({
        roleId: role.role_id,
        data: { status: pendingStatusAction.status }
      })
      showSuccess(`Role status updated to ${pendingStatusAction.status}`)
    } catch (error) {
      showError(error)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteRoleMutation.mutateAsync(role.role_id)
      showSuccess("Role deleted successfully")
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
          <DropdownMenuItem onClick={handleViewDetails}>
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleUpdateRole}>
            <Edit className="mr-2 h-4 w-4" />
            Update Role
          </DropdownMenuItem>

          {!isActive && (
            <DropdownMenuItem onClick={() => handleStatusChange("active", "Activate Role", "Are you sure you want to activate this role?")}>
              <Play className="mr-2 h-4 w-4" />
              Activate Role
            </DropdownMenuItem>
          )}

          {!isInactive && (
            <DropdownMenuItem onClick={() => handleStatusChange("inactive", "Deactivate Role", "Are you sure you want to deactivate this role?")}>
              <Pause className="mr-2 h-4 w-4" />
              Deactivate Role
            </DropdownMenuItem>
          )}

          {!role.is_system && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Role
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        title="Delete Role"
        description="This action cannot be undone. This will permanently delete the role and all associated data."
        confirmationText="This will permanently delete this role and remove all user associations."
        itemName={role.name}
        isDeleting={deleteRoleMutation.isPending}
      />

      <ConfirmationDialog
        open={showStatusDialog}
        onOpenChange={setShowStatusDialog}
        onConfirm={handleConfirmStatusChange}
        title={pendingStatusAction?.title || "Change Status"}
        description={pendingStatusAction?.description || "Are you sure you want to change the role status?"}
        confirmText={pendingStatusAction?.status === "active" ? "Activate" : "Deactivate"}
        isLoading={updateRoleStatusMutation.isPending}
      />
    </>
  )
}
