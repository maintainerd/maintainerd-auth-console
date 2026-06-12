import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { CalendarDays, Edit, KeyRound, MoreVertical, TimerReset, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useDeleteApiKey } from "@/hooks/useApiKeys"
import { useToast } from "@/hooks/useToast"
import { DeleteConfirmationDialog } from "@/components/dialog"
import { DetailHeaderCard, StatusBadge, type DetailAttribute } from "@/components/details"
import type { ApiKey } from "@/services/api/api-keys/types"

interface ApiKeyHeaderProps {
  apiKey: ApiKey
  tenantId: string
  apiKeyId: string
}

export function ApiKeyHeader({
  apiKey,
  tenantId,
  apiKeyId,
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

  const attributes: DetailAttribute[] = [
    {
      icon: KeyRound,
      label: "Key Prefix",
      value: <span className="font-mono text-xs break-all">{apiKey.key_prefix}</span>,
    },
    {
      icon: TimerReset,
      label: "Rate Limit",
      value: `${apiKey.rate_limit.toLocaleString()} requests/hour`,
    },
    {
      icon: CalendarDays,
      label: "Expires",
      value: apiKey.expires_at ? format(new Date(apiKey.expires_at), "PP") : "Never",
    },
    {
      icon: CalendarDays,
      label: "Created",
      value: format(new Date(apiKey.created_at), "PP"),
    },
    {
      icon: CalendarDays,
      label: "Last updated",
      value: format(new Date(apiKey.updated_at), "PP"),
    },
  ]

  return (
    <>
      <DetailHeaderCard
        leading={
          <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
            <KeyRound className="size-6" />
          </div>
        }
        title={apiKey.name}
        badge={<StatusBadge status={apiKey.status} />}
        subtitle={apiKey.description}
        attributes={attributes}
        actions={
          <>
            {apiKey.status !== "expired" && (
              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-2"
                onClick={() =>
                  navigate(`/${tenantId}/api-keys/${apiKeyId}/edit`, {
                    state: { from: `/${tenantId}/api-keys/${apiKeyId}`, backLabel: "Back to API Key Details" },
                  })
                }
              >
                <Edit className="size-4" />
                Edit
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                  <span className="sr-only">Open actions</span>
                  <MoreVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 size-4" />
                  Delete API Key
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        }
      />

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
