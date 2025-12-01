import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { MoreHorizontal, Eye, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SystemBadge } from "@/components/badges"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DeleteConfirmationDialog } from "@/components/dialog"
import { useServicePolicyMutations } from "../hooks/useServicePolicyMutations"
import type { PolicyType } from "@/services/api/policy/types"

interface PolicyItemProps {
  policy: PolicyType
  serviceId: string
}

export function PolicyItem({ policy, serviceId }: PolicyItemProps) {
  const navigate = useNavigate()
  const { tenantId } = useParams<{ tenantId: string }>()
  const [showRemoveDialog, setShowRemoveDialog] = useState(false)
  const { removePolicy } = useServicePolicyMutations(serviceId)

  const handleView = () => {
    navigate(`/${tenantId}/policies/${policy.policy_id}`)
  }

  const handleRemoveClick = () => {
    if (policy.is_system) return
    setShowRemoveDialog(true)
  }

  const handleRemove = async () => {
    await removePolicy.mutateAsync(policy.policy_id)
    setShowRemoveDialog(false)
  }

  return (
    <>
      <div className="flex justify-between items-center p-4 border-b hover:bg-accent/50 transition-colors">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium">{policy.name}</h4>
            <SystemBadge isSystem={policy.is_system} />
          </div>
          <p className="text-sm text-muted-foreground">{policy.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={policy.status === "active" ? "secondary" : "outline"} className="capitalize">
            {policy.status}
          </Badge>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleView}>
                <Eye className="mr-2 h-4 w-4" />
                View Policy
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleRemoveClick}
                disabled={policy.is_system}
                className={policy.is_system ? "opacity-50 cursor-not-allowed" : "text-destructive"}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remove from Service
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <DeleteConfirmationDialog
        open={showRemoveDialog}
        onOpenChange={setShowRemoveDialog}
        onConfirm={handleRemove}
        title="Remove Policy"
        description="This action will remove the policy from this service."
        confirmationText="This will remove the policy from this service. The policy itself will not be deleted."
        itemName={policy.name}
        isDeleting={removePolicy.isPending}
      />
    </>
  )
}

