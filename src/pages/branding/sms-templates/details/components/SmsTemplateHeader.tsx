import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Edit, Trash2, MoreVertical, Play, Pause, MessageSquare, Activity, CalendarDays } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DeleteConfirmationDialog, ConfirmationDialog } from "@/components/dialog"
import { DetailHeaderCard, StatusBadge, type DetailAttribute } from "@/components/details"
import { useUpdateSmsTemplateStatus, useDeleteSmsTemplate } from "@/hooks/useSmsTemplates"
import { useToast } from "@/hooks/useToast"
import type { SmsTemplate, SmsTemplateStatus } from "@/services/api/sms-templates/types"

interface SmsTemplateHeaderProps { template: SmsTemplate; tenantId: string; templateId: string }
interface PendingStatusAction { status: SmsTemplateStatus; title: string; description: string }

export function SmsTemplateHeader({ template, tenantId, templateId }: SmsTemplateHeaderProps) {
  const navigate = useNavigate()
  const { showError } = useToast()
  const updateStatusMutation = useUpdateSmsTemplateStatus()
  const deleteTemplateMutation = useDeleteSmsTemplate()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showStatusDialog, setShowStatusDialog] = useState(false)
  const [pendingStatusAction, setPendingStatusAction] = useState<PendingStatusAction | null>(null)

  const canDelete = !template.isSystem
  const canEditStatus = !template.isSystem

  const attributes: DetailAttribute[] = [
    { icon: Activity, label: "Type", value: template.isSystem ? "System" : template.isDefault ? "Default" : "Custom" },
    { icon: CalendarDays, label: "Created", value: formatDistanceToNow(new Date(template.createdAt), { addSuffix: true }) },
    { icon: CalendarDays, label: "Updated", value: formatDistanceToNow(new Date(template.updatedAt), { addSuffix: true }) },
  ]

  return (
    <>
      <DetailHeaderCard
        leading={
          <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
            <MessageSquare className="size-6" />
          </div>
        }
        title={template.name}
        badge={<StatusBadge status={template.status} />}
        subtitle={template.description}
        attributes={attributes}
        actions={
          <>
            <Button variant="outline" size="sm" className="h-9 gap-2" onClick={() => navigate(`/${tenantId}/branding/sms-templates/${templateId}/edit`)}>
              <Edit className="size-4" />Edit
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
                      <DropdownMenuItem onClick={() => { setPendingStatusAction({ status: 'active', title: 'Activate SMS Template', description: 'Activate this SMS template?' }); setShowStatusDialog(true) }}>
                        <Play className="mr-2 size-4" />Activate
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onClick={() => { setPendingStatusAction({ status: 'inactive', title: 'Deactivate SMS Template', description: 'Deactivate this SMS template?' }); setShowStatusDialog(true) }}>
                        <Pause className="mr-2 size-4" />Deactivate
                      </DropdownMenuItem>
                    )}
                  </>
                )}
                {canDelete && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-destructive focus:text-destructive">
                      <Trash2 className="mr-2 size-4" />Delete Template
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        }
      />

      <ConfirmationDialog
        open={showStatusDialog} onOpenChange={setShowStatusDialog}
        onConfirm={async () => {
          if (!pendingStatusAction) return
          try {
            await updateStatusMutation.mutateAsync({ id: templateId, data: { status: pendingStatusAction.status } })
            setShowStatusDialog(false); setPendingStatusAction(null)
          } catch (error) { showError(error) }
        }}
        title={pendingStatusAction?.title || "Change Status"}
        description={pendingStatusAction?.description || ""}
        confirmText="Confirm" cancelText="Cancel" variant="default"
        isLoading={updateStatusMutation.isPending}
      />

      <DeleteConfirmationDialog
        open={showDeleteDialog} onOpenChange={setShowDeleteDialog}
        onConfirm={async () => {
          try { await deleteTemplateMutation.mutateAsync(templateId); navigate(`/${tenantId}/branding/sms-templates`) } catch (error) { showError(error) }
        }}
        title="Delete SMS Template"
        description="This action cannot be undone. This will permanently delete the SMS template."
        itemName={template.name} isDeleting={deleteTemplateMutation.isPending}
      />
    </>
  )
}
