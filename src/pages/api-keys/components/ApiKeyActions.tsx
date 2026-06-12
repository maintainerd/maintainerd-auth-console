import { useParams, useNavigate } from "react-router-dom"
import { Eye, Edit, Play, Pause, Trash2, type LucideIcon } from "lucide-react"
import { RowActions, type RowActionItem } from "@/components/data-table"
import { useUpdateApiKeyStatus, useDeleteApiKey } from "@/hooks/useApiKeys"
import { useToast } from "@/hooks/useToast"
import type { ApiKey } from "@/services/api/api-keys/types"

interface ApiKeyActionsProps {
  apiKey: ApiKey
}

type ApiKeyUpdatableStatus = "active" | "inactive"

interface StatusAction {
  status: ApiKeyUpdatableStatus
  label: string
  title: string
  description: string
  icon: LucideIcon
}

export function ApiKeyActions({ apiKey }: ApiKeyActionsProps) {
  const { tenantId } = useParams<{ tenantId: string }>()
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()
  const updateStatusMutation = useUpdateApiKeyStatus()
  const deleteApiKeyMutation = useDeleteApiKey()

  const changeStatus = async (status: ApiKeyUpdatableStatus) => {
    try {
      await updateStatusMutation.mutateAsync({
        apiKeyId: apiKey.api_key_id,
        data: { status },
      })
      showSuccess(`API key status updated to ${status}`)
    } catch (error) {
      showError(error)
    }
  }

  const isExpired = apiKey.status === "expired"
  const statusAction: StatusAction | null =
    apiKey.status === "inactive"
      ? {
          status: "active",
          label: "Activate API Key",
          title: "Activate API Key",
          description:
            "Are you sure you want to activate this API key? It will be able to access the configured APIs and permissions.",
          icon: Play,
        }
      : apiKey.status === "active"
        ? {
            status: "inactive",
            label: "Deactivate API Key",
            title: "Deactivate API Key",
            description: "Are you sure you want to deactivate this API key? It will no longer be able to access any APIs.",
            icon: Pause,
          }
        : null

  const items: RowActionItem[] = [
    {
      key: "view",
      label: "View Details",
      icon: Eye,
      onSelect: () => navigate(`/${tenantId}/api-keys/${apiKey.api_key_id}`),
    },
    ...(!isExpired
      ? [
          {
            key: "edit",
            label: "Edit API Key",
            icon: Edit,
            onSelect: () => navigate(`/${tenantId}/api-keys/${apiKey.api_key_id}/edit`),
          } satisfies RowActionItem,
        ]
      : []),
    ...(statusAction
      ? [
          {
            key: `status-${statusAction.status}`,
            label: statusAction.label,
            icon: statusAction.icon,
            onSelect: () => changeStatus(statusAction.status),
            confirm: {
              title: statusAction.title,
              description: statusAction.description,
              confirmText: statusAction.status === "active" ? "Activate" : "Deactivate",
            },
          } satisfies RowActionItem,
        ]
      : []),
    {
      key: "delete",
      label: "Delete API Key",
      icon: Trash2,
      destructive: true,
      separatorBefore: true,
      onSelect: async () => {
        try {
          await deleteApiKeyMutation.mutateAsync(apiKey.api_key_id)
          showSuccess("API key deleted successfully")
        } catch (error) {
          showError(error)
        }
      },
      confirm: {
        title: "Delete API Key",
        description:
          "This will permanently delete this API key and remove all associated configurations and access permissions.",
        destructive: true,
        itemName: apiKey.name,
      },
    },
  ]

  return <RowActions items={items} />
}
