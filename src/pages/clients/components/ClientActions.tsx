import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { MoreHorizontal, Eye, Edit, Trash2, Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ConfirmationDialog, DeleteConfirmationDialog } from "@/components/dialog"
import { useUpdateClientStatus, useDeleteClient } from "@/hooks/useClients"
import { useToast } from "@/hooks/useToast"
import type { ClientType, ClientStatusType } from "@/services/api/auth-client/types"

interface ClientActionsProps {
  client: ClientType
}

interface PendingStatusAction {
  status: ClientStatusType
  title: string
  description: string
}

export function ClientActions({ client }: ClientActionsProps) {
  const { tenantId } = useParams<{ tenantId: string }>()
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()
  const updateStatusMutation = useUpdateClientStatus()
  const deleteClientMutation = useDeleteClient()

  const [showStatusDialog, setShowStatusDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [pendingStatusAction, setPendingStatusAction] = useState<PendingStatusAction | null>(null)

  const handleViewDetails = () => {
    navigate(`/${tenantId}/clients/${client.client_id}`)
  }

  const handleEditClient = () => {
    navigate(`/${tenantId}/clients/${client.client_id}/edit`)
  }

  const handleStatusChange = (status: ClientStatusType, title: string, description: string) => {
    setPendingStatusAction({ status, title, description })
    setShowStatusDialog(true)
  }

  const handleConfirmStatusChange = async () => {
    if (!pendingStatusAction) return

    try {
      await updateStatusMutation.mutateAsync({
        clientId: client.client_id,
        data: { status: pendingStatusAction.status }
      })
      showSuccess(`Client status updated to ${pendingStatusAction.status}`)
    } catch (error) {
      showError(error)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteClientMutation.mutateAsync(client.client_id)
      showSuccess("Client deleted successfully")
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

          <DropdownMenuItem onClick={handleEditClient} disabled={client.is_system}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Client
          </DropdownMenuItem>

          {client.status === 'inactive' ? (
            <DropdownMenuItem
              onClick={() => handleStatusChange('active', 'Activate Client', 'Are you sure you want to activate this client? Users will be able to authenticate using this client.')}
              disabled={client.is_system}
            >
              <Play className="mr-2 h-4 w-4" />
              Activate Client
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={() => handleStatusChange('inactive', 'Deactivate Client', 'Are you sure you want to deactivate this client? Users will not be able to authenticate using this client.')}
              disabled={client.is_system}
            >
              <Pause className="mr-2 h-4 w-4" />
              Deactivate Client
            </DropdownMenuItem>
          )}

          {!client.is_system && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Client
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmationDialog
        open={showStatusDialog}
        onOpenChange={setShowStatusDialog}
        onConfirm={handleConfirmStatusChange}
        title={pendingStatusAction?.title || "Change Status"}
        description={pendingStatusAction?.description || "Are you sure you want to change the client status?"}
        confirmText="Confirm"
        cancelText="Cancel"
        variant="default"
        isLoading={updateStatusMutation.isPending}
      />

      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        title="Delete Client"
        description="This action cannot be undone. This will permanently delete the client and all associated data."
        confirmationText="This will permanently delete this client and remove all associated configurations and credentials."
        itemName={client.name}
        isDeleting={deleteClientMutation.isPending}
      />
    </>
  )
}
