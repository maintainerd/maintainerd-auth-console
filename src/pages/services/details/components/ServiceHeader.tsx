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
import { useDeleteService } from "@/hooks/useServices"
import { useToast } from "@/hooks/useToast"
import { DeleteConfirmationDialog } from "@/components/dialog"

interface ServiceHeaderProps {
  service: {
    name: string
    displayName: string
    description: string
    status: string
    isSystem: boolean
  }
  tenantId: string
  serviceId: string
  getStatusColor: (status: string) => string
  getStatusText: (status: string) => string
}

export function ServiceHeader({ service, tenantId, serviceId, getStatusColor, getStatusText }: ServiceHeaderProps) {
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()
  const deleteServiceMutation = useDeleteService()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDelete = async () => {
    try {
      await deleteServiceMutation.mutateAsync(serviceId)
      showSuccess("Service deleted successfully")
      // Navigate back to services list
      navigate(`/${tenantId}/services`)
    } catch (error) {
      showError(error)
    }
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">{service.displayName}</h1>
            <Badge className={getStatusColor(service.status)}>
              {getStatusText(service.status)}
            </Badge>
            {service.isSystem && (
              <Badge variant="secondary" className="gap-1">
                <Shield className="h-3 w-3" />
                System
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">{service.description}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <MoreVertical className="h-4 w-4" />
              Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate(`/${tenantId}/services/${serviceId}/edit`)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Service
            </DropdownMenuItem>
            {!service.isSystem && (
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
      </div>

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
    </>
  )
}

