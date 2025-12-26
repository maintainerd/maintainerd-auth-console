import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { MoreHorizontal, Eye, Edit, Trash2, Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ConfirmationDialog, DeleteConfirmationDialog } from "@/components/dialog"
import { useUpdateSmsTemplateStatus, useDeleteSmsTemplate } from "@/hooks/useSmsTemplates"
import { useToast } from "@/hooks/useToast"
import type { SmsTemplate, SmsTemplateStatusType } from "@/services/api/sms-template/types"

interface SmsTemplateActionsProps {
  template: SmsTemplate
}

interface PendingStatusAction {
  status: SmsTemplateStatusType
  title: string
  description: string
}

export function SmsTemplateActions({ template }: SmsTemplateActionsProps) {
  const { tenantId } = useParams<{ tenantId: string }>()
  const navigate = useNavigate()
  const { showError } = useToast()
  const updateStatusMutation = useUpdateSmsTemplateStatus()
  const deleteTemplateMutation = useDeleteSmsTemplate()

  const [showStatusDialog, setShowStatusDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [pendingStatusAction, setPendingStatusAction] = useState<PendingStatusAction | null>(null)

  const handleViewDetails = () => {
    navigate(`/${tenantId}/branding/sms-templates/${template.smsTemplateId}`)
  }

  const handleEditTemplate = () => {
    navigate(`/${tenantId}/branding/sms-templates/${template.smsTemplateId}/edit`)
  }

  const handleStatusChange = (status: SmsTemplateStatusType, title: string, description: string) => {
    setPendingStatusAction({ status, title, description })
    setShowStatusDialog(true)
  }

  const handleConfirmStatusChange = async () => {
    if (!pendingStatusAction) return

    try {
      await updateStatusMutation.mutateAsync({
        id: template.smsTemplateId,
        data: { status: pendingStatusAction.status }
      })
      setShowStatusDialog(false)
      setPendingStatusAction(null)
    } catch (error) {
      showError(error)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteTemplateMutation.mutateAsync(template.smsTemplateId)
      setShowDeleteDialog(false)
    } catch (error) {
      showError(error)
    }
  }

  const canDelete = !template.isSystem
  const canEditStatus = !template.isSystem

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

          <DropdownMenuItem onClick={handleEditTemplate}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Template
          </DropdownMenuItem>

          {canEditStatus && (
            <>
              {template.status === 'inactive' ? (
                <DropdownMenuItem
                  onClick={() => handleStatusChange('active', 'Activate SMS Template', 'Are you sure you want to activate this SMS template? It will be available for use immediately.')}
                >
                  <Play className="mr-2 h-4 w-4" />
                  Activate Template
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={() => handleStatusChange('inactive', 'Deactivate SMS Template', 'Are you sure you want to deactivate this SMS template? It will no longer be available for use.')}
                >
                  <Pause className="mr-2 h-4 w-4" />
                  Deactivate Template
                </DropdownMenuItem>
              )}
            </>
          )}

          {canDelete && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Template
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmationDialog
        open={showStatusDialog}
        onOpenChange={setShowStatusDialog}
        onConfirm={handleConfirmStatusChange}
        title={pendingStatusAction?.title || "Change Status"}
        description={pendingStatusAction?.description || "Are you sure you want to change the template status?"}
        confirmText="Confirm"
        cancelText="Cancel"
        variant="default"
        isLoading={updateStatusMutation.isPending}
      />

      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        title="Delete SMS Template"
        description={`Are you sure you want to delete the SMS template "${template.name}"?`}
        confirmationText="This action cannot be undone. This will permanently delete the SMS template."
        itemName={template.name}
        isDeleting={deleteTemplateMutation.isPending}
      />
    </>
  )
}
