import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MoreHorizontal, Eye, Edit, Trash2, Play, Pause } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ConfirmationDialog, DeleteConfirmationDialog } from '@/components/dialog'
import {
  useUpdateLoginTemplateStatus,
  useDeleteLoginTemplate,
} from '@/hooks/useLoginTemplates'
import { useToast } from '@/hooks/useToast'
import type { LoginTemplate, LoginTemplateStatusType } from '@/services/api/login-template/types'

interface LoginTemplateActionsProps {
  template: LoginTemplate
}

interface PendingStatusAction {
  status: LoginTemplateStatusType
  title: string
  description: string
}

export function LoginTemplateActions({ template }: LoginTemplateActionsProps) {
  const { tenantId } = useParams<{ tenantId: string }>()
  const navigate = useNavigate()
  const { showError } = useToast()
  const updateStatusMutation = useUpdateLoginTemplateStatus()
  const deleteTemplateMutation = useDeleteLoginTemplate()

  const [showStatusDialog, setShowStatusDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [pendingStatusAction, setPendingStatusAction] = useState<PendingStatusAction | null>(null)

  const handleViewDetails = () => {
    navigate(`/${tenantId}/branding/login/${template.loginTemplateId}`)
  }

  const handleEditTemplate = () => {
    navigate(`/${tenantId}/branding/login/${template.loginTemplateId}/edit`)
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
        id: template.loginTemplateId,
        data: { status: pendingStatusAction.status },
      })
      setShowStatusDialog(false)
      setPendingStatusAction(null)
    } catch (error) {
      showError(error)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteTemplateMutation.mutateAsync(template.loginTemplateId)
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
