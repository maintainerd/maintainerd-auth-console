import { useNavigate, useParams } from "react-router-dom"
import type { SortingState } from "@tanstack/react-table"
import { ResourceListing, type FilterGroup } from "@/components/data-table"
import { smsTemplateColumns } from "./SmsTemplateColumns"
import { useSmsTemplatesList } from "@/hooks/useSmsTemplates"

const DEFAULT_SORT: SortingState = [{ id: "created_at", desc: true }]
const SEARCH_FIELDS = ["name"]
const FILTER_GROUPS: readonly FilterGroup[] = [
  { key: "status", label: "Status", options: ["active", "inactive"] },
]

export function SmsTemplateListing() {
  const navigate = useNavigate()
  const { tenantId } = useParams<{ tenantId: string }>()

  return (
    <ResourceListing
      columns={smsTemplateColumns}
      defaultSort={DEFAULT_SORT}
      searchFields={SEARCH_FIELDS}
      searchPlaceholder="Search templates by name..."
      useData={useSmsTemplatesList}
      filterGroups={FILTER_GROUPS}
      onRowClick={(template) => navigate(`/${tenantId}/branding/sms-templates/${template.smsTemplateId}`)}
      onCreate={() => navigate(`/${tenantId}/branding/sms-templates/create`)}
      createLabel="New Template"
      emptyTitle="No SMS templates yet"
      emptyDescription="Create your first SMS template to customize authentication and notification text messages."
    />
  )
}
