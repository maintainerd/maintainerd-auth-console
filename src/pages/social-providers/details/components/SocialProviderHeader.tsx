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
import { useDeleteIdentityProvider } from "@/hooks/useIdentityProviders"
import { useToast } from "@/hooks/useToast"
import { DeleteConfirmationDialog } from "@/components/dialog"

interface SocialProviderHeaderProps {
  provider: {
    display_name: string
    name: string
    status: string
    is_system: boolean
  }
  tenantId: string
  providerId: string
  getStatusColor: (status: string) => string
  getStatusText: (status: string) => string
}

export function SocialProviderHeader({ 
  provider, 
  tenantId, 
  providerId, 
  getStatusColor, 
  getStatusText 
}: SocialProviderHeaderProps) {
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()
  const deleteProviderMutation = useDeleteIdentityProvider()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDelete = async () => {
    try {
      await deleteProviderMutation.mutateAsync(providerId)
      showSuccess("Social provider deleted successfully")
      // Navigate back to social providers list
      navigate(`/${tenantId}/providers/social`)
    } catch (error) {
      showError(error)
    }
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">{provider.display_name}</h1>
            <Badge className={getStatusColor(provider.status)}>
              {getStatusText(provider.status)}
            </Badge>
            {provider.is_system && (
              <Badge variant="secondary" className="gap-1">
                <Shield className="h-3 w-3" />
                System
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">{provider.name}</p>
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
              onClick={() => navigate(`/${tenantId}/providers/social/${providerId}/edit`)}
              disabled={provider.is_system}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Provider
            </DropdownMenuItem>
            {!provider.is_system && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Provider
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
        title="Delete Social Provider"
        description="This action cannot be undone. This will permanently delete the social provider and all associated data."
        confirmationText="This will permanently delete this social provider and remove all associated configurations."
        itemName={provider.name}
        isDeleting={deleteProviderMutation.isPending}
      />
    </>
  )
}

