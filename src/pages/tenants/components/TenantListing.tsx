import type { SortingState } from "@tanstack/react-table"
import { ResourceListing, type FilterGroup } from "@/components/data-table"
import { tenantColumns } from "./TenantColumns"
import { useTenants } from "@/hooks/useTenants"
import { useNavigate, useParams } from "react-router-dom"
import { useCallback, useMemo } from "react"

const DEFAULT_SORT: SortingState = [{ id: "created_at", desc: true }]
const SEARCH_FIELDS = ["name", "display_name", "identifier"]
const FILTER_GROUPS: readonly FilterGroup[] = [
  { key: "status", label: "Status", options: ["active", "inactive", "suspended"] },
]

export function TenantListing() {
  const navigate = useNavigate()
  const { tenantId } = useParams<{ tenantId: string }>()

  const handleEdit = useCallback(
    (tenant: import("@/services/api/tenants/types").TenantEntity) => {
      navigate(`/${tenantId}/tenants/${tenant.tenant_id}/edit`)
    },
    [navigate, tenantId],
  )

  const columns = useMemo(() => tenantColumns(handleEdit), [handleEdit])

  return (
    <ResourceListing
      columns={columns}
      defaultSort={DEFAULT_SORT}
      searchFields={SEARCH_FIELDS}
      searchPlaceholder="Search tenants by name, display name, or identifier..."
      useData={useTenants}
      filterGroups={FILTER_GROUPS}
      onRowClick={(tenant) => navigate(`/${tenantId}/tenants/${tenant.tenant_id}`)}
      onCreate={() => navigate(`/${tenantId}/tenants/create`)}
      createLabel="New Tenant"
      emptyTitle="No tenants yet"
      emptyDescription="Add your first tenant to start managing organizations, users, and authentication."
    />
  )
}
