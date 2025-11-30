import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Edit, Shield, Trash2, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useDeleteApi } from "@/hooks/useApis"
import { useToast } from "@/hooks/useToast"
import { DeleteConfirmationDialog } from "@/components/dialog"
import type { ApiStatusType } from "@/services/api/api/types"

interface ApiHeaderProps {
  api: {
    name: string
    displayName: string
    description: string
    status: ApiStatusType
    isSystem: boolean
  }
  tenantId: string
  apiId: string
  getStatusColor: (status: ApiStatusType) => string
  getStatusText: (status: ApiStatusType) => string
}

export function ApiHeader({ api, tenantId, apiId, getStatusColor, getStatusText }: ApiHeaderProps) {
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()
  const deleteApiMutation = useDeleteApi()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDelete = async () => {
    try {
      await deleteApiMutation.mutateAsync(apiId)
      showSuccess("API deleted successfully")
      // Navigate back to APIs list
      navigate(`/${tenantId}/apis`)
    } catch (error) {
      showError(error)
    }
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">{api.displayName}</h1>
            <Badge className={getStatusColor(api.status)}>
              {getStatusText(api.status)}
            </Badge>
            {api.isSystem && (
              <Badge variant="secondary" className="gap-1">
                <Shield className="h-3 w-3" />
                System
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">{api.description}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <MoreVertical className="h-4 w-4" />
              Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate(`/${tenantId}/apis/${apiId}/edit`)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit API
            </DropdownMenuItem>
            {!api.isSystem && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete API
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        title="Delete API"
        description="This action cannot be undone. This will permanently delete the API and all associated data."
        confirmationText="This will permanently delete this API and remove all associated permissions and configurations."
        itemName={api.name}
        isDeleting={deleteApiMutation.isPending}
      />
    </>
  )
}

