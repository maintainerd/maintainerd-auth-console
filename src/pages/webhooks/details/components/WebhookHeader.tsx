import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Edit,
  Trash2,
  MoreVertical,
  Play,
  Pause,
  Webhook as WebhookIcon,
  Radio,
  RefreshCw,
  Timer,
  Activity,
  CalendarDays,
} from "lucide-react"
import { format, formatDistanceToNow } from "date-fns"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DeleteConfirmationDialog } from "@/components/dialog"
import { DetailHeaderCard, StatusBadge, type DetailAttribute } from "@/components/details"
import { useDeleteWebhook, useUpdateWebhookStatus } from "@/hooks/useWebhooks"
import { useToast } from "@/hooks/useToast"
import type { Webhook } from "@/services/api/webhooks/types"

interface WebhookHeaderProps {
  webhook: Webhook
  webhookId: string
}

export function WebhookHeader({ webhook, webhookId }: WebhookHeaderProps) {
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()
  const deleteWebhookMutation = useDeleteWebhook()
  const updateStatusMutation = useUpdateWebhookStatus()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const isActive = webhook.status === "active"

  const handleDelete = async () => {
    try {
      await deleteWebhookMutation.mutateAsync(webhookId)
      showSuccess("Webhook deleted successfully")
      navigate(`/events?tab=webhooks`)
    } catch (error) {
      showError(error)
    }
  }

  const changeStatus = async (status: "active" | "inactive") => {
    try {
      await updateStatusMutation.mutateAsync({ webhookId, data: { status } })
      showSuccess(`Webhook ${status === "active" ? "activated" : "deactivated"}`)
    } catch (error) {
      showError(error)
    }
  }

  const attributes: DetailAttribute[] = [
    {
      icon: Radio,
      label: "Events",
      value: webhook.subscribe_all ? "All events" : "Selected events",
    },
    {
      icon: RefreshCw,
      label: "Max retries",
      value: String(webhook.max_retries),
    },
    {
      icon: Timer,
      label: "Timeout",
      value: `${webhook.timeout_seconds}s`,
    },
    {
      icon: Activity,
      label: "Last triggered",
      value: webhook.last_triggered_at
        ? formatDistanceToNow(new Date(webhook.last_triggered_at), { addSuffix: true })
        : "Never",
    },
    {
      icon: CalendarDays,
      label: "Created",
      value: format(new Date(webhook.created_at), "PP"),
    },
    {
      icon: CalendarDays,
      label: "Last updated",
      value: format(new Date(webhook.updated_at), "PP"),
    },
  ]

  return (
    <>
      <DetailHeaderCard
        leading={
          <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
            <WebhookIcon className="size-6" />
          </div>
        }
        title={<span className="font-mono text-base break-all">{webhook.url}</span>}
        badge={<StatusBadge status={webhook.status} />}
        subtitle={webhook.description ? <span>{webhook.description}</span> : undefined}
        attributes={attributes}
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-2"
              onClick={() => navigate(`/webhooks/${webhookId}/edit`)}
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
                {isActive ? (
                  <DropdownMenuItem onClick={() => changeStatus("inactive")}>
                    <Pause className="mr-2 size-4" />
                    Deactivate
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={() => changeStatus("active")}>
                    <Play className="mr-2 size-4" />
                    Activate
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 size-4" />
                  Delete Webhook
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
        title="Delete Webhook"
        description="This action cannot be undone. This will permanently delete the webhook endpoint."
        itemName={webhook.url}
        isDeleting={deleteWebhookMutation.isPending}
      />
    </>
  )
}
