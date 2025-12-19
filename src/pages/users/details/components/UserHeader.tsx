import { useState } from "react"
import { Edit, Trash2, MoreVertical } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DeleteConfirmationDialog } from "@/components/dialog"
import { useDeleteUser } from "@/hooks/useUsers"
import { useToast } from "@/hooks/useToast"
import type { UserType } from "@/services/api/user/types"

interface UserHeaderProps {
  user: UserType
  tenantId: string
  userId: string
}

export function UserHeader({ user, tenantId, userId }: UserHeaderProps) {
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()
  const deleteUserMutation = useDeleteUser()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDelete = async () => {
    try {
      await deleteUserMutation.mutateAsync(userId)
      showSuccess("User deleted successfully")
      // Navigate back to Users list
      navigate(`/${tenantId}/users`)
    } catch (error) {
      showError(error)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { className: string }> = {
      active: { className: "bg-green-100 text-green-800 border-green-200" },
      inactive: { className: "bg-gray-100 text-gray-800 border-gray-200" },
      pending: { className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
      suspended: { className: "bg-red-100 text-red-800 border-red-200" },
    }

    const config = statusConfig[status] || statusConfig.inactive

    return (
      <Badge variant="outline" className={config.className}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  return (
    <>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage 
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`} 
              alt={user.fullname || user.username} 
            />
            <AvatarFallback className="text-lg">
              {user.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight">
                {user.fullname || user.username}
              </h1>
              {getStatusBadge(user.status)}
            </div>
            <p className="text-sm text-muted-foreground">
              @{user.username}
            </p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <MoreVertical className="h-4 w-4" />
              Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate(`/${tenantId}/users/${userId}/edit`)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit User
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone."
        itemName={user.fullname || user.username}
        confirmationText="DELETE"
        isDeleting={deleteUserMutation.isPending}
      />
    </>
  )
}
