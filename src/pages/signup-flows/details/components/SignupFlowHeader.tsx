import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Edit, Trash2, MoreVertical, Power, PowerOff, Fingerprint, Box, Palette, CalendarDays } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DeleteConfirmationDialog } from "@/components/dialog"
import { DetailHeaderCard, StatusBadge, type DetailAttribute } from "@/components/details"
import { useDeleteSignupFlow, useUpdateSignupFlowStatus } from "@/hooks/useSignupFlows"
import { useClient } from "@/hooks/useClients"
import { useBrandings } from "@/hooks/useBranding"
import { useToast } from "@/hooks/useToast"
import { format } from "date-fns"
import type { SignupFlow } from "@/services/api/signup-flows/types"

interface SignupFlowHeaderProps {
  signupFlow: SignupFlow
  tenantId: string
  signupFlowId: string
}

export function SignupFlowHeader({ signupFlow, tenantId, signupFlowId }: SignupFlowHeaderProps) {
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()
  const deleteMutation = useDeleteSignupFlow()
  const updateStatusMutation = useUpdateSignupFlowStatus()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const { data: client } = useClient(signupFlow.client_id || "")
  const { data: brandings } = useBrandings()
  const branding = signupFlow.branding_id
    ? brandings?.find((b) => b.branding_id === signupFlow.branding_id)
    : undefined

  const isActive = signupFlow.status === "active"

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(signupFlowId)
      showSuccess("Auth flow deleted successfully")
      navigate(`/${tenantId}/auth-flows`)
    } catch (error) {
      showError(error)
    }
  }

  const handleToggleStatus = async () => {
    const newStatus = isActive ? "inactive" : "active"
    try {
      await updateStatusMutation.mutateAsync({ signupFlowId, data: { status: newStatus } })
      showSuccess(`Auth flow ${newStatus === "active" ? "activated" : "deactivated"} successfully`)
    } catch (error) {
      showError(error)
    }
  }

  const attributes: DetailAttribute[] = [
    {
      icon: Fingerprint,
      label: "Identifier",
      value: <span className="font-mono text-xs">{signupFlow.identifier}</span>,
    },
    { icon: Box, label: "Client", value: client?.name ?? "—" },
    {
      icon: Palette,
      label: "Branding",
      value: branding?.name ?? (signupFlow.branding_id ? "—" : "Tenant's active branding"),
    },
    { icon: CalendarDays, label: "Created", value: format(new Date(signupFlow.created_at), "PP") },
    { icon: CalendarDays, label: "Last updated", value: format(new Date(signupFlow.updated_at), "PP") },
  ]

  return (
    <>
      <DetailHeaderCard
        title={signupFlow.name}
        badge={<StatusBadge status={signupFlow.status} />}
        subtitle={signupFlow.description}
        attributes={attributes}
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-2"
              onClick={() =>
                navigate(`/${tenantId}/auth-flows/${signupFlowId}/edit`, {
                  state: {
                    from: `/${tenantId}/auth-flows/${signupFlowId}`,
                    backLabel: "Back to Auth Flow Details",
                  },
                })
              }
            >
              <Edit className="size-4" />
              Edit
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                  <span className="sr-only">Open actions</span>
                  <MoreVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleToggleStatus}>
                  {isActive ? (
                    <>
                      <PowerOff className="mr-2 size-4" />
                      Deactivate
                    </>
                  ) : (
                    <>
                      <Power className="mr-2 size-4" />
                      Activate
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 size-4" />
                  Delete Auth Flow
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        }
      />

      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        title="Delete Auth Flow"
        description="This action cannot be undone. This will permanently delete the auth flow and all associated data."
        itemName={signupFlow.name}
        isDeleting={deleteMutation.isPending}
      />
    </>
  )
}
