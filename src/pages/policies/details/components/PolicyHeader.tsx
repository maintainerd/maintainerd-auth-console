import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { CalendarDays, Edit, FileText, MoreVertical, Shield, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useDeletePolicy } from "@/hooks/usePolicies"
import { useToast } from "@/hooks/useToast"
import { DeleteConfirmationDialog } from "@/components/dialog"
import { DetailHeaderCard, StatusBadge, type DetailAttribute } from "@/components/details"
import { SystemBadge } from "@/components/badges"
import type { PolicyDetail } from "@/services/api/policies/types"

interface PolicyHeaderProps {
  policy: PolicyDetail
  policyId: string
  afterDeleteTo?: string
}

export function PolicyHeader({ policy, policyId, afterDeleteTo }: PolicyHeaderProps) {
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()
  const deletePolicyMutation = useDeletePolicy()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDelete = async () => {
    try {
      await deletePolicyMutation.mutateAsync(policyId)
      showSuccess("Policy deleted successfully")
      navigate(afterDeleteTo ?? `/policies`)
    } catch (error) {
      showError(error)
    }
  }

  const attributes: DetailAttribute[] = [
    {
      icon: Shield,
      label: "Type",
      value: policy.is_system ? "System Policy" : "Custom Policy",
    },
    {
      icon: FileText,
      label: "Policy Version",
      value: <span className="font-mono text-xs">{policy.version}</span>,
    },
    {
      icon: FileText,
      label: "Document Version",
      value: <span className="font-mono text-xs">{policy.document.version}</span>,
    },
    {
      icon: CalendarDays,
      label: "Created",
      value: format(new Date(policy.created_at), "PP"),
    },
    {
      icon: CalendarDays,
      label: "Last updated",
      value: format(new Date(policy.updated_at), "PP"),
    },
  ]

  return (
    <>
      <DetailHeaderCard
        leading={
          <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
            <Shield className="size-6" />
          </div>
        }
        title={policy.name}
        badge={
          <div className="flex items-center gap-2">
            <StatusBadge status={policy.status} />
            <SystemBadge isSystem={policy.is_system} />
          </div>
        }
        subtitle={policy.description}
        attributes={attributes}
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-2"
              onClick={() =>
                navigate(`/policies/${policyId}/edit`, {
                  state: { from: `/policies/${policyId}`, backLabel: "Back to Policy Details" },
                })
              }
            >
              <Edit className="size-4" />
              Edit Policy
            </Button>
            {!policy.is_system && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                    <span className="sr-only">Open actions</span>
                    <MoreVertical className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 size-4" />
                    Delete Policy
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </>
        }
      />

      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        title="Delete Policy"
        description="This action cannot be undone. This will permanently delete the policy and all associated data."
        itemName={policy.name}
        isDeleting={deletePolicyMutation.isPending}
      />
    </>
  )
}
