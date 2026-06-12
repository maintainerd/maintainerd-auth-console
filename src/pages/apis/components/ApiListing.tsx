import { useNavigate, useParams } from "react-router-dom"
import type { SortingState } from "@tanstack/react-table"
import { ResourceListing, type FilterGroup } from "@/components/data-table"
import { apiColumns } from "./ApiColumns"
import { useApisList } from "@/hooks/useApis"

const DEFAULT_SORT: SortingState = [{ id: "created_at", desc: true }]
const SEARCH_FIELDS = ["name", "display_name", "description", "identifier"]
const FILTER_GROUPS: readonly FilterGroup[] = [
  { key: "status", label: "Status", options: ["active", "inactive"] },
  { key: "is_system", label: "Type", options: ["system", "regular"] },
]

export function ApiListing() {
  const navigate = useNavigate()
  const { tenantId } = useParams<{ tenantId: string }>()

  return (
    <ResourceListing
      columns={apiColumns}
      defaultSort={DEFAULT_SORT}
      searchFields={SEARCH_FIELDS}
      searchPlaceholder="Search APIs by name, display name, description, or identifier..."
      useData={useApisList}
      filterGroups={FILTER_GROUPS}
      onRowClick={(api) =>
        navigate(`/${tenantId}/apis/${api.api_id}`, {
          state: { from: `/${tenantId}/apis`, backLabel: "Back to APIs" },
        })
      }
      onCreate={() =>
        navigate(`/${tenantId}/apis/create`, {
          state: { from: `/${tenantId}/apis`, backLabel: "Back to APIs" },
        })
      }
      createLabel="New API"
    />
  )
}
