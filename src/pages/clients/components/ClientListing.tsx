import { useNavigate } from "react-router-dom"
import type { SortingState } from "@tanstack/react-table"
import { ResourceListing, type FilterGroup } from "@/components/data-table"
import { clientColumns } from "./ClientColumns"
import { useClientsList } from "@/hooks/useClients"

const DEFAULT_SORT: SortingState = [{ id: "created_at", desc: true }]
const SEARCH_FIELDS = ["name", "display_name"]
const FILTER_GROUPS: readonly FilterGroup[] = [
  { key: "status", label: "Status", options: ["active", "inactive"] },
  { key: "client_type", label: "Client Type", options: ["traditional", "spa", "mobile", "m2m"] },
  { key: "is_system", label: "Type", options: ["system", "regular"] },
]

export function ClientListing() {
  const navigate = useNavigate()

  return (
    <ResourceListing
      columns={clientColumns}
      defaultSort={DEFAULT_SORT}
      searchFields={SEARCH_FIELDS}
      searchPlaceholder="Search clients by name or display name..."
      useData={useClientsList}
      filterGroups={FILTER_GROUPS}
      onRowClick={(client) => navigate(`/clients/${client.client_id}`)}
      onCreate={() => navigate(`/clients/create`)}
      createLabel="New Client"
      emptyTitle="No clients yet"
      emptyDescription="Register your first client application, then connect the identity providers it can use for sign-in."
    />
  )
}
