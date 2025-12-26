import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Edit, Trash2, MoreVertical, Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DeleteConfirmationDialog, ConfirmationDialog } from "@/components/dialog"
import { useUpdateEmailTemplateStatus, useDeleteEmailTemplate } from "@/hooks/useEmailTemplates"
import { useToast } from "@/hooks/useToast"
import type { EmailTemplate, EmailTemplateStatusType } from "@/services/api/email-template/types"

interface EmailTemplateHeaderProps {
  template: EmailTemplate
  tenantId: string
  templateId: string
}

interface PendingStatusAction {
  status: EmailTemplateStatusType
  title: string
  description: string
}

export function EmailTemplateHeader({ template, tenantId, templateId }: EmailTemplateHeaderProps) {
  const navigate = useNavigate()
  const { showError } = useToast()
  const updateStatusMutation = useUpdateEmailTemplateStatus()
  const deleteTemplateMutation = useDeleteEmailTemplate()

  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showStatusDialog, setShowStatusDialog] = useState(false)
  const [pendingStatusAction, setPendingStatusAction] = useState<PendingStatusAction | null>(null)

  const handleDelete = async () => {
    try {
      await deleteTemplateMutation.mutateAsync(templateId)
      // Navigate back to list after deletion
      navigate(`/${tenantId}/branding/email-templates`)
    } catch (error) {
      showError(error)
    }
  }

  const handleStatusChange = (status: EmailTemplateStatusType, title: string, description: string) => {
    setPendingStatusAction({ status, title, description })
    setShowStatusDialog(true)
  }

  const handleConfirmStatusChange = async () => {
    if (!pendingStatusAction) return

    try {
      await updateStatusMutation.mutateAsync({
        id: templateId,
        data: { status: pendingStatusAction.status }
      })
      setShowStatusDialog(false)
      setPendingStatusAction(null)
    } catch (error) {
      showError(error)
    }
  }

  const canDelete = !template.isSystem
  const canEditStatus = !template.isSystem

  return (
    <>
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-semibold tracking-tight">{template.name}</h1>
          <p className="text-muted-foreground">{template.subject}</p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <MoreVertical className="h-4 w-4" />
              Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate(`/${tenantId}/branding/email-templates/${templateId}/edit`)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Template
            </DropdownMenuItem>

            {canEditStatus && (
              <>
                <DropdownMenuSeparator />
                {template.status === 'inactive' ? (
                  <DropdownMenuItem
                    onClick={() => handleStatusChange('active', 'Activate Email Template', 'Are you sure you want to activate this email template? It will be available for use immediately.')}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Activate Template
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    onClick={() => handleStatusChange('inactive', 'Deactivate Email Template', 'Are you sure you want to deactivate this email template? It will no longer be available for use.')}
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
                <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Template
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

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
        title="Delete Email Template"
        description={`Are you sure you want to delete the email template "${template.name}"?`}
        confirmationText="This action cannot be undone. This will permanently delete the email template."
        itemName={template.name}
        isDeleting={deleteTemplateMutation.isPending}
      />
    </>
  )
}
