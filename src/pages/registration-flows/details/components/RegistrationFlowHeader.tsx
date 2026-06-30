import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Edit, Trash2, MoreVertical, Power, PowerOff, Fingerprint, Box, CalendarDays } from "lucide-react"
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
import { useDeleteRegistrationFlow, useUpdateRegistrationFlowStatus } from "@/hooks/useRegistrationFlows"
import { useToast } from "@/hooks/useToast"
import { format } from "date-fns"
import type { RegistrationFlow } from "@/services/api/registration-flows/types"

interface RegistrationFlowHeaderProps {
  registrationFlow: RegistrationFlow
  tenantId: string
  registrationFlowId: string
}

export function RegistrationFlowHeader({ registrationFlow, tenantId, registrationFlowId }: RegistrationFlowHeaderProps) {
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()
  const deleteMutation = useDeleteRegistrationFlow()
  const updateStatusMutation = useUpdateRegistrationFlowStatus()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const isActive = registrationFlow.status === "active"

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(registrationFlowId)
      showSuccess("Registration flow deleted successfully")
      navigate(`/${tenantId}/registration-flows`)
    } catch (error) {
      showError(error)
    }
  }

  const handleToggleStatus = async () => {
    const newStatus = isActive ? "inactive" : "active"
    try {
      await updateStatusMutation.mutateAsync({ registrationFlowId, data: { status: newStatus } })
      showSuccess(`Registration flow ${newStatus === "active" ? "activated" : "deactivated"} successfully`)
    } catch (error) {
      showError(error)
    }
  }

  const attributes: DetailAttribute[] = [
    {
      icon: Fingerprint,
      label: "Identifier",
      value: <span className="font-mono text-xs">{registrationFlow.identifier}</span>,
    },
    {
      icon: Box,
      label: "Client",
      value: registrationFlow.client_id ? (
        <Link
          to={`/${tenantId}/clients/${registrationFlow.client_id}`}
          className="text-primary hover:underline"
        >
          {registrationFlow.client_id}
        </Link>
      ) : "—",
    },
    { icon: CalendarDays, label: "Created", value: format(new Date(registrationFlow.created_at), "PP") },
    { icon: CalendarDays, label: "Last updated", value: format(new Date(registrationFlow.updated_at), "PP") },
  ]

  return (
    <>
      <DetailHeaderCard
        title={registrationFlow.name}
        badge={<StatusBadge status={registrationFlow.status} />}
        subtitle={registrationFlow.description}
        attributes={attributes}
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-2"
              onClick={() =>
                navigate(`/${tenantId}/registration-flows/${registrationFlowId}/edit`, {
                  state: {
                    from: `/${tenantId}/registration-flows/${registrationFlowId}`,
                    backLabel: "Back to Registration Flow Details",
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
                  Delete Registration Flow
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
        title="Delete Registration Flow"
        description="This action cannot be undone. This will permanently delete the registration flow and all associated data."
        itemName={registrationFlow.name}
        isDeleting={deleteMutation.isPending}
      />
    </>
  )
}
