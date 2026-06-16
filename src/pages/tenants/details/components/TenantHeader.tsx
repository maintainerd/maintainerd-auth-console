import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Building2, CalendarDays, Edit, Globe, Hash, Lock, MoreVertical, Trash2, User } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useDeleteTenant } from "@/hooks/useTenants"
import { useToast } from "@/hooks/useToast"
import { DeleteConfirmationDialog } from "@/components/dialog"
import { DetailHeaderCard, StatusBadge, type DetailAttribute } from "@/components/details"
import type { TenantEntity } from "@/services/api/tenants/types"

interface TenantHeaderProps {
  tenant: TenantEntity
  tenantId: string
}

export function TenantHeader({ tenant, tenantId }: TenantHeaderProps) {
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()
  const deleteTenantMutation = useDeleteTenant()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDelete = async () => {
    try {
      await deleteTenantMutation.mutateAsync(tenant.tenant_id)
      showSuccess("Tenant deleted successfully")
      navigate(`/${tenantId}/tenants`)
    } catch (error) {
      showError(error)
    }
  }

  const attributes: DetailAttribute[] = [
    {
      icon: Hash,
      label: "Name",
      value: <span className="font-mono text-xs">{tenant.name}</span>,
    },
    {
      icon: Building2,
      label: "Identifier",
      value: <span className="font-mono text-xs">{tenant.identifier}</span>,
    },
    {
      icon: User,
      label: "Description",
      value: tenant.description || <span className="text-muted-foreground">—</span>,
    },
    {
      icon: tenant.is_public ? Globe : Lock,
      label: "Visibility",
      value: tenant.is_public ? "Public" : "Private",
    },
    {
      icon: CalendarDays,
      label: "Created",
      value: format(new Date(tenant.created_at), "PP"),
    },
    {
      icon: CalendarDays,
      label: "Last updated",
      value: format(new Date(tenant.updated_at), "PP"),
    },
  ]

  return (
    <>
      <DetailHeaderCard
        leading={
          <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
            <Building2 className="size-6" />
          </div>
        }
        title={tenant.display_name}
        badge={
          <div className="flex items-center gap-2">
            <StatusBadge status={tenant.status} />
            {tenant.is_system && (
              <Badge variant="secondary" className="text-xs">
                System
              </Badge>
            )}
            {tenant.is_default && (
              <Badge variant="outline" className="text-xs">
                Default
              </Badge>
            )}
          </div>
        }
        subtitle={
          <span className="font-mono text-xs text-muted-foreground">
            {tenant.identifier}
          </span>
        }
        attributes={attributes}
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-2"
              onClick={() =>
                navigate(`/${tenantId}/tenants/${tenant.tenant_id}/edit`, {
                  state: {
                    from: `/${tenantId}/tenants/${tenant.tenant_id}`,
                    backLabel: "Back to Tenant Details",
                  },
                })
              }
            >
              <Edit className="size-4" />
              Edit
            </Button>
            {!tenant.is_system && (
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
                    Delete Tenant
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
        title="Delete Tenant"
        description="This action cannot be undone. This will permanently delete the tenant and all associated users, roles, and configuration."
        itemName={tenant.display_name}
        isDeleting={deleteTenantMutation.isPending}
      />
    </>
  )
}
