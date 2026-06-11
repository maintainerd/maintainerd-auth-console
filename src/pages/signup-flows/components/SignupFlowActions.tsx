import { useParams, useNavigate } from "react-router-dom"
import { Eye, Edit, Trash2, Play, Pause } from "lucide-react"
import { RowActions, type RowActionItem } from "@/components/data-table"
import { useDeleteSignupFlow, useUpdateSignupFlowStatus } from "@/hooks/useSignupFlows"
import { useToast } from "@/hooks/useToast"
import type { SignupFlow } from "@/services/api/signup-flows/types"

interface SignupFlowActionsProps {
  signupFlow: SignupFlow
}

export function SignupFlowActions({ signupFlow }: SignupFlowActionsProps) {
  const { tenantId } = useParams<{ tenantId: string }>()
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()
  const updateStatusMutation = useUpdateSignupFlowStatus()
  const deleteMutation = useDeleteSignupFlow()

  const changeStatus = async (status: "active" | "inactive") => {
    try {
      await updateStatusMutation.mutateAsync({ signupFlowId: signupFlow.signup_flow_id, data: { status } })
      showSuccess(`Auth flow ${status === "active" ? "activated" : "deactivated"} successfully`)
    } catch (error) {
      showError(error)
    }
  }

  const isActive = signupFlow.status === "active"

  const items: RowActionItem[] = [
    {
      key: "view",
      label: "View Details",
      icon: Eye,
      onSelect: () => navigate(`/${tenantId}/auth-flows/${signupFlow.signup_flow_id}`),
    },
    {
      key: "edit",
      label: "Edit Auth Flow",
      icon: Edit,
      onSelect: () => navigate(`/${tenantId}/auth-flows/${signupFlow.signup_flow_id}/edit`),
    },
    isActive
      ? {
          key: "deactivate",
          label: "Deactivate",
          icon: Pause,
          onSelect: () => changeStatus("inactive"),
          confirm: {
            title: "Deactivate Auth Flow",
            description: "Are you sure you want to deactivate this auth flow?",
            confirmText: "Deactivate",
          },
        }
      : {
          key: "activate",
          label: "Activate",
          icon: Play,
          onSelect: () => changeStatus("active"),
          confirm: {
            title: "Activate Auth Flow",
            description: "Are you sure you want to activate this auth flow?",
            confirmText: "Activate",
          },
        },
    {
      key: "delete",
      label: "Delete Auth Flow",
      icon: Trash2,
      destructive: true,
      separatorBefore: true,
      onSelect: async () => {
        try {
          await deleteMutation.mutateAsync(signupFlow.signup_flow_id)
          showSuccess("Auth flow deleted successfully")
        } catch (error) {
          showError(error)
        }
      },
      confirm: {
        title: "Delete Auth Flow",
        description: "This action cannot be undone. This will permanently delete the auth flow.",
        destructive: true,
        itemName: signupFlow.name,
      },
    },
  ]

  return <RowActions items={items} />
}
