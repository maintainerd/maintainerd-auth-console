import { useNavigate, useParams } from "react-router-dom"
import type { SortingState } from "@tanstack/react-table"
import { ResourceListing, type FilterGroup } from "@/components/data-table"
import { webhookColumns } from "./WebhookColumns"
import { useWebhooksList } from "@/hooks/useWebhooks"

const DEFAULT_SORT: SortingState = [{ id: "created_at", desc: true }]
const SEARCH_FIELDS = ["url"]
const FILTER_GROUPS: readonly FilterGroup[] = [
  { key: "status", label: "Status", options: ["active", "inactive", "quarantined"] },
]

export function WebhookListing() {
  const navigate = useNavigate()
  const { tenantId } = useParams<{ tenantId: string }>()

  return (
    <ResourceListing
      columns={webhookColumns}
      defaultSort={DEFAULT_SORT}
      searchFields={SEARCH_FIELDS}
      searchPlaceholder="Search webhooks by URL..."
      useData={useWebhooksList}
      filterGroups={FILTER_GROUPS}
      onRowClick={(webhook) => navigate(`/${tenantId}/webhooks/${webhook.webhook_endpoint_id}`)}
      onCreate={() => navigate(`/${tenantId}/webhooks/create`)}
      createLabel="New Webhook"
      emptyTitle="No webhooks yet"
      emptyDescription="Register your first webhook to receive event notifications whenever something happens in your tenant."
    />
  )
}
