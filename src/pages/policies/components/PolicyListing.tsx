import { useNavigate, useParams } from "react-router-dom"
import type { SortingState } from "@tanstack/react-table"
import { ResourceListing, type FilterGroup } from "@/components/data-table"
import { policyColumns } from "./PolicyColumns"
import { usePoliciesList } from "@/hooks/usePolicies"

const DEFAULT_SORT: SortingState = [{ id: "created_at", desc: true }]
const SEARCH_FIELDS = ["name", "description", "version"]
const FILTER_GROUPS: readonly FilterGroup[] = [
  { key: "status", label: "Status", options: ["active", "inactive"] },
  { key: "is_system", label: "Type", options: ["system", "regular"] },
]

export function PolicyListing() {
  const navigate = useNavigate()
  const { tenantId } = useParams<{ tenantId: string }>()

  return (
    <ResourceListing
      columns={policyColumns}
      defaultSort={DEFAULT_SORT}
      searchFields={SEARCH_FIELDS}
      searchPlaceholder="Search policies by name, description, or version..."
      useData={usePoliciesList}
      filterGroups={FILTER_GROUPS}
      onRowClick={(policy) =>
        navigate(`/${tenantId}/policies/${policy.policy_id}`, {
          state: { from: `/${tenantId}/policies`, backLabel: "Back to Policies" },
        })
      }
      onCreate={() =>
        navigate(`/${tenantId}/policies/create`, {
          state: { from: `/${tenantId}/policies`, backLabel: "Back to Policies" },
        })
      }
      createLabel="New Policy"
    />
  )
}
