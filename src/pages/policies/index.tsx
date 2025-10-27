import { PolicyDataTable } from "./components/PolicyDataTable"
import { policyColumns } from "./components/PolicyColumns"
import { MOCK_POLICIES } from "./constants"

export default function PoliciesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Policy Management</h1>
        <p className="text-muted-foreground">
          Manage AWS-style policies that control access to services and resources. Create, configure, and apply policies with fine-grained permissions using allow and deny statements for comprehensive access control.
        </p>
      </div>

      <PolicyDataTable columns={policyColumns} data={MOCK_POLICIES} />
    </div>
  )
}
