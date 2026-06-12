import { useParams, useNavigate } from "react-router-dom"
import { Eye, Edit, Trash2, Play, Pause } from "lucide-react"
import { RowActions, type RowActionItem } from "@/components/data-table"
import { useUpdateClientStatus, useDeleteClient } from "@/hooks/useClients"
import { useToast } from "@/hooks/useToast"
import type { Client, ClientStatus } from "@/services/api/clients/types"

interface ClientActionsProps {
  client: Client
}

export function ClientActions({ client }: ClientActionsProps) {
  const { tenantId } = useParams<{ tenantId: string }>()
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()
  const updateStatusMutation = useUpdateClientStatus()
  const deleteClientMutation = useDeleteClient()

  const changeStatus = async (status: ClientStatus) => {
    try {
      await updateStatusMutation.mutateAsync({
        clientId: client.client_id,
        data: { status }
      })
      showSuccess(`Client status updated to ${status}`)
    } catch (error) {
      showError(error)
    }
  }

  const isActive = client.status === "active"

  const items: RowActionItem[] = [
    {
      key: "view",
      label: "View Details",
      icon: Eye,
      onSelect: () => navigate(`/${tenantId}/clients/${client.client_id}`),
    },
    {
      key: "edit",
      label: "Edit Client",
      icon: Edit,
      onSelect: () => navigate(`/${tenantId}/clients/${client.client_id}/edit`),
    },
    ...(isActive
      ? [
          {
            key: "deactivate",
            label: "Deactivate Client",
            icon: Pause,
            onSelect: () => changeStatus("inactive"),
            confirm: {
              title: "Deactivate Client",
              description: "Are you sure you want to deactivate this client? Users will not be able to authenticate using this client.",
              confirmText: "Deactivate",
            },
          } satisfies RowActionItem,
        ]
      : [
          {
            key: "activate",
            label: "Activate Client",
            icon: Play,
            onSelect: () => changeStatus("active"),
            confirm: {
              title: "Activate Client",
              description: "Are you sure you want to activate this client? Users will be able to authenticate using this client.",
              confirmText: "Activate",
            },
          } satisfies RowActionItem,
        ]),
    ...(!client.is_system
      ? [
          {
            key: "delete",
            label: "Delete Client",
            icon: Trash2,
            destructive: true,
            separatorBefore: true,
            onSelect: async () => {
              try {
                await deleteClientMutation.mutateAsync(client.client_id)
                showSuccess("Client deleted successfully")
              } catch (error) {
                showError(error)
              }
            },
            confirm: {
              title: "Delete Client",
              description: "This action cannot be undone. This will permanently delete the client and all associated data.",
              destructive: true,
              itemName: client.name,
            },
          } satisfies RowActionItem,
        ]
      : []),
  ]

  return <RowActions items={items} />
}
