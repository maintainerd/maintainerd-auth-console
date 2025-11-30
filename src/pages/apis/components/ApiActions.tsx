import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useNavigate, useParams } from "react-router-dom"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Play,
  Pause
} from "lucide-react"
import { DeleteConfirmationDialog, ConfirmationDialog } from "@/components/dialog"
import { useDeleteApi, useUpdateApiStatus } from "@/hooks/useApis"
import { useToast } from "@/hooks/useToast"
import type { ApiType, ApiStatusType } from "@/services/api/api/types"

interface ApiActionsProps {
  api: ApiType
}

type StatusAction = {
  status: ApiStatusType
  title: string
  description: string
}

export function ApiActions({ api }: ApiActionsProps) {
  const { tenantId } = useParams<{ tenantId: string }>()
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showStatusDialog, setShowStatusDialog] = useState(false)
  const [pendingStatusAction, setPendingStatusAction] = useState<StatusAction | null>(null)

  const deleteApiMutation = useDeleteApi()
  const updateApiStatusMutation = useUpdateApiStatus()

  const isActive = api.status === "active"
  const isInactive = api.status === "inactive"

  // Action handlers
  const handleViewDetails = () => {
    navigate(`/${tenantId}/apis/${api.api_id}`)
  }

  const handleUpdateApi = () => {
    navigate(`/${tenantId}/apis/${api.api_id}/edit`)
  }

  const handleStatusChange = (status: ApiStatusType, title: string, description: string) => {
    setPendingStatusAction({ status, title, description })
    setShowStatusDialog(true)
  }

  const handleConfirmStatusChange = async () => {
    if (!pendingStatusAction) return

    try {
      await updateApiStatusMutation.mutateAsync({
        apiId: api.api_id,
        data: { status: pendingStatusAction.status }
      })
      showSuccess(`API status updated to ${pendingStatusAction.status}`)
    } catch (error) {
      showError(error)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteApiMutation.mutateAsync(api.api_id)
      showSuccess("API deleted successfully")
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

          <DropdownMenuItem onClick={handleUpdateApi}>
            <Edit className="mr-2 h-4 w-4" />
            Update API
          </DropdownMenuItem>

          {!isActive && (
            <DropdownMenuItem onClick={() => handleStatusChange("active", "Activate API", "Are you sure you want to activate this API?")}>
              <Play className="mr-2 h-4 w-4" />
              Activate API
            </DropdownMenuItem>
          )}

          {!isInactive && (
            <DropdownMenuItem onClick={() => handleStatusChange("inactive", "Deactivate API", "Are you sure you want to deactivate this API?")}>
              <Pause className="mr-2 h-4 w-4" />
              Deactivate API
            </DropdownMenuItem>
          )}

          {!api.is_default && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete API
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        title="Delete API"
        description="This action cannot be undone. This will permanently delete the API and all associated data."
        confirmationText="This will permanently delete this API and remove all associated permissions and configurations."
        itemName={api.name}
        isDeleting={deleteApiMutation.isPending}
      />

      <ConfirmationDialog
        open={showStatusDialog}
        onOpenChange={setShowStatusDialog}
        onConfirm={handleConfirmStatusChange}
        title={pendingStatusAction?.title || "Change Status"}
        description={pendingStatusAction?.description || "Are you sure you want to change the API status?"}
        confirmText="Confirm"
        cancelText="Cancel"
        variant="default"
        isLoading={updateApiStatusMutation.isPending}
      />
    </>
  )
}
