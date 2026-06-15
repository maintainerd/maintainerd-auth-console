import { useNavigate, useParams } from "react-router-dom"
import type { SortingState } from "@tanstack/react-table"
import { ResourceListing, type FilterGroup } from "@/components/data-table"
import { authEventColumns } from "./AuthEventColumns"
import { useAuthEventsList } from "@/hooks/useAuthEvents"

const DEFAULT_SORT: SortingState = [{ id: "created_at", desc: true }]
const SEARCH_FIELDS = ["event_type", "ip_address"]
const FILTER_GROUPS: readonly FilterGroup[] = [
  { key: "category", label: "Category", options: ["AUTHN", "AUTHZ", "SESSION", "USER", "SYSTEM"] },
  { key: "severity", label: "Severity", options: ["INFO", "WARN", "CRITICAL"] },
  { key: "result", label: "Result", options: ["success", "failure"] },
]

export function AuthEventListing() {
  const navigate = useNavigate()
  const { tenantId } = useParams<{ tenantId: string }>()

  return (
    <ResourceListing
      columns={authEventColumns}
      defaultSort={DEFAULT_SORT}
      searchFields={SEARCH_FIELDS}
      searchPlaceholder="Search events by type or IP..."
      useData={useAuthEventsList}
      filterGroups={FILTER_GROUPS}
      emptyTitle="No auth events yet"
      emptyDescription="Authentication and authorization events will appear here as users interact with the system."
      onRowClick={(event) => navigate(`/${tenantId}/logs/${event.auth_event_id}`)}
    />
  )
}
