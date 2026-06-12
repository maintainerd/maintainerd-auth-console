import { useNavigate, useParams } from "react-router-dom"
import type { SortingState } from "@tanstack/react-table"
import { ResourceListing, type FilterGroup } from "@/components/data-table"
import { serviceColumns } from "./ServiceColumns"
import { useServicesList } from "@/hooks/useServices"

const DEFAULT_SORT: SortingState = [{ id: "created_at", desc: true }]
const SEARCH_FIELDS = ["name", "display_name", "description", "version"]
const FILTER_GROUPS: readonly FilterGroup[] = [
  { key: "status", label: "Status", options: ["active", "maintenance", "deprecated", "inactive"] },
  { key: "is_system", label: "Type", options: ["system", "regular"] },
]

export function ServiceListing() {
  const navigate = useNavigate()
  const { tenantId } = useParams<{ tenantId: string }>()

  return (
    <ResourceListing
      columns={serviceColumns}
      defaultSort={DEFAULT_SORT}
      searchFields={SEARCH_FIELDS}
      searchPlaceholder="Search services by name, display name, description, or version..."
      useData={useServicesList}
      filterGroups={FILTER_GROUPS}
      onRowClick={(service) =>
        navigate(`/${tenantId}/services/${service.service_id}`, {
          state: { from: `/${tenantId}/services`, backLabel: "Back to Services" },
        })
      }
      onCreate={() =>
        navigate(`/${tenantId}/services/create`, {
          state: { from: `/${tenantId}/services`, backLabel: "Back to Services" },
        })
      }
      createLabel="New Service"
    />
  )
}
