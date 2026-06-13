import { useParams, useNavigate } from "react-router-dom"
import { Eye, Edit, Play, Pause, Trash2 } from "lucide-react"
import { RowActions, type RowActionItem } from "@/components/data-table"
import type { Policy, PolicyStatus } from "@/services/api/policies/types"
import { useDeletePolicy, useUpdatePolicyStatus } from "@/hooks/usePolicies"
import { useToast } from "@/hooks/useToast"

interface PolicyActionsProps {
  policy: Policy
}

export function PolicyActions({ policy }: PolicyActionsProps) {
  const { tenantId } = useParams<{ tenantId: string }>()
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()
  const deletePolicyMutation = useDeletePolicy()
  const updateStatusMutation = useUpdatePolicyStatus()

  const changeStatus = async (status: PolicyStatus) => {
    try {
      await updateStatusMutation.mutateAsync({ policyId: policy.policy_id, data: { status } })
      showSuccess(`Policy status updated to ${status}`)
    } catch (error) {
      showError(error)
    }
  }

  const isActive = policy.status === "active"
  const listingState = { from: `/${tenantId}/policies`, backLabel: "Back to Policies" }
  const items: RowActionItem[] = [
    {
      key: "view",
      label: "View Details",
      icon: Eye,
      onSelect: () => navigate(`/${tenantId}/policies/${policy.policy_id}`, { state: listingState }),
    },
    {
      key: "edit",
      label: "Edit Policy",
      icon: Edit,
      onSelect: () => navigate(`/${tenantId}/policies/${policy.policy_id}/edit`, { state: listingState }),
    },
    ...(isActive
      ? [
          {
            key: "deactivate",
            label: "Deactivate Policy",
            icon: Pause,
            onSelect: () => changeStatus("inactive"),
            confirm: {
              title: "Deactivate Policy",
              description: "Are you sure you want to deactivate this policy?",
              confirmText: "Deactivate",
            },
          } satisfies RowActionItem,
        ]
      : [
          {
            key: "activate",
            label: "Activate Policy",
            icon: Play,
            onSelect: () => changeStatus("active"),
            confirm: {
              title: "Activate Policy",
              description: "Are you sure you want to activate this policy?",
              confirmText: "Activate",
            },
          } satisfies RowActionItem,
        ]),
    ...(!policy.is_system
      ? [
          {
            key: "delete",
            label: "Delete Policy",
            icon: Trash2,
            destructive: true,
            separatorBefore: true,
            onSelect: async () => {
              try {
                await deletePolicyMutation.mutateAsync(policy.policy_id)
                showSuccess("Policy deleted successfully")
              } catch (error) {
                showError(error)
              }
            },
            confirm: {
              title: "Delete Policy",
              description: "This action cannot be undone. This will permanently delete the policy and all associated data.",
              destructive: true,
              itemName: policy.name,
            },
          } satisfies RowActionItem,
        ]
      : []),
  ]

  return <RowActions items={items} />
}
