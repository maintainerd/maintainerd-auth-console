import { SettingsCard } from "@/components/card"
import { FormSwitchField } from "@/components/form"
import { Settings } from "lucide-react"
import type { BaseSettingsProps } from "./types"

interface AdvancedSecuritySettingsProps extends BaseSettingsProps {
  settings: {
    deviceTrustEnabled: boolean
    anonymousAnalytics: boolean
  }
}

export function AdvancedSecuritySettings({ settings, onUpdate }: AdvancedSecuritySettingsProps) {
  return (
    <SettingsCard
      title="Advanced Security"
      description="Additional security monitoring and tracking capabilities"
      icon={Settings}
      contentClassName="space-y-4"
    >
      <div className="grid gap-3 sm:grid-cols-2">
          <FormSwitchField
            label="Device trust"
            description="Track and manage trusted devices"
            labelClassName="text-sm"
            descriptionClassName="text-xs"
            checked={settings.deviceTrustEnabled ?? false}
            onCheckedChange={(checked) => onUpdate({ deviceTrustEnabled: checked })}
          />

          <FormSwitchField
            label="Anonymous analytics"
            description="Collect anonymized usage data"
            labelClassName="text-sm"
            descriptionClassName="text-xs"
            checked={settings.anonymousAnalytics ?? true}
            onCheckedChange={(checked) => onUpdate({ anonymousAnalytics: checked })}
          />
        </div>
    </SettingsCard>
  )
}
