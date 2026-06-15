import { useParams, useNavigate } from "react-router-dom"
import { Eye, Edit, Trash2, Play, Pause } from "lucide-react"
import { RowActions, type RowActionItem } from "@/components/data-table"
import { useUpdateEmailTemplateStatus, useDeleteEmailTemplate } from "@/hooks/useEmailTemplates"
import type { EmailTemplate } from "@/services/api/email-templates/types"

interface EmailTemplateActionsProps {
  template: EmailTemplate
}

export function EmailTemplateActions({ template }: EmailTemplateActionsProps) {
  const { tenantId } = useParams<{ tenantId: string }>()
  const navigate = useNavigate()
  const updateStatusMutation = useUpdateEmailTemplateStatus()
  const deleteMutation = useDeleteEmailTemplate()

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
    {
      key: "delete",
      label: "Delete Template",
      icon: Trash2,
      destructive: true,
      separatorBefore: true,
      onSelect: () => deleteMutation.mutate(template.emailTemplateId),
      confirm: {
        title: "Delete Email Template",
        description: "This action cannot be undone. This will permanently delete the email template.",
        destructive: true,
        itemName: template.name,
      },
    },
  ]

  return <RowActions items={items} />
}
