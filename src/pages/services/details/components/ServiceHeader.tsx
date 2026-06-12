import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Edit, Trash2, MoreVertical, Server, CalendarDays } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DeleteConfirmationDialog } from "@/components/dialog"
import { DetailHeaderCard, StatusBadge, type DetailAttribute } from "@/components/details"
import { SystemBadge } from "@/components/badges"
import { useDeleteService } from "@/hooks/useServices"
import { useToast } from "@/hooks/useToast"
import type { ServiceResponse } from "@/services/api/services/types"

interface ServiceHeaderProps {
  service: ServiceResponse
  tenantId: string
  serviceId: string
}

export function ServiceHeader({ service, tenantId, serviceId }: ServiceHeaderProps) {
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()
  const deleteServiceMutation = useDeleteService()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDelete = async () => {
    try {
      await deleteServiceMutation.mutateAsync(serviceId)
      showSuccess("Service deleted successfully")
      navigate(`/${tenantId}/services`)
    } catch (error) {
      showError(error)
    }
  }

  const attributes: DetailAttribute[] = [
    {
      icon: Server,
      label: "Service Name",
      value: <span className="font-mono text-xs">{service.name}</span>,
    },
    {
      icon: Server,
      label: "Version",
      value: <span className="font-mono text-xs">{service.version}</span>,
    },
    {
      icon: CalendarDays,
      label: "Created",
      value: format(new Date(service.created_at), "PP"),
    },
    {
      icon: CalendarDays,
      label: "Last updated",
      value: format(new Date(service.updated_at), "PP"),
    },
    {
      icon: Server,
      label: "Type",
      value: service.is_system ? "System Service" : "Custom Service",
    },
  ]

  return (
    <>
      <DetailHeaderCard
        leading={
          <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
            <Server className="size-6" />
          </div>
        }
        title={service.display_name}
        badge={
          <div className="flex items-center gap-2">
            <StatusBadge status={service.status} />
            <SystemBadge isSystem={service.is_system} />
          </div>
        }
        subtitle={service.description}
        attributes={attributes}
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-2"
              onClick={() =>
                navigate(`/${tenantId}/services/${serviceId}/edit`, {
                  state: { from: `/${tenantId}/services/${serviceId}`, backLabel: "Back to Service Details" },
                })
              }
            >
              <Edit className="size-4" />
              Edit
            </Button>
            {!service.is_system && (
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
                    Delete Service
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
        title="Delete Service"
        description="This action cannot be undone. This will permanently delete the service and all associated data."
        itemName={service.name}
        isDeleting={deleteServiceMutation.isPending}
      />
    </>
  )
}
