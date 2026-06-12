import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { AppWindow, CalendarDays, Edit, Globe, KeyRound, MoreVertical, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useDeleteClient } from "@/hooks/useClients"
import { useToast } from "@/hooks/useToast"
import { DeleteConfirmationDialog } from "@/components/dialog"
import { DetailHeaderCard, StatusBadge, type DetailAttribute } from "@/components/details"
import { SystemBadge } from "@/components/badges"
import type { ClientResponse } from "@/services/api/clients/types"

interface ClientHeaderProps {
  client: ClientResponse
  tenantId: string
  clientId: string
}

const CLIENT_TYPE_LABELS: Record<string, string> = {
  traditional: "Traditional Web",
  mobile: "Native Mobile",
  spa: "Single Page App",
  m2m: "Machine to Machine",
}

export function ClientHeader({ client, tenantId, clientId }: ClientHeaderProps) {
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()
  const deleteClientMutation = useDeleteClient()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDelete = async () => {
    try {
      await deleteClientMutation.mutateAsync(clientId)
      showSuccess("Client deleted successfully")
      // Navigate back to clients list
      navigate(`/${tenantId}/clients`)
    } catch (error) {
      showError(error)
    }
  }

  const attributes: DetailAttribute[] = [
    {
      icon: KeyRound,
      label: "Client UUID",
      value: <span className="font-mono text-xs">{client.client_id}</span>,
    },
    {
      icon: AppWindow,
      label: "Client Type",
      value: CLIENT_TYPE_LABELS[client.client_type] ?? client.client_type,
    },
    {
      icon: Globe,
      label: "Domain",
      value: client.domain ? (
        <span className="font-mono text-xs break-all">{client.domain}</span>
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
    },
    {
      icon: CalendarDays,
      label: "Created",
      value: format(new Date(client.created_at), "PP"),
    },
    {
      icon: CalendarDays,
      label: "Last updated",
      value: format(new Date(client.updated_at), "PP"),
    },
  ]

  return (
    <>
      <DetailHeaderCard
        leading={
          <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
            <AppWindow className="size-6" />
          </div>
        }
        title={client.display_name}
        badge={
          <div className="flex items-center gap-2">
            <StatusBadge status={client.status} />
            <SystemBadge isSystem={client.is_system} />
          </div>
        }
        subtitle={<span className="font-mono text-xs text-muted-foreground">{client.name}</span>}
        attributes={attributes}
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-2"
              onClick={() =>
                navigate(`/${tenantId}/clients/${clientId}/edit`, {
                  state: { from: `/${tenantId}/clients/${clientId}`, backLabel: "Back to Client Details" },
                })
              }
            >
              <Edit className="size-4" />
              Edit
            </Button>
            {!client.is_system && (
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
                    Delete Client
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
        title="Delete Client"
        description="This action cannot be undone. This will permanently delete the client and all associated data."
        itemName={client.name}
        isDeleting={deleteClientMutation.isPending}
      />
    </>
  )
}
