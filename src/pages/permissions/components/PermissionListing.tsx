import { useNavigate, useParams } from "react-router-dom"
import type { SortingState } from "@tanstack/react-table"
import { ResourceListing, type FilterGroup } from "@/components/data-table"
import { permissionColumns } from "./PermissionColumns"
import { usePermissions } from "@/hooks/usePermissions"
import type { PermissionQueryParams } from "@/services/api/permissions/types"
import { useQuery } from "@tanstack/react-query"
import { fetchPermissions } from "@/services/api/permissions"

const DEFAULT_SORT: SortingState = [{ id: "created_at", desc: true }]
const SEARCH_FIELDS = ["name", "description"]
const FILTER_GROUPS: readonly FilterGroup[] = [
  { key: "status", label: "Status", options: ["active", "inactive"] },
  { key: "is_system", label: "Type", options: ["system", "regular"] },
]

function usePermissionsList(params: Record<string, unknown>) {
  return useQuery({
    queryKey: ["permissions", "list", params],
    queryFn: () => fetchPermissions(params as PermissionQueryParams),
  })
}

export function PermissionListing() {
  const navigate = useNavigate()
  const { tenantId } = useParams<{ tenantId: string }>()

  return (
    <ResourceListing
      columns={permissionColumns}
      defaultSort={DEFAULT_SORT}
      searchFields={SEARCH_FIELDS}
      searchPlaceholder="Search permissions by name or description..."
      useData={usePermissionsList}
      filterGroups={FILTER_GROUPS}
      emptyTitle="No permissions yet"
      emptyDescription="Create permissions to define granular access controls for your APIs."
      onRowClick={(perm) => navigate(`/${tenantId}/permissions/${perm.permission_id}`)}
    />
  )
}
