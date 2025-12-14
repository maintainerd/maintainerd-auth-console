import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Edit, Trash2, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useDeleteApiKey } from "@/hooks/useApiKeys"
import { useToast } from "@/hooks/useToast"
import { DeleteConfirmationDialog } from "@/components/dialog"
import type { ApiKeyType, ApiKeyStatusType } from "@/services/api/api-key/types"

interface ApiKeyHeaderProps {
  apiKey: ApiKeyType
  tenantId: string
  apiKeyId: string
  getStatusColor: (status: ApiKeyStatusType) => string
  getStatusText: (status: ApiKeyStatusType) => string
}

export function ApiKeyHeader({
  apiKey,
  tenantId,
  apiKeyId,
  getStatusColor,
  getStatusText,
}: ApiKeyHeaderProps) {
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()
  const deleteApiKeyMutation = useDeleteApiKey()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDelete = async () => {
    try {
      await deleteApiKeyMutation.mutateAsync(apiKeyId)
      showSuccess("API key deleted successfully")
      // Navigate back to API keys list
      navigate(`/${tenantId}/api-keys`)
    } catch (error) {
      showError(error)
    }
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">{apiKey.name}</h1>
            <Badge className={getStatusColor(apiKey.status)}>
              {getStatusText(apiKey.status)}
            </Badge>
          </div>
          <p className="text-muted-foreground">{apiKey.description}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <MoreVertical className="h-4 w-4" />
              Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate(`/${tenantId}/api-keys/${apiKeyId}/edit`)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit API Key
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete API Key
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        title="Delete API Key"
        description="This action cannot be undone. This will permanently delete the API key and all associated data."
        confirmationText="This will permanently delete this API key and remove all associated configurations and access permissions."
        itemName={apiKey.name}
        isDeleting={deleteApiKeyMutation.isPending}
      />
    </>
  )
}
