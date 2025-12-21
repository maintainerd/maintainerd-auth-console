import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Edit, Trash2, MoreVertical, Power, PowerOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useDeleteSignupFlow, useUpdateSignupFlowStatus } from "@/hooks/useSignupFlows"
import { useToast } from "@/hooks/useToast"
import { DeleteConfirmationDialog } from "@/components/dialog"
import type { SignupFlowType } from "@/services/api/signup-flow/types"

interface SignupFlowHeaderProps {
  signupFlow: SignupFlowType
  tenantId: string
  signupFlowId: string
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'inactive':
      return 'bg-red-100 text-red-800 border-red-200'
    case 'draft':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

export function SignupFlowHeader({ signupFlow, tenantId, signupFlowId }: SignupFlowHeaderProps) {
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()
  const deleteSignupFlowMutation = useDeleteSignupFlow()
  const updateStatusMutation = useUpdateSignupFlowStatus()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDelete = async () => {
    try {
      await deleteSignupFlowMutation.mutateAsync(signupFlowId)
      showSuccess("Sign up flow deleted successfully")
      navigate(`/${tenantId}/signup-flows`)
    } catch (error) {
      showError(error)
    }
  }

  const handleToggleStatus = async () => {
    const newStatus = signupFlow.status === 'active' ? 'inactive' : 'active'
    try {
      await updateStatusMutation.mutateAsync({
        signupFlowId,
        data: { status: newStatus }
      })
      showSuccess(`Sign up flow ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`)
    } catch (error) {
      showError(error)
    }
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">{signupFlow.name}</h1>
            <Badge className={getStatusColor(signupFlow.status)}>
              {signupFlow.status.charAt(0).toUpperCase() + signupFlow.status.slice(1)}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground font-mono">{signupFlow.identifier}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <MoreVertical className="h-4 w-4" />
              Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate(`/${tenantId}/signup-flows/${signupFlowId}/edit`)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Sign Up Flow
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleToggleStatus}>
              {signupFlow.status === 'active' ? (
                <>
                  <PowerOff className="mr-2 h-4 w-4" />
                  Deactivate
                </>
              ) : (
                <>
                  <Power className="mr-2 h-4 w-4" />
                  Activate
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setShowDeleteDialog(true)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        title="Delete Sign Up Flow"
        description={`Are you sure you want to delete "${signupFlow.name}"? This action cannot be undone.`}
        confirmationText="This will permanently delete the sign up flow and all associated data."
        itemName={signupFlow.name}
        isDeleting={deleteSignupFlowMutation.isPending}
      />
    </>
  )
}
