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
import { useDeleteClient } from "@/hooks/useClients"
import { useToast } from "@/hooks/useToast"
import { DeleteConfirmationDialog } from "@/components/dialog"
import type { ClientStatusType } from "@/services/api/auth-client/types"

interface ClientHeaderProps {
  client: {
    display_name: string
    name: string
    status: ClientStatusType
    is_system: boolean
  }
  tenantId: string
  clientId: string
  getStatusColor: (status: ClientStatusType) => string
  getStatusText: (status: ClientStatusType) => string
}

export function ClientHeader({ client, tenantId, clientId, getStatusColor, getStatusText }: ClientHeaderProps) {
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

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">{client.display_name}</h1>
            <Badge className={getStatusColor(client.status)}>
              {getStatusText(client.status)}
            </Badge>
            {client.is_system && (
              <Badge variant="secondary" className="gap-1">
                <Shield className="h-3 w-3" />
                System
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground font-mono">{client.name}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <MoreVertical className="h-4 w-4" />
              Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate(`/${tenantId}/clients/${clientId}/edit`)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Client
            </DropdownMenuItem>
            {!client.is_system && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Client
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
        title="Delete Client"
        description="This action cannot be undone. This will permanently delete the client and all associated data."
        confirmationText="This will permanently delete this client and remove all associated configurations and credentials."
        itemName={client.name}
        isDeleting={deleteClientMutation.isPending}
      />
    </>
  )
}

