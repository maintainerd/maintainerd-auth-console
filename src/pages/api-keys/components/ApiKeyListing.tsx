import { useNavigate, useParams } from "react-router-dom"
import type { SortingState } from "@tanstack/react-table"
import { ResourceListing, type FilterGroup } from "@/components/data-table"
import { apiKeyColumns } from "./ApiKeyColumns"
import { useApiKeys } from "@/hooks/useApiKeys"

const DEFAULT_SORT: SortingState = [{ id: "created_at", desc: false }]
const SEARCH_FIELDS = ["name", "description"]
const FILTER_GROUPS: readonly FilterGroup[] = [
  { key: "status", label: "Status", options: ["active", "inactive", "expired"] },
]

export function ApiKeyListing() {
  const navigate = useNavigate()
  const { tenantId } = useParams<{ tenantId: string }>()

  return (
    <ResourceListing
      columns={apiKeyColumns}
      defaultSort={DEFAULT_SORT}
      searchFields={SEARCH_FIELDS}
      searchPlaceholder="Search API keys by name or description..."
      useData={useApiKeys}
      filterGroups={FILTER_GROUPS}
      onRowClick={(apiKey) => navigate(`/${tenantId}/api-keys/${apiKey.api_key_id}`)}
      onCreate={() => navigate(`/${tenantId}/api-keys/create`)}
      createLabel="New API Key"
    />
  )
}
