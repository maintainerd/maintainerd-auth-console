import { useNavigate, useParams } from "react-router-dom"
import { Edit, Eye, Trash2, Play, XCircle, type LucideIcon } from "lucide-react"
import { RowActions, type RowActionItem } from "@/components/data-table"
import { useDeleteApi, useUpdateApiStatus } from "@/hooks/useApis"
import { useToast } from "@/hooks/useToast"
import type { Api, ApiStatus } from "@/services/api/api/types"

interface ApiActionsProps {
  api: Api
}

interface StatusAction {
  status: ApiStatus
  label: string
  title: string
  description: string
  icon: LucideIcon
}

const STATUS_ACTIONS: Record<ApiStatus, StatusAction> = {
  active: {
    status: "active",
    label: "Activate API",
    title: "Activate API",
    description: "Are you sure you want to activate this API?",
    icon: Play,
  },
  inactive: {
    status: "inactive",
    label: "Deactivate API",
    title: "Deactivate API",
    description: "Are you sure you want to deactivate this API?",
    icon: XCircle,
  },
}

export function ApiActions({ api }: ApiActionsProps) {
  const { tenantId } = useParams<{ tenantId: string }>()
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()
  const deleteApiMutation = useDeleteApi()
  const updateStatusMutation = useUpdateApiStatus()

  const changeStatus = async (status: ApiStatus) => {
    try {
      await updateStatusMutation.mutateAsync({
        apiId: api.api_id,
        data: { status },
      })
      showSuccess(`API status updated to ${status}`)
    } catch (error) {
      showError(error)
    }
  }

  const statusActions = Object.values(STATUS_ACTIONS)
    .filter((action) => action.status !== api.status)
    .map((action) => ({
      key: `status-${action.status}`,
      label: action.label,
      icon: action.icon,
      onSelect: () => changeStatus(action.status),
      confirm: {
        title: action.title,
        description: action.description,
        confirmText: action.status === "active" ? "Activate" : "Confirm",
      },
    }) satisfies RowActionItem)

  const items: RowActionItem[] = [
    {
      key: "view",
      label: "View Details",
      icon: Eye,
      onSelect: () =>
        navigate(`/${tenantId}/apis/${api.api_id}`, {
          state: { from: `/${tenantId}/apis`, backLabel: "Back to APIs" },
        }),
    },
    {
      key: "edit",
      label: "Edit API",
      icon: Edit,
      onSelect: () =>
        navigate(`/${tenantId}/apis/${api.api_id}/edit`, {
          state: { from: `/${tenantId}/apis`, backLabel: "Back to APIs" },
        }),
    },
    ...statusActions,
    ...(!api.is_system
      ? [
          {
            key: "delete",
            label: "Delete API",
            icon: Trash2,
            destructive: true,
            separatorBefore: true,
            onSelect: async () => {
              try {
                await deleteApiMutation.mutateAsync(api.api_id)
                showSuccess("API deleted successfully")
              } catch (error) {
                showError(error)
              }
            },
            confirm: {
              title: "Delete API",
              description:
                "This will permanently delete this API and remove all associated permissions and configurations.",
              destructive: true,
              itemName: api.name,
            },
          } satisfies RowActionItem,
        ]
      : []),
  ]

  return <RowActions items={items} />
}
