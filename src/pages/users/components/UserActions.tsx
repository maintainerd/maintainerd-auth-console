import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { MoreHorizontal, Eye, Edit, Trash2, Play, Pause, Ban, type LucideIcon } from "lucide-react"
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
import type { User, UserStatus } from "@/services/api/users/types"

interface UserActionsProps {
  user: User
}

interface StatusAction {
  status: UserStatus
  label: string
  title: string
  description: string
  icon: LucideIcon
}

// Available status transitions per current status (exhaustive over UserStatus).
const STATUS_ACTIONS: Record<UserStatus, StatusAction[]> = {
  inactive: [
    {
      status: "active",
      label: "Activate User",
      title: "Activate User",
      description:
        "Are you sure you want to activate this user? They will be able to sign in and access the system.",
      icon: Play,
    },
  ],
  active: [
    {
      status: "inactive",
      label: "Deactivate User",
      title: "Deactivate User",
      description: "Are you sure you want to deactivate this user? They will no longer be able to sign in.",
      icon: Pause,
    },
    {
      status: "suspended",
      label: "Suspend User",
      title: "Suspend User",
      description:
        "Are you sure you want to suspend this user? This is typically used for security concerns or policy violations. They will be immediately logged out and cannot sign in.",
      icon: Ban,
    },
  ],
  suspended: [
    {
      status: "active",
      label: "Activate User",
      title: "Activate User",
      description: "Are you sure you want to activate this suspended user? They will be able to sign in again.",
      icon: Play,
    },
  ],
  pending: [
    {
      status: "active",
      label: "Activate User",
      title: "Activate User",
      description:
        "Are you sure you want to activate this pending user? They will be able to sign in and access the system.",
      icon: Play,
    },
  ],
}

export function UserActions({ user }: UserActionsProps) {
  const { tenantId } = useParams<{ tenantId: string }>()
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()
  const updateStatusMutation = useUpdateUserStatus()
  const deleteUserMutation = useDeleteUser()

  const [showStatusDialog, setShowStatusDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [pendingStatusAction, setPendingStatusAction] = useState<StatusAction | null>(null)

  const handleViewDetails = () => {
    navigate(`/${tenantId}/users/${user.user_id}`)
  }

  const handleEditUser = () => {
    navigate(`/${tenantId}/users/${user.user_id}/edit`)
  }

  const openStatusDialog = (action: StatusAction) => {
    setPendingStatusAction(action)
    setShowStatusDialog(true)
  }

  const handleConfirmStatusChange = async (action: StatusAction) => {
    try {
      await updateStatusMutation.mutateAsync({ userId: user.user_id, data: { status: action.status } })
      showSuccess(`User status updated to ${action.status}`)
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

          {STATUS_ACTIONS[user.status].map((action) => (
            <DropdownMenuItem key={action.label} onClick={() => openStatusDialog(action)}>
              <action.icon className="mr-2 h-4 w-4" />
              {action.label}
            </DropdownMenuItem>
          ))}

          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {pendingStatusAction && (
        <ConfirmationDialog
          open={showStatusDialog}
          onOpenChange={setShowStatusDialog}
          onConfirm={() => handleConfirmStatusChange(pendingStatusAction)}
          title={pendingStatusAction.title}
          description={pendingStatusAction.description}
          confirmText="Confirm"
          cancelText="Cancel"
          variant="default"
          isLoading={updateStatusMutation.isPending}
        />
      )}

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
