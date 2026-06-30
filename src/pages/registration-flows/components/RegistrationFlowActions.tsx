import { useParams, useNavigate, useLocation } from "react-router-dom"
import { Eye, Edit, Trash2, Play, Pause } from "lucide-react"
import { RowActions, type RowActionItem } from "@/components/data-table"
import { useDeleteRegistrationFlow, useUpdateRegistrationFlowStatus } from "@/hooks/useRegistrationFlows"
import { useToast } from "@/hooks/useToast"
import type { RegistrationFlow } from "@/services/api/registration-flows/types"

interface RegistrationFlowActionsProps {
  registrationFlow: RegistrationFlow
}

export function RegistrationFlowActions({ registrationFlow }: RegistrationFlowActionsProps) {
  const { tenantId } = useParams<{ tenantId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { showSuccess, showError } = useToast()
  const updateStatusMutation = useUpdateRegistrationFlowStatus()
  const deleteMutation = useDeleteRegistrationFlow()

  const changeStatus = async (status: "active" | "inactive") => {
    try {
      await updateStatusMutation.mutateAsync({ registrationFlowId: registrationFlow.registration_flow_id, data: { status } })
      showSuccess(`Registration flow ${status === "active" ? "activated" : "deactivated"} successfully`)
    } catch (error) {
      showError(error)
    }
  }

  const isActive = registrationFlow.status === "active"

  const items: RowActionItem[] = [
    {
      key: "view",
      label: "View Details",
      icon: Eye,
      onSelect: () => navigate(`/${tenantId}/registration-flows/${registrationFlow.registration_flow_id}`, { state: { from: location.pathname, backLabel: "Back to Registration Flows" } }),
    },
    {
      key: "edit",
      label: "Edit Registration Flow",
      icon: Edit,
      onSelect: () => navigate(`/${tenantId}/registration-flows/${registrationFlow.registration_flow_id}/edit`, { state: { from: location.pathname, backLabel: "Back to Registration Flows" } }),
    },
    isActive
      ? {
          key: "deactivate",
          label: "Deactivate",
          icon: Pause,
          onSelect: () => changeStatus("inactive"),
          confirm: {
            title: "Deactivate Registration Flow",
            description: "Are you sure you want to deactivate this registration flow?",
            confirmText: "Deactivate",
          },
        }
      : {
          key: "activate",
          label: "Activate",
          icon: Play,
          onSelect: () => changeStatus("active"),
          confirm: {
            title: "Activate Registration Flow",
            description: "Are you sure you want to activate this registration flow?",
            confirmText: "Activate",
          },
        },
    {
      key: "delete",
      label: "Delete Registration Flow",
      icon: Trash2,
      destructive: true,
      separatorBefore: true,
      onSelect: async () => {
        try {
          await deleteMutation.mutateAsync(registrationFlow.registration_flow_id)
          showSuccess("Registration flow deleted successfully")
        } catch (error) {
          showError(error)
        }
      },
      confirm: {
        title: "Delete Registration Flow",
        description: "This action cannot be undone. This will permanently delete the registration flow.",
        destructive: true,
        itemName: registrationFlow.name,
      },
    },
  ]

  return <RowActions items={items} />
}
