import { SettingsCard } from "@/components/card"
import { FormSwitchField, FormInputField } from "@/components/form"
import { Clock } from "lucide-react"
import type { BasePasswordPoliciesProps } from "./types"
import type { PasswordPoliciesFormData } from "@/lib/validations"

interface ExpirationSettingsProps extends BasePasswordPoliciesProps {
  settings: PasswordPoliciesFormData
}

export function ExpirationSettings({ settings, onUpdate, errors }: ExpirationSettingsProps) {
  return (
    <SettingsCard
      title="Expiration & History"
      description="Configure password expiration and history policies"
      icon={Clock}
      contentClassName="space-y-4"
    >
      <FormSwitchField
        label="Enable password expiration"
        description="Force users to change passwords periodically"
        checked={settings.passwordExpiration}
        onCheckedChange={(checked) => onUpdate({ passwordExpiration: checked })}
      />

      {settings.passwordExpiration && (
        <div className="pl-4 border-l-2 border-muted space-y-3">
          <FormInputField
            label="Expiration period (days)"
            type="number"
            value={settings.expirationDays.toString()}
            onChange={(e) => onUpdate({ expirationDays: parseInt(e.target.value) || 90 })}
            error={errors?.expirationDays?.message}
            description="Number of days before password expires"
            className="w-48"
          />

          <FormInputField
            label="Warning period (days)"
            type="number"
            value={settings.expirationWarningDays.toString()}
            onChange={(e) => onUpdate({ expirationWarningDays: parseInt(e.target.value) || 14 })}
            error={errors?.expirationWarningDays?.message}
            description="Notify users before password expires"
            className="w-48"
          />
        </div>
      )}

      <FormSwitchField
        label="Enable password history"
        description="Prevent reusing recent passwords"
        checked={settings.passwordHistory}
        onCheckedChange={(checked) => onUpdate({ passwordHistory: checked })}
      />

      {settings.passwordHistory && (
        <div className="pl-4 border-l-2 border-muted">
          <FormInputField
            label="History count"
            type="number"
            value={settings.historyCount.toString()}
            onChange={(e) => onUpdate({ historyCount: parseInt(e.target.value) || 12 })}
            error={errors?.historyCount?.message}
            description="Number of previous passwords to remember"
            className="w-48"
          />
        </div>
      )}
    </SettingsCard>
  )
}
