import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Edit, Trash2, MoreVertical, Server, CalendarDays, KeyRound } from "lucide-react"
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
import { useDeleteApi } from "@/hooks/useApis"
import { useToast } from "@/hooks/useToast"
import type { Api } from "@/services/api/api/types"

interface ApiHeaderProps {
  api: Api
  tenantId: string
  apiId: string
}

export function ApiHeader({ api, tenantId, apiId }: ApiHeaderProps) {
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()
  const deleteApiMutation = useDeleteApi()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDelete = async () => {
    try {
      await deleteApiMutation.mutateAsync(apiId)
      showSuccess("API deleted successfully")
      navigate(`/${tenantId}/apis`)
    } catch (error) {
      showError(error)
    }
  }

  const attributes: DetailAttribute[] = [
    {
      icon: Server,
      label: "API Name",
      value: <span className="font-mono text-xs">{api.name}</span>,
    },
    {
      icon: KeyRound,
      label: "Identifier",
      value: <span className="font-mono text-xs">{api.identifier}</span>,
    },
    {
      icon: Server,
      label: "Service",
      value: api.service?.display_name ?? <span className="text-muted-foreground">&mdash;</span>,
    },
    {
      icon: CalendarDays,
      label: "Created",
      value: format(new Date(api.created_at), "PP"),
    },
    {
      icon: CalendarDays,
      label: "Last updated",
      value: format(new Date(api.updated_at), "PP"),
    },
    {
      icon: Server,
      label: "Type",
      value: api.is_system ? "System API" : "Custom API",
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
        title={api.display_name}
        badge={
          <div className="flex items-center gap-2">
            <StatusBadge status={api.status} />
            <SystemBadge isSystem={api.is_system} />
          </div>
        }
        subtitle={api.description}
        attributes={attributes}
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-2"
              onClick={() =>
                navigate(`/${tenantId}/apis/${apiId}/edit`, {
                  state: { from: `/${tenantId}/apis/${apiId}`, backLabel: "Back to API Details" },
                })
              }
            >
              <Edit className="size-4" />
              Edit
            </Button>
            {!api.is_system && (
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
                    Delete API
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
        title="Delete API"
        description="This action cannot be undone. This will permanently delete the API and all associated data."
        itemName={api.name}
        isDeleting={deleteApiMutation.isPending}
      />
    </>
  )
}
