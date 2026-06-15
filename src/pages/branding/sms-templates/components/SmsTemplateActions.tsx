import { useParams, useNavigate } from "react-router-dom"
import { Eye, Edit, Trash2, Play, Pause } from "lucide-react"
import { RowActions, type RowActionItem } from "@/components/data-table"
import { useUpdateSmsTemplateStatus, useDeleteSmsTemplate } from "@/hooks/useSmsTemplates"
import type { SmsTemplate } from "@/services/api/sms-templates/types"

interface SmsTemplateActionsProps {
  template: SmsTemplate
}

export function SmsTemplateActions({ template }: SmsTemplateActionsProps) {
  const { tenantId } = useParams<{ tenantId: string }>()
  const navigate = useNavigate()
  const updateStatusMutation = useUpdateSmsTemplateStatus()
  const deleteMutation = useDeleteSmsTemplate()

  const isActive = template.status === "active"

  const items: RowActionItem[] = [
    {
      key: "view",
      label: "View Details",
      icon: Eye,
      onSelect: () => navigate(`/${tenantId}/branding/sms-templates/${template.smsTemplateId}`),
    },
    {
      key: "edit",
      label: "Edit Template",
      icon: Edit,
      onSelect: () => navigate(`/${tenantId}/branding/sms-templates/${template.smsTemplateId}/edit`),
    },
    ...(isActive
      ? [
          {
            key: "deactivate",
            label: "Deactivate",
            icon: Pause,
            onSelect: () => updateStatusMutation.mutate({ id: template.smsTemplateId, data: { status: "inactive" } }),
          } satisfies RowActionItem,
        ]
      : [
          {
            key: "activate",
            label: "Activate",
            icon: Play,
            onSelect: () => updateStatusMutation.mutate({ id: template.smsTemplateId, data: { status: "active" } }),
          } satisfies RowActionItem,
        ]),
    {
      key: "delete",
      label: "Delete Template",
      icon: Trash2,
      destructive: true,
      separatorBefore: true,
      onSelect: () => deleteMutation.mutate(template.smsTemplateId),
      confirm: {
        title: "Delete SMS Template",
        description: "This action cannot be undone. This will permanently delete the SMS template.",
        destructive: true,
        itemName: template.name,
      },
    },
  ]

  return <RowActions items={items} />
}
