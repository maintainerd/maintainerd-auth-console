import { SettingsCard } from "@/components/card"
import { FormSwitchField } from "@/components/form"
import { Mail } from "lucide-react"
import type { BaseSettingsProps } from "./types"

interface NotificationSettingsProps extends BaseSettingsProps {
  settings: {
    securityNotifications: boolean
    suspiciousActivityAlerts: boolean
  }
}

export function NotificationSettings({ settings, onUpdate }: NotificationSettingsProps) {
  return (
    <SettingsCard
      title="Security Notifications"
      description="Configure when to send security-related notifications"
      icon={Mail}
      contentClassName="space-y-4"
    >
      <div className="grid gap-3 sm:grid-cols-2">
          <FormSwitchField
            label="Security notifications"
            description="Email notifications for security events"
            labelClassName="text-sm"
            descriptionClassName="text-xs"
            checked={settings.securityNotifications ?? true}
            onCheckedChange={(checked) => onUpdate({ securityNotifications: checked })}
          />

          <FormSwitchField
            label="Suspicious activity alerts"
            description="Alert about unusual login patterns"
            labelClassName="text-sm"
            descriptionClassName="text-xs"
            checked={settings.suspiciousActivityAlerts ?? true}
            onCheckedChange={(checked) => onUpdate({ suspiciousActivityAlerts: checked })}
          />
        </div>
    </SettingsCard>
  )
}
