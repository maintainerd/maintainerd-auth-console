import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Edit, Trash2, MoreVertical, Workflow, Fingerprint, Box, CalendarDays, Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ConfirmationDialog, DeleteConfirmationDialog } from "@/components/dialog"
import { DetailHeaderCard, StatusBadge, type DetailAttribute } from "@/components/details"
import { SystemBadge } from "@/components/badges"
import { useDeleteRegistrationFlow, useUpdateRegistrationFlowStatus } from "@/hooks/useRegistrationFlows"
import { useToast } from "@/hooks/useToast"
import { safeFormat } from "@/lib/formatDate"
import type { RegistrationFlow, RegistrationFlowStatus } from "@/services/api/registration-flows/types"

interface RegistrationFlowHeaderProps {
  registrationFlow: RegistrationFlow
  registrationFlowId: string
}

export function RegistrationFlowHeader({ registrationFlow, registrationFlowId }: RegistrationFlowHeaderProps) {
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()
  const deleteMutation = useDeleteRegistrationFlow()
  const updateStatusMutation = useUpdateRegistrationFlowStatus()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [statusAction, setStatusAction] = useState<{ status: RegistrationFlowStatus; title: string; description: string } | null>(null)

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(registrationFlowId)
      showSuccess("Registration flow deleted successfully")
      navigate(`/registration-flows`)
    } catch (error) {
      showError(error)
    }
  }

  const handleStatusChange = async () => {
    if (!statusAction) return
    try {
      await updateStatusMutation.mutateAsync({ registrationFlowId, data: { status: statusAction.status } })
      showSuccess(`Registration flow ${statusAction.status === "active" ? "activated" : "deactivated"} successfully`)
    } catch (error) {
      showError(error)
    } finally {
      setStatusAction(null)
    }
  }

  // Availability mirrors the backend rules: system flows can't change status or be deleted.
  const isActive = registrationFlow.status === "active"
  const canActivate = !registrationFlow.is_system && !isActive
  const canDeactivate = !registrationFlow.is_system && isActive
  const canDelete = !registrationFlow.is_system
  const hasMenu = canActivate || canDeactivate || canDelete

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
        <span className="font-mono text-xs">{registrationFlow.client_id}</span>
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
    },
    { icon: CalendarDays, label: "Created", value: safeFormat(registrationFlow.created_at, "PP") },
    { icon: CalendarDays, label: "Last updated", value: safeFormat(registrationFlow.updated_at, "PP") },
  ]

  return (
    <>
      <DetailHeaderCard
        leading={
          <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
            <Workflow className="size-6" />
          </div>
        }
        title={registrationFlow.name}
        badge={
          <div className="flex items-center gap-2">
            <StatusBadge status={registrationFlow.status} />
            <SystemBadge isSystem={registrationFlow.is_system} />
          </div>
        }
        subtitle={registrationFlow.description}
        attributes={attributes}
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-2"
              onClick={() =>
                navigate(`/registration-flows/${registrationFlowId}/edit`, {
                  state: { from: `/registration-flows/${registrationFlowId}`, backLabel: "Back to Registration Flow Details" },
                })
              }
            >
              <Edit className="size-4" />
              Edit
            </Button>
            {hasMenu && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                    <span className="sr-only">Open actions</span>
                    <MoreVertical className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {canActivate && (
                    <DropdownMenuItem
                      onClick={() =>
                        setStatusAction({
                          status: "active",
                          title: "Activate Registration Flow",
                          description: "Are you sure you want to activate this registration flow?",
                        })
                      }
                    >
                      <Play className="mr-2 size-4" />
                      Activate Registration Flow
                    </DropdownMenuItem>
                  )}
                  {canDeactivate && (
                    <DropdownMenuItem
                      onClick={() =>
                        setStatusAction({
                          status: "inactive",
                          title: "Deactivate Registration Flow",
                          description: "Are you sure you want to deactivate this registration flow?",
                        })
                      }
                      className="text-destructive focus:text-destructive"
                    >
                      <Pause className="mr-2 size-4" />
                      Deactivate Registration Flow
                    </DropdownMenuItem>
                  )}
                  {canDelete && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setShowDeleteDialog(true)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 size-4" />
                        Delete Registration Flow
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </>
        }
      />

      <ConfirmationDialog
        open={!!statusAction}
        onOpenChange={(open) => { if (!open) setStatusAction(null) }}
        onConfirm={handleStatusChange}
        title={statusAction?.title ?? ""}
        description={statusAction?.description ?? ""}
        variant={statusAction?.status === "inactive" ? "destructive" : "default"}
        confirmText={statusAction?.status === "active" ? "Activate" : "Deactivate"}
        isLoading={updateStatusMutation.isPending}
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
