"use client"

import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react"
import { DeleteConfirmationDialog } from "@/components/dialog"
import { useDeleteUserPool } from "@/hooks/useUserPools"
import { useToast } from "@/hooks/useToast"
import type { UserPool } from "@/services/api/user-pools/types"

interface UserPoolActionsProps {
  userPool: UserPool
}

export function UserPoolActions({ userPool }: UserPoolActionsProps) {
  const { tenantId } = useParams<{ tenantId: string }>()
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const deleteUserPoolMutation = useDeleteUserPool()

  const handleViewDetails = () => {
    navigate(`/${tenantId}/user-pools/${userPool.user_pool_id}`)
  }

  const handleEdit = () => {
    navigate(`/${tenantId}/user-pools/${userPool.user_pool_id}/edit`)
  }

  const handleDelete = async () => {
    try {
      await deleteUserPoolMutation.mutateAsync(userPool.user_pool_id)
      showSuccess("User pool deleted successfully")
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

          <DropdownMenuItem onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit User Pool
          </DropdownMenuItem>

          {!userPool.is_system && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete User Pool
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

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
