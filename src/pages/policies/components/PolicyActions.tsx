import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  MoreHorizontal,
  Eye,
  Edit,
  Play,
  Pause,
  Trash2
} from "lucide-react"
import type { PolicyType, PolicyStatusType } from "@/services/api/policy/types"
import { useDeletePolicy, useUpdatePolicyStatus } from "@/hooks/usePolicies"
import { useToast } from "@/hooks/useToast"
import { DeleteConfirmationDialog, ConfirmationDialog } from "@/components/dialog"

interface PolicyActionsProps {
  policy: PolicyType
}

type StatusAction = {
  status: PolicyStatusType
  title: string
  description: string
}

export function PolicyActions({ policy }: PolicyActionsProps) {
  const { tenantId } = useParams<{ tenantId: string }>()
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()
  const deletePolicyMutation = useDeletePolicy()
  const updateStatusMutation = useUpdatePolicyStatus()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showStatusDialog, setShowStatusDialog] = useState(false)
  const [pendingStatusAction, setPendingStatusAction] = useState<StatusAction | null>(null)

  const isActive = policy.status === "active"
  const isInactive = policy.status === "inactive"

  // Action handlers
  const handleViewDetails = () => {
    navigate(`/${tenantId}/policies/${policy.policy_id}`)
  }

  const handleUpdatePolicy = () => {
    navigate(`/${tenantId}/policies/${policy.policy_id}/edit`)
  }

  const handleStatusChange = (status: PolicyStatusType, title: string, description: string) => {
    setPendingStatusAction({ status, title, description })
    setShowStatusDialog(true)
  }

  const handleConfirmStatusChange = async () => {
    if (!pendingStatusAction) return

    try {
      await updateStatusMutation.mutateAsync({
        policyId: policy.policy_id,
        data: { status: pendingStatusAction.status }
      })
      showSuccess(`Policy status updated to ${pendingStatusAction.status}`)
    } catch (error) {
      showError(error)
    }
  }

  const handleDelete = async () => {
    try {
      await deletePolicyMutation.mutateAsync(policy.policy_id)
      showSuccess("Policy deleted successfully")
    } catch (error) {
      showError(error)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleViewDetails}>
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleUpdatePolicy} disabled={policy.is_system}>
            <Edit className="mr-2 h-4 w-4" />
            Update Policy
          </DropdownMenuItem>

          {!isActive && (
            <DropdownMenuItem onClick={() => handleStatusChange("active", "Activate Policy", "Are you sure you want to activate this policy?")}>
              <Play className="mr-2 h-4 w-4" />
              Activate Policy
            </DropdownMenuItem>
          )}

          {!isInactive && (
            <DropdownMenuItem onClick={() => handleStatusChange("inactive", "Deactivate Policy", "Are you sure you want to deactivate this policy?")}>
              <Pause className="mr-2 h-4 w-4" />
              Deactivate Policy
            </DropdownMenuItem>
          )}

          {!policy.is_system && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Policy
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        title="Delete Policy"
        description="This action cannot be undone. This will permanently delete the policy and all associated data."
        confirmationText="This will permanently delete this policy and remove all associated configurations."
        itemName={policy.name}
        isDeleting={deletePolicyMutation.isPending}
      />

      <ConfirmationDialog
        open={showStatusDialog}
        onOpenChange={setShowStatusDialog}
        onConfirm={handleConfirmStatusChange}
        title={pendingStatusAction?.title || "Change Status"}
        description={pendingStatusAction?.description || "Are you sure you want to change the policy status?"}
        confirmText="Confirm"
        cancelText="Cancel"
        variant="default"
        isLoading={updateStatusMutation.isPending}
      />
    </>
  )
}
