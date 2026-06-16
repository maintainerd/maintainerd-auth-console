import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Edit, Trash2, MoreVertical, Play, Pause, Mail, Activity, CalendarDays } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DeleteConfirmationDialog, ConfirmationDialog } from "@/components/dialog"
import { DetailHeaderCard, StatusBadge, type DetailAttribute } from "@/components/details"
import { useUpdateEmailTemplateStatus, useDeleteEmailTemplate } from "@/hooks/useEmailTemplates"
import { useToast } from "@/hooks/useToast"
import type { EmailTemplate, EmailTemplateStatus } from "@/services/api/email-templates/types"

interface EmailTemplateHeaderProps {
  template: EmailTemplate
  tenantId: string
  templateId: string
}

interface PendingStatusAction {
  status: EmailTemplateStatus
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
      navigate(`/${tenantId}/branding/email-templates`)
    } catch (error) {
      showError(error)
    }
  }

  const handleStatusChange = (status: EmailTemplateStatus, title: string, description: string) => {
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

  const attributes: DetailAttribute[] = [
    { icon: Activity, label: "Type", value: template.isSystem ? "System" : template.isDefault ? "Default" : "Custom" },
    { icon: Activity, label: "Subject", value: template.subject },
    { icon: CalendarDays, label: "Created", value: formatDistanceToNow(new Date(template.createdAt), { addSuffix: true }) },
    { icon: CalendarDays, label: "Updated", value: formatDistanceToNow(new Date(template.updatedAt), { addSuffix: true }) },
  ]

  return (
    <>
      <DetailHeaderCard
        leading={
          <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
            <Mail className="size-6" />
          </div>
        }
        title={template.name}
        badge={<StatusBadge status={template.status} />}
        subtitle={template.subject}
        attributes={attributes}
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-2"
              onClick={() => navigate(`/${tenantId}/branding/email-templates/${templateId}/edit`)}
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
                {canEditStatus && (
                  <>
                    {template.status === 'inactive' ? (
                      <DropdownMenuItem onClick={() => handleStatusChange('active', 'Activate Email Template', 'Are you sure you want to activate this email template?')}>
                        <Play className="mr-2 size-4" />
                        Activate
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onClick={() => handleStatusChange('inactive', 'Deactivate Email Template', 'Are you sure you want to deactivate this email template?')}>
                        <Pause className="mr-2 size-4" />
                        Deactivate
                      </DropdownMenuItem>
                    )}
                  </>
                )}
                {canDelete && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-destructive focus:text-destructive">
                      <Trash2 className="mr-2 size-4" />
                      Delete Template
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        }
      />

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
        description="This action cannot be undone. This will permanently delete the email template."
        itemName={template.name}
        isDeleting={deleteTemplateMutation.isPending}
      />
    </>
  )
}
