import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Edit, Trash2, MoreVertical, Play, Pause } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DeleteConfirmationDialog, ConfirmationDialog } from '@/components/dialog'
import {
  useUpdateLoginTemplateStatus,
  useDeleteLoginTemplate,
} from '@/hooks/useLoginTemplates'
import { useToast } from '@/hooks/useToast'
import type { LoginTemplate, LoginTemplateStatusType } from '@/services/api/login-template/types'

interface LoginTemplateHeaderProps {
  template: LoginTemplate
  tenantId: string
  templateId: string
}

interface PendingStatusAction {
  status: LoginTemplateStatusType
  title: string
  description: string
}

export function LoginTemplateHeader({
  template,
  tenantId,
  templateId,
}: LoginTemplateHeaderProps) {
  const navigate = useNavigate()
  const { showError } = useToast()
  const updateStatusMutation = useUpdateLoginTemplateStatus()
  const deleteTemplateMutation = useDeleteLoginTemplate()

  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showStatusDialog, setShowStatusDialog] = useState(false)
  const [pendingStatusAction, setPendingStatusAction] = useState<PendingStatusAction | null>(null)

  const handleDelete = async () => {
    try {
      await deleteTemplateMutation.mutateAsync(templateId)
      navigate(`/${tenantId}/branding/login`)
    } catch (error) {
      showError(error)
    }
  }

  const handleStatusChange = (
    status: LoginTemplateStatusType,
    title: string,
    description: string
  ) => {
    setPendingStatusAction({ status, title, description })
    setShowStatusDialog(true)
  }

  const handleConfirmStatusChange = async () => {
    if (!pendingStatusAction) return

    try {
      await updateStatusMutation.mutateAsync({
        id: templateId,
        data: { status: pendingStatusAction.status },
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
          <p className="text-muted-foreground">{template.description}</p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <MoreVertical className="h-4 w-4" />
              Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => navigate(`/${tenantId}/branding/login/${templateId}/edit`)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Template
            </DropdownMenuItem>

            {canEditStatus && (
              <>
                <DropdownMenuSeparator />
                {template.status === 'inactive' ? (
                  <DropdownMenuItem
                    onClick={() =>
                      handleStatusChange(
                        'active',
                        'Activate Login Template',
                        'Are you sure you want to activate this login template? It will be available for use immediately.'
                      )
                    }
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Activate Template
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    onClick={() =>
                      handleStatusChange(
                        'inactive',
                        'Deactivate Login Template',
                        'Are you sure you want to deactivate this login template? It will no longer be available for use.'
                      )
                    }
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
      </div>

      <ConfirmationDialog
        open={showStatusDialog}
        onOpenChange={setShowStatusDialog}
        onConfirm={handleConfirmStatusChange}
        title={pendingStatusAction?.title || 'Change Status'}
        description={
          pendingStatusAction?.description ||
          'Are you sure you want to change the template status?'
        }
        confirmText="Confirm"
        cancelText="Cancel"
        variant="default"
        isLoading={updateStatusMutation.isPending}
      />

      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        title="Delete Login Template"
        description={`Are you sure you want to delete the login template "${template.name}"?`}
        confirmationText="This action cannot be undone. This will permanently delete the login template."
        itemName={template.name}
        isDeleting={deleteTemplateMutation.isPending}
      />
    </>
  )
}
