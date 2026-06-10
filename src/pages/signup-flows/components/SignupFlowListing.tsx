import { useNavigate, useParams } from "react-router-dom"
import type { SortingState } from "@tanstack/react-table"
import { ResourceListing, type FilterGroup } from "@/components/data-table"
import { signupFlowColumns } from "./SignupFlowColumns"
import { useSignupFlows } from "@/hooks/useSignupFlows"

const DEFAULT_SORT: SortingState = [{ id: "Created", desc: true }]
const SEARCH_FIELDS = ["name"]
const FILTER_GROUPS: readonly FilterGroup[] = [
  { key: "status", label: "Status", options: ["active", "inactive"] },
]

export function SignupFlowListing() {
  const navigate = useNavigate()
  const { tenantId } = useParams<{ tenantId: string }>()

  return (
    <ResourceListing
      columns={signupFlowColumns}
      defaultSort={DEFAULT_SORT}
      searchFields={SEARCH_FIELDS}
      searchPlaceholder="Search auth flows by name..."
      useData={useSignupFlows}
      filterGroups={FILTER_GROUPS}
      onRowClick={(flow) => navigate(`/${tenantId}/auth-flows/${flow.signup_flow_id}`)}
      onCreate={() => navigate(`/${tenantId}/auth-flows/create`)}
      createLabel="New Auth Flow"
    />
  )
}
