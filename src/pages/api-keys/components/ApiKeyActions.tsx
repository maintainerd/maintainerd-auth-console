import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { MoreHorizontal, Eye, Edit, Play, Pause, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ConfirmationDialog, DeleteConfirmationDialog } from "@/components/dialog"
import { useUpdateApiKeyStatus, useDeleteApiKey } from "@/hooks/useApiKeys"
import { useToast } from "@/hooks/useToast"
import type { ApiKeyType } from "@/services/api/api-key/types"

interface ApiKeyActionsProps {
  apiKey: ApiKeyType
}

type ApiKeyUpdatableStatus = 'active' | 'inactive'

interface PendingStatusAction {
  status: ApiKeyUpdatableStatus
  title: string
  description: string
}

export function ApiKeyActions({ apiKey }: ApiKeyActionsProps) {
  const { tenantId } = useParams<{ tenantId: string }>()
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()
  const updateStatusMutation = useUpdateApiKeyStatus()
  const deleteApiKeyMutation = useDeleteApiKey()

  const [showStatusDialog, setShowStatusDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [pendingStatusAction, setPendingStatusAction] = useState<PendingStatusAction | null>(null)

  const handleViewDetails = () => {
    navigate(`/${tenantId}/api-keys/${apiKey.api_key_id}`)
  }

  const handleEditApiKey = () => {
    navigate(`/${tenantId}/api-keys/${apiKey.api_key_id}/edit`)
  }

  const handleStatusChange = (status: ApiKeyUpdatableStatus, title: string, description: string) => {
    setPendingStatusAction({ status, title, description })
    setShowStatusDialog(true)
  }

  const handleConfirmStatusChange = async () => {
    if (!pendingStatusAction) return

    try {
      await updateStatusMutation.mutateAsync({
        apiKeyId: apiKey.api_key_id,
        data: { status: pendingStatusAction.status }
      })
      showSuccess(`API key status updated to ${pendingStatusAction.status}`)
    } catch (error) {
      showError(error)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteApiKeyMutation.mutateAsync(apiKey.api_key_id)
      showSuccess("API key deleted successfully")
    } catch (error) {
      showError(error)
    }
  }

  const isExpired = apiKey.status === "expired"

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

          <DropdownMenuItem onClick={handleEditApiKey} disabled={isExpired}>
            <Edit className="mr-2 h-4 w-4" />
            Edit API Key
          </DropdownMenuItem>

          {apiKey.status === 'inactive' ? (
            <DropdownMenuItem
              onClick={() => handleStatusChange('active', 'Activate API Key', 'Are you sure you want to activate this API key? It will be able to access the configured APIs and permissions.')}
              disabled={isExpired}
            >
              <Play className="mr-2 h-4 w-4" />
              Activate API Key
            </DropdownMenuItem>
          ) : apiKey.status === 'active' ? (
            <DropdownMenuItem
              onClick={() => handleStatusChange('inactive', 'Deactivate API Key', 'Are you sure you want to deactivate this API key? It will no longer be able to access any APIs.')}
            >
              <Pause className="mr-2 h-4 w-4" />
              Deactivate API Key
            </DropdownMenuItem>
          ) : null}

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete API Key
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmationDialog
        open={showStatusDialog}
        onOpenChange={setShowStatusDialog}
        onConfirm={handleConfirmStatusChange}
        title={pendingStatusAction?.title || "Change Status"}
        description={pendingStatusAction?.description || "Are you sure you want to change the API key status?"}
        confirmText="Confirm"
        cancelText="Cancel"
        variant="default"
        isLoading={updateStatusMutation.isPending}
      />

      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        title="Delete API Key"
        description="This action cannot be undone. This will permanently delete the API key and all associated data."
        confirmationText="This will permanently delete this API key and remove all associated configurations and access permissions."
        itemName={apiKey.name}
        isDeleting={deleteApiKeyMutation.isPending}
      />
    </>
  )
}
