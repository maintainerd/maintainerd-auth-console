import { useNavigate } from "react-router-dom"
import type { SortingState } from "@tanstack/react-table"
import { ResourceListing, type FilterGroup } from "@/components/data-table"
import { registrationFlowColumns } from "./RegistrationFlowColumns"
import { useRegistrationFlows } from "@/hooks/useRegistrationFlows"

const DEFAULT_SORT: SortingState = [{ id: "Created", desc: true }]
const SEARCH_FIELDS = ["name"]
const FILTER_GROUPS: readonly FilterGroup[] = [
  { key: "status", label: "Status", options: ["active", "inactive"] },
]

export function RegistrationFlowListing({ tableInCard }: { tableInCard?: boolean } = {}) {
  const navigate = useNavigate()

  return (
    <ResourceListing
      tableInCard={tableInCard}
      columns={registrationFlowColumns}
      defaultSort={DEFAULT_SORT}
      searchFields={SEARCH_FIELDS}
      searchPlaceholder="Search registration flows by name..."
      useData={useRegistrationFlows}
      filterGroups={FILTER_GROUPS}
      onRowClick={(flow) => navigate(`/registration-flows/${flow.registration_flow_id}`)}
      onCreate={() => navigate(`/registration-flows/create`)}
      createLabel="New Registration Flow"
      emptyTitle="No registration flows yet"
      emptyDescription="Create your first registration flow to define how users authenticate and onboard into your applications."
    />
  )
}
