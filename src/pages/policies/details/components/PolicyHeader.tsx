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
import { useDeletePolicy } from "@/hooks/usePolicies"
import { useToast } from "@/hooks/useToast"
import { DeleteConfirmationDialog } from "@/components/dialog"
import type { PolicyStatusType } from "@/services/api/policy/types"

interface PolicyHeaderProps {
  policy: {
    name: string
    description: string
    status: PolicyStatusType
    is_system: boolean
  }
  tenantId: string
  policyId: string
  getStatusColor: (status: PolicyStatusType) => string
  getStatusText: (status: PolicyStatusType) => string
}

export function PolicyHeader({ policy, tenantId, policyId, getStatusColor, getStatusText }: PolicyHeaderProps) {
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()
  const deletePolicyMutation = useDeletePolicy()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDelete = async () => {
    try {
      await deletePolicyMutation.mutateAsync(policyId)
      showSuccess("Policy deleted successfully")
      // Navigate back to policies list
      navigate(`/${tenantId}/policies`)
    } catch (error) {
      showError(error)
    }
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">{policy.name}</h1>
            <Badge className={getStatusColor(policy.status)}>
              {getStatusText(policy.status)}
            </Badge>
            {policy.is_system && (
              <Badge variant="secondary" className="gap-1">
                <Shield className="h-3 w-3" />
                System
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">{policy.description}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <MoreVertical className="h-4 w-4" />
              Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate(`/${tenantId}/policies/${policyId}/edit`)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Policy
            </DropdownMenuItem>
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
      </div>

      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        title="Delete Policy"
        description="This action cannot be undone. This will permanently delete the policy and all associated data."
        confirmationText="This will permanently delete this policy and remove it from all services where it's applied."
        itemName={policy.name}
        isDeleting={deletePolicyMutation.isPending}
      />
    </>
  )
}

