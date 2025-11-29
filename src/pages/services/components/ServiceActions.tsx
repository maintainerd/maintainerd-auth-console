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
  Pause,
  Archive,
  XCircle
} from "lucide-react"
import type { ServiceType, ServiceStatusType } from "@/services/api/service/types"
import { useDeleteService, useUpdateServiceStatus } from "@/hooks/useServices"
import { useToast } from "@/hooks/useToast"
import { DeleteConfirmationDialog, ConfirmationDialog } from "@/components/dialog"

interface ServiceActionsProps {
  service: ServiceType
}

type StatusAction = {
  status: ServiceStatusType
  title: string
  description: string
}

export function ServiceActions({ service }: ServiceActionsProps) {
  const { tenantId } = useParams<{ tenantId: string }>()
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()
  const deleteServiceMutation = useDeleteService()
  const updateStatusMutation = useUpdateServiceStatus()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showStatusDialog, setShowStatusDialog] = useState(false)
  const [pendingStatusAction, setPendingStatusAction] = useState<StatusAction | null>(null)

  const isActive = service.status === "active"
  const isMaintenance = service.status === "maintenance"
  const isDeprecated = service.status === "deprecated"
  const isInactive = service.status === "inactive"

  // Action handlers
  const handleViewDetails = () => {
    navigate(`/${tenantId}/services/${service.service_id}`)
  }

  const handleUpdateService = () => {
    navigate(`/${tenantId}/services/${service.service_id}/edit`)
  }

  const handleStatusChange = (status: ServiceStatusType, title: string, description: string) => {
    setPendingStatusAction({ status, title, description })
    setShowStatusDialog(true)
  }

  const handleConfirmStatusChange = async () => {
    if (!pendingStatusAction) return

    try {
      await updateStatusMutation.mutateAsync({
        serviceId: service.service_id,
        data: { status: pendingStatusAction.status }
      })
      showSuccess(`Service status updated to ${pendingStatusAction.status}`)
    } catch (error) {
      showError(error)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteServiceMutation.mutateAsync(service.service_id)
      showSuccess("Service deleted successfully")
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

          <DropdownMenuItem onClick={handleUpdateService}>
            <Edit className="mr-2 h-4 w-4" />
            Update Service
          </DropdownMenuItem>

          {!isActive && (
            <DropdownMenuItem onClick={() => handleStatusChange("active", "Activate Service", "Are you sure you want to activate this service?")}>
              <Play className="mr-2 h-4 w-4" />
              Activate Service
            </DropdownMenuItem>
          )}

          {!isMaintenance && (
            <DropdownMenuItem onClick={() => handleStatusChange("maintenance", "Set Maintenance Mode", "Are you sure you want to set this service to maintenance mode?")}>
              <Pause className="mr-2 h-4 w-4" />
              Set Maintenance
            </DropdownMenuItem>
          )}

          {!isDeprecated && (
            <DropdownMenuItem onClick={() => handleStatusChange("deprecated", "Deprecate Service", "Are you sure you want to deprecate this service?")}>
              <Archive className="mr-2 h-4 w-4" />
              Deprecate Service
            </DropdownMenuItem>
          )}

          {!isInactive && (
            <DropdownMenuItem onClick={() => handleStatusChange("inactive", "Deactivate Service", "Are you sure you want to deactivate this service?")}>
              <XCircle className="mr-2 h-4 w-4" />
              Deactivate Service
            </DropdownMenuItem>
          )}

          {!service.is_system && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Service
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        title="Delete Service"
        description="This action cannot be undone. This will permanently delete the service and all associated data."
        confirmationText="This will permanently delete this service and remove all associated APIs, policies, and configurations."
        itemName={service.name}
        isDeleting={deleteServiceMutation.isPending}
      />

      <ConfirmationDialog
        open={showStatusDialog}
        onOpenChange={setShowStatusDialog}
        onConfirm={handleConfirmStatusChange}
        title={pendingStatusAction?.title || "Change Status"}
        description={pendingStatusAction?.description || "Are you sure you want to change the service status?"}
        confirmText="Confirm"
        cancelText="Cancel"
        variant="default"
        isLoading={updateStatusMutation.isPending}
      />
    </>
  )
}
