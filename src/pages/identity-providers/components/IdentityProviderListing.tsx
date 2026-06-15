import { useNavigate, useParams } from "react-router-dom"
import type { SortingState } from "@tanstack/react-table"
import { ResourceListing, type FilterGroup } from "@/components/data-table"
import { identityProviderColumns } from "./IdentityProviderColumns"
import { useIdentityProvidersList } from "@/hooks/useIdentityProviders"

const DEFAULT_SORT: SortingState = [{ id: "name", desc: false }]
const SEARCH_FIELDS = ["name", "display_name", "identifier"]
const FILTER_GROUPS: readonly FilterGroup[] = [
  { key: "status", label: "Status", options: ["active", "inactive"] },
  { key: "provider", label: "Provider", options: ["internal", "cognito", "auth0", "google", "facebook", "github"] },
  { key: "is_system", label: "Type", options: ["system", "regular"] },
]

export function IdentityProviderListing() {
  const navigate = useNavigate()
  const { tenantId } = useParams<{ tenantId: string }>()

  return (
    <ResourceListing
      columns={identityProviderColumns}
      defaultSort={DEFAULT_SORT}
      searchFields={SEARCH_FIELDS}
      searchPlaceholder="Search identity providers by name, display name, or identifier..."
      useData={useIdentityProvidersList}
      filterGroups={FILTER_GROUPS}
      onRowClick={(provider) => navigate(`/${tenantId}/providers/identity/${provider.identity_provider_id}`)}
      onCreate={() => navigate(`/${tenantId}/providers/identity/create`)}
      createLabel="New Provider"
      emptyTitle="No identity providers yet"
      emptyDescription="Add an identity provider to let users authenticate through the built-in system or an external service like Cognito, Auth0, or Google."
    />
  )
}
