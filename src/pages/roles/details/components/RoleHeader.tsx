import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Edit, Trash2, MoreVertical, Shield, CalendarDays } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DeleteConfirmationDialog } from "@/components/dialog"
import { DetailHeaderCard, StatusBadge, type DetailAttribute } from "@/components/details"
import { useDeleteRole } from "@/hooks/useRoles"
import { useToast } from "@/hooks/useToast"
import { format } from "date-fns"
import type { Role } from "@/services/api/roles/types"

interface RoleHeaderProps {
  role: Role
  tenantId: string
  roleId: string
}

export function RoleHeader({ role, tenantId, roleId }: RoleHeaderProps) {
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()
  const deleteRoleMutation = useDeleteRole()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDelete = async () => {
    try {
      await deleteRoleMutation.mutateAsync(roleId)
      showSuccess("Role deleted successfully")
      navigate(`/${tenantId}/roles`)
    } catch (error) {
      showError(error)
    }
  }

  const attributes: DetailAttribute[] = [
    {
      icon: Shield,
      label: "Type",
      value: role.is_system ? "System Role" : "Custom Role",
    },
    ...(role.is_default
      ? [{ icon: Shield, label: "Default", value: "Default role assigned to new users" } satisfies DetailAttribute]
      : []),
    {
      icon: CalendarDays,
      label: "Created",
      value: format(new Date(role.created_at), "PP"),
    },
    {
      icon: CalendarDays,
      label: "Last updated",
      value: format(new Date(role.updated_at), "PP"),
    },
  ]

  return (
    <>
      <DetailHeaderCard
        leading={
          <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
            <Shield className="size-6" />
          </div>
        }
        title={role.name}
        badge={<StatusBadge status={role.status} />}
        subtitle={role.description}
        attributes={attributes}
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-2"
              onClick={() =>
                navigate(`/${tenantId}/roles/${roleId}/edit`, {
                  state: { from: `/${tenantId}/roles/${roleId}`, backLabel: "Back to Role Details" },
                })
              }
            >
              <Edit className="size-4" />
              Edit
            </Button>
            {!role.is_system && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                    <span className="sr-only">Open actions</span>
                    <MoreVertical className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 size-4" />
                    Delete Role
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </>
        }
      />

      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        title="Delete Role"
        description="This action cannot be undone. This will permanently delete the role and all associated data."
        itemName={role.name}
        isDeleting={deleteRoleMutation.isPending}
      />
    </>
  )
}
