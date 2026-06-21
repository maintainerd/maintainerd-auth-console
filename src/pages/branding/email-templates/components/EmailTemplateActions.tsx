import { useParams, useNavigate } from "react-router-dom"
import { Eye, Edit, Play, Pause } from "lucide-react"
import { RowActions, type RowActionItem } from "@/components/data-table"
import { useUpdateEmailTemplateStatus } from "@/hooks/useEmailTemplates"
import type { EmailTemplate } from "@/services/api/email-templates/types"

interface EmailTemplateActionsProps {
  template: EmailTemplate
}

export function EmailTemplateActions({ template }: EmailTemplateActionsProps) {
  const { tenantId } = useParams<{ tenantId: string }>()
  const navigate = useNavigate()
  const updateStatusMutation = useUpdateEmailTemplateStatus()

  const isActive = template.status === "active"

  const items: RowActionItem[] = [
    {
      key: "view",
      label: "View Details",
      icon: Eye,
      onSelect: () => navigate(`/${tenantId}/branding/email-templates/${template.emailTemplateId}`),
    },
    {
      key: "edit",
      label: "Edit Template",
      icon: Edit,
      onSelect: () => navigate(`/${tenantId}/branding/email-templates/${template.emailTemplateId}/edit`),
    },
    ...(isActive
      ? [
          {
            key: "deactivate",
            label: "Deactivate",
            icon: Pause,
            onSelect: () => updateStatusMutation.mutate({ id: template.emailTemplateId, data: { status: "inactive" } }),
          } satisfies RowActionItem,
        ]
      : [
          {
            key: "activate",
            label: "Activate",
            icon: Play,
            onSelect: () => updateStatusMutation.mutate({ id: template.emailTemplateId, data: { status: "active" } }),
          } satisfies RowActionItem,
        ]),
  ]

  return <RowActions items={items} />
}
