import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Edit, Shield, Trash2, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useDeleteUserPool } from "@/hooks/useUserPools"
import { useToast } from "@/hooks/useToast"
import { DeleteConfirmationDialog } from "@/components/dialog"
import type { UserPoolStatus } from "@/services/api/user-pools/types"

interface UserPoolHeaderProps {
  userPool: {
    name: string
    display_name: string
    status: UserPoolStatus
    is_system: boolean
  }
  tenantId: string
  userPoolId: string
}

export function UserPoolHeader({ userPool, tenantId, userPoolId }: UserPoolHeaderProps) {
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()
  const deleteUserPoolMutation = useDeleteUserPool()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDelete = async () => {
    try {
      await deleteUserPoolMutation.mutateAsync(userPoolId)
      showSuccess("User pool deleted successfully")
      navigate(`/${tenantId}/user-pools`)
    } catch (error) {
      showError(error)
    }
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">{userPool.name}</h1>
            <Badge
              variant={userPool.status === "active" ? "secondary" : "outline"}
              className="capitalize"
            >
              {userPool.status}
            </Badge>
            {userPool.is_system && (
              <Badge variant="secondary" className="gap-1">
                <Shield className="h-3 w-3" />
                System
              </Badge>
            )}
          </div>
          {userPool.display_name && (
            <p className="text-muted-foreground">{userPool.display_name}</p>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <MoreVertical className="h-4 w-4" />
              Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate(`/${tenantId}/user-pools/${userPoolId}/edit`)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit User Pool
            </DropdownMenuItem>
            {!userPool.is_system && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete User Pool
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        title="Delete User Pool"
        description="This action cannot be undone. This will permanently delete the user pool and all associated data."
        confirmationText="This will permanently delete this user pool and everything scoped to it."
        itemName={userPool.name}
        isDeleting={deleteUserPoolMutation.isPending}
      />
    </>
  )
}
