import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, Eye, Play, Pause } from "lucide-react"
import type { IdentityProviderType, IdentityProviderStatusType } from "@/services/api/identity-provider/types"
import { useDeleteIdentityProvider, useUpdateIdentityProviderStatus } from "@/hooks/useIdentityProviders"
import { useToast } from "@/hooks/useToast"
import { DeleteConfirmationDialog, ConfirmationDialog } from "@/components/dialog"

interface IdentityProviderActionsProps {
  provider: IdentityProviderType
}

type StatusAction = {
  status: IdentityProviderStatusType
  title: string
  description: string
}

export function IdentityProviderActions({ provider }: IdentityProviderActionsProps) {
  const { tenantId } = useParams<{ tenantId: string }>()
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()
  const deleteProviderMutation = useDeleteIdentityProvider()
  const updateStatusMutation = useUpdateIdentityProviderStatus()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showStatusDialog, setShowStatusDialog] = useState(false)
  const [pendingStatusAction, setPendingStatusAction] = useState<StatusAction | null>(null)

  const handleViewDetails = () => {
    navigate(`/${tenantId}/providers/identity/${provider.identity_provider_id}`)
  }

  const handleEditProvider = () => {
    navigate(`/${tenantId}/providers/identity/${provider.identity_provider_id}/edit`)
  }

  const handleStatusChange = (status: IdentityProviderStatusType, title: string, description: string) => {
    setPendingStatusAction({ status, title, description })
    setShowStatusDialog(true)
  }

  const handleConfirmStatusChange = async () => {
    if (!pendingStatusAction) return

    try {
      await updateStatusMutation.mutateAsync({
        identityProviderId: provider.identity_provider_id,
        data: { status: pendingStatusAction.status }
      })
      showSuccess(`Identity provider status updated to ${pendingStatusAction.status}`)
    } catch (error) {
      showError(error)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteProviderMutation.mutateAsync(provider.identity_provider_id)
      showSuccess("Identity provider deleted successfully")
    } catch (error) {
      showError(error)
    }
  }

  const isActive = provider.status === "active"
  const isInactive = provider.status === "inactive"

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

          <DropdownMenuItem onClick={handleEditProvider} disabled={provider.is_system}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Provider
          </DropdownMenuItem>

          {!isActive && (
            <DropdownMenuItem onClick={() => handleStatusChange("active", "Activate Identity Provider", "Are you sure you want to activate this identity provider?")} disabled={provider.is_system}>
              <Play className="mr-2 h-4 w-4" />
              Activate Provider
            </DropdownMenuItem>
          )}

          {!isInactive && (
            <DropdownMenuItem onClick={() => handleStatusChange("inactive", "Deactivate Identity Provider", "Are you sure you want to deactivate this identity provider?")} disabled={provider.is_system}>
              <Pause className="mr-2 h-4 w-4" />
              Deactivate Provider
            </DropdownMenuItem>
          )}

          {!provider.is_system && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Provider
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        title="Delete Identity Provider"
        description="This action cannot be undone. This will permanently delete the identity provider and all associated data."
        confirmationText="This will permanently delete this identity provider and remove all associated configurations."
        itemName={provider.name}
        isDeleting={deleteProviderMutation.isPending}
      />

      <ConfirmationDialog
        open={showStatusDialog}
        onOpenChange={setShowStatusDialog}
        onConfirm={handleConfirmStatusChange}
        title={pendingStatusAction?.title || "Change Status"}
        description={pendingStatusAction?.description || "Are you sure you want to change the identity provider status?"}
        confirmText="Confirm"
        cancelText="Cancel"
        variant="default"
        isLoading={updateStatusMutation.isPending}
      />
    </>
  )
}
