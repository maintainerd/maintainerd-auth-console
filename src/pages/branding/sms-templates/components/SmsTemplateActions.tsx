import { useNavigate } from "react-router-dom"
import { Eye, Edit, Play, Pause } from "lucide-react"
import { RowActions, type RowActionItem } from "@/components/data-table"
import { useUpdateSmsTemplateStatus } from "@/hooks/useSmsTemplates"
import type { SmsTemplate } from "@/services/api/sms-templates/types"

interface SmsTemplateActionsProps {
  template: SmsTemplate
}

export function SmsTemplateActions({ template }: SmsTemplateActionsProps) {
  const navigate = useNavigate()
  const updateStatusMutation = useUpdateSmsTemplateStatus()

  const isActive = template.status === "active"

  const items: RowActionItem[] = [
    {
      key: "view",
      label: "View Details",
      icon: Eye,
      onSelect: () => navigate(`/branding/sms-templates/${template.smsTemplateId}`),
    },
    {
      key: "edit",
      label: "Edit Template",
      icon: Edit,
      onSelect: () => navigate(`/branding/sms-templates/${template.smsTemplateId}/edit`),
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
  ]

  return <RowActions items={items} />
}
