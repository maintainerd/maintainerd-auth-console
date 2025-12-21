import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Play,
  Pause
} from "lucide-react"
import { ConfirmationDialog, DeleteConfirmationDialog } from "@/components/dialog"
import { useDeleteSignupFlow, useUpdateSignupFlowStatus } from "@/hooks/useSignupFlows"
import { useToast } from "@/hooks/useToast"
import type { SignupFlowType } from "@/services/api/signup-flow/types"

interface SignupFlowActionsProps {
  signupFlow: SignupFlowType
}

export function SignupFlowActions({ signupFlow }: SignupFlowActionsProps) {
  const { tenantId } = useParams<{ tenantId: string }>()
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()
  const deleteSignupFlowMutation = useDeleteSignupFlow()
  const updateStatusMutation = useUpdateSignupFlowStatus()

  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showStatusDialog, setShowStatusDialog] = useState(false)
  const [pendingStatus, setPendingStatus] = useState<'active' | 'inactive'>('active')

  const handleEdit = () => {
    navigate(`/${tenantId}/signup-flows/${signupFlow.signup_flow_id}`)
  }

  const handleStatusChange = (status: 'active' | 'inactive') => {
    setPendingStatus(status)
    setShowStatusDialog(true)
  }

  const handleConfirmStatusChange = async () => {
    try {
      await updateStatusMutation.mutateAsync({
        signupFlowId: signupFlow.signup_flow_id,
        data: { status: pendingStatus }
      })
      showSuccess(`Sign up flow ${pendingStatus === 'active' ? 'activated' : 'deactivated'} successfully`)
    } catch (error) {
      showError(error)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteSignupFlowMutation.mutateAsync(signupFlow.signup_flow_id)
      showSuccess("Sign up flow deleted successfully")
    } catch (error) {
      showError(error)
    }
  }

  return (
    <>
      <div className="px-3 py-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleEdit}>
              <Edit className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>

            {signupFlow.status === 'inactive' ? (
              <DropdownMenuItem onClick={() => handleStatusChange('active')}>
                <Play className="mr-2 h-4 w-4" />
                Activate
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => handleStatusChange('inactive')}>
                <Pause className="mr-2 h-4 w-4" />
                Deactivate
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Sign Up Flow
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ConfirmationDialog
        open={showStatusDialog}
        onOpenChange={setShowStatusDialog}
        onConfirm={handleConfirmStatusChange}
        title={`${pendingStatus === 'active' ? 'Activate' : 'Deactivate'} Sign Up Flow`}
        description={`Are you sure you want to ${pendingStatus === 'active' ? 'activate' : 'deactivate'} this sign up flow?`}
        confirmText="Confirm"
        cancelText="Cancel"
        variant="default"
        isLoading={updateStatusMutation.isPending}
      />

      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        title="Delete Sign Up Flow"
        description="This action cannot be undone. This will permanently delete the sign up flow."
        itemName={signupFlow.name}
        confirmationText="DELETE"
        isDeleting={deleteSignupFlowMutation.isPending}
      />
    </>
  )
}
