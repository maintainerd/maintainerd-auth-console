import { useNavigate, useParams } from "react-router-dom"
import type { SortingState } from "@tanstack/react-table"
import { ResourceListing, type FilterGroup } from "@/components/data-table"
import { emailTemplateColumns } from "./EmailTemplateColumns"
import { useEmailTemplatesList } from "@/hooks/useEmailTemplates"

const DEFAULT_SORT: SortingState = [{ id: "created_at", desc: true }]
const SEARCH_FIELDS = ["name", "subject"]
const FILTER_GROUPS: readonly FilterGroup[] = [
  { key: "status", label: "Status", options: ["active", "inactive"] },
]

export function EmailTemplateListing() {
  const navigate = useNavigate()
  const { tenantId } = useParams<{ tenantId: string }>()

  return (
    <ResourceListing
      columns={emailTemplateColumns}
      defaultSort={DEFAULT_SORT}
      searchFields={SEARCH_FIELDS}
      searchPlaceholder="Search templates by name or subject..."
      useData={useEmailTemplatesList}
      filterGroups={FILTER_GROUPS}
      onRowClick={(template) => navigate(`/${tenantId}/branding/email-templates/${template.emailTemplateId}`)}
      onCreate={() => navigate(`/${tenantId}/branding/email-templates/create`)}
      createLabel="New Template"
      emptyTitle="No email templates yet"
      emptyDescription="Create your first email template to customize authentication and notification emails."
    />
  )
}
