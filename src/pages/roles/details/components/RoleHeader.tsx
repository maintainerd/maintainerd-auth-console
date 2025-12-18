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
import { useDeleteRole } from "@/hooks/useRoles"
import { useToast } from "@/hooks/useToast"
import { DeleteConfirmationDialog } from "@/components/dialog"
import type { RoleStatusType } from "@/services/api/role/types"

interface RoleHeaderProps {
  role: {
    name: string
    description: string
    status: RoleStatusType
    is_system: boolean
    is_default: boolean
  }
  tenantId: string
  roleId: string
  getStatusColor: (status: RoleStatusType) => string
  getStatusText: (status: RoleStatusType) => string
}

export function RoleHeader({ role, tenantId, roleId, getStatusColor, getStatusText }: RoleHeaderProps) {
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()
  const deleteRoleMutation = useDeleteRole()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDelete = async () => {
    try {
      await deleteRoleMutation.mutateAsync(roleId)
      showSuccess("Role deleted successfully")
      // Navigate back to Roles list
      navigate(`/${tenantId}/roles`)
    } catch (error) {
      showError(error)
    }
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">{role.name}</h1>
            <Badge className={getStatusColor(role.status)}>
              {getStatusText(role.status)}
            </Badge>
            {role.is_system && (
              <Badge variant="secondary" className="gap-1">
                <Shield className="h-3 w-3" />
                System
              </Badge>
            )}
            {role.is_default && (
              <Badge variant="outline" className="text-xs">
                Default
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">{role.description}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <MoreVertical className="h-4 w-4" />
              Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate(`/${tenantId}/roles/${roleId}/edit`)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Role
            </DropdownMenuItem>
            {!role.is_system && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Role
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
        title="Delete Role"
        description="This action cannot be undone. This will permanently delete the role and all associated data."
        confirmationText="This will permanently delete this role and remove all user associations."
        itemName={role.name}
        isDeleting={deleteRoleMutation.isPending}
      />
    </>
  )
}
