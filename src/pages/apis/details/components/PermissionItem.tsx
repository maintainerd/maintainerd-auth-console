import { useState } from "react"
import { MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SystemBadge } from "@/components/badges"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DeleteConfirmationDialog } from "@/components/dialog"
import { useDeletePermission } from "@/hooks/usePermissions"
import { useToast } from "@/hooks/useToast"
import type { PermissionEntity } from "@/services/api/permission/types"

interface PermissionItemProps {
  permission: PermissionEntity
  onEdit: () => void
}

export function PermissionItem({ permission, onEdit }: PermissionItemProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const deletePermissionMutation = useDeletePermission()
  const { showSuccess, showError } = useToast()

  const handleEdit = () => {
    if (permission.is_system) return
    onEdit()
  }

  const handleDeleteClick = () => {
    if (permission.is_system) return
    setShowDeleteDialog(true)
  }

  const handleDelete = async () => {
    try {
      await deletePermissionMutation.mutateAsync(permission.permission_id)
      showSuccess("Permission deleted successfully")
    } catch (error) {
      showError(error)
    }
  }

  return (
    <>
      <div className="flex justify-between items-center p-4 border-b hover:bg-accent/50 transition-colors">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium">{permission.name}</h4>
            <SystemBadge isSystem={permission.is_default} />
          </div>
          <p className="text-sm text-muted-foreground">{permission.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={permission.status === "active" ? "secondary" : "outline"} className="capitalize">
            {permission.status}
          </Badge>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={handleEdit}
                disabled={permission.is_system}
                className={permission.is_system ? "opacity-50 cursor-not-allowed" : ""}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Permission
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleDeleteClick}
                disabled={permission.is_system}
                className={permission.is_system ? "opacity-50 cursor-not-allowed" : "text-destructive"}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Permission
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        title="Delete Permission"
        description="This action cannot be undone. This will permanently delete the permission."
        confirmationText="This will permanently delete this permission and remove it from all roles and policies."
        itemName={permission.name}
        isDeleting={deletePermissionMutation.isPending}
      />
    </>
  )
}

