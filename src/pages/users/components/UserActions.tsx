import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { MoreHorizontal, Eye, Edit, Trash2, Play, Pause, Ban } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ConfirmationDialog, DeleteConfirmationDialog } from "@/components/dialog"
import { useUpdateUserStatus, useDeleteUser } from "@/hooks/useUsers"
import { useToast } from "@/hooks/useToast"
import type { UserType, UserStatusType } from "@/services/api/user/types"

interface UserActionsProps {
  user: UserType
}

interface PendingStatusAction {
  status: UserStatusType
  title: string
  description: string
}

export function UserActions({ user }: UserActionsProps) {
  const { tenantId } = useParams<{ tenantId: string }>()
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()
  const updateStatusMutation = useUpdateUserStatus()
  const deleteUserMutation = useDeleteUser()

  const [showStatusDialog, setShowStatusDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [pendingStatusAction, setPendingStatusAction] = useState<PendingStatusAction | null>(null)

  const handleViewDetails = () => {
    navigate(`/${tenantId}/users/${user.user_id}`)
  }

  const handleEditUser = () => {
    navigate(`/${tenantId}/users/${user.user_id}/edit`)
  }

  const handleStatusChange = (status: UserStatusType, title: string, description: string) => {
    setPendingStatusAction({ status, title, description })
    setShowStatusDialog(true)
  }

  const handleConfirmStatusChange = async () => {
    if (!pendingStatusAction) return

    try {
      await updateStatusMutation.mutateAsync({
        userId: user.user_id,
        data: { status: pendingStatusAction.status }
      })
      showSuccess(`User status updated to ${pendingStatusAction.status}`)
    } catch (error) {
      showError(error)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteUserMutation.mutateAsync(user.user_id)
      showSuccess("User deleted successfully")
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

          <DropdownMenuItem onClick={handleEditUser}>
            <Edit className="mr-2 h-4 w-4" />
            Edit User
          </DropdownMenuItem>

          {user.status === 'inactive' ? (
            <DropdownMenuItem
              onClick={() => handleStatusChange('active', 'Activate User', 'Are you sure you want to activate this user? They will be able to sign in and access the system.')}
            >
              <Play className="mr-2 h-4 w-4" />
              Activate User
            </DropdownMenuItem>
          ) : user.status === 'active' ? (
            <>
              <DropdownMenuItem
                onClick={() => handleStatusChange('inactive', 'Deactivate User', 'Are you sure you want to deactivate this user? They will no longer be able to sign in.')}
              >
                <Pause className="mr-2 h-4 w-4" />
                Deactivate User
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusChange('suspended', 'Suspend User', 'Are you sure you want to suspend this user? This is typically used for security concerns or policy violations. They will be immediately logged out and cannot sign in.')}
              >
                <Ban className="mr-2 h-4 w-4" />
                Suspend User
              </DropdownMenuItem>
            </>
          ) : user.status === 'suspended' ? (
            <DropdownMenuItem
              onClick={() => handleStatusChange('active', 'Activate User', 'Are you sure you want to activate this suspended user? They will be able to sign in again.')}
            >
              <Play className="mr-2 h-4 w-4" />
              Activate User
            </DropdownMenuItem>
          ) : user.status === 'pending' ? (
            <DropdownMenuItem
              onClick={() => handleStatusChange('active', 'Activate User', 'Are you sure you want to activate this pending user? They will be able to sign in and access the system.')}
            >
              <Play className="mr-2 h-4 w-4" />
              Activate User
            </DropdownMenuItem>
          ) : null}

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmationDialog
        open={showStatusDialog}
        onOpenChange={setShowStatusDialog}
        onConfirm={handleConfirmStatusChange}
        title={pendingStatusAction?.title || "Change Status"}
        description={pendingStatusAction?.description || "Are you sure you want to change the user status?"}
        confirmText="Confirm"
        cancelText="Cancel"
        variant="default"
        isLoading={updateStatusMutation.isPending}
      />

      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        title="Delete User"
        description="This action cannot be undone. This will permanently delete the user account and all associated data."
        confirmationText="This will permanently delete this user account, including their profile, authentication data, and activity history."
        itemName={user.fullname || user.username}
        isDeleting={deleteUserMutation.isPending}
      />
    </>
  )
}
