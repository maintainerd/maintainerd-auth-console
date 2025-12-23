import { SettingsCard } from "@/components/card"
import { FormSwitchField, FormInputField } from "@/components/form"
import { RefreshCw } from "lucide-react"
import type { BasePasswordPoliciesProps } from "./types"
import type { PasswordPoliciesFormData } from "@/lib/validations"

interface ResetSettingsProps extends BasePasswordPoliciesProps {
  settings: PasswordPoliciesFormData
}

export function ResetSettings({ settings, onUpdate, errors }: ResetSettingsProps) {
  return (
    <SettingsCard
      title="Reset & Recovery"
      description="Configure password reset and recovery options"
      icon={RefreshCw}
      contentClassName="space-y-4"
    >
      <FormSwitchField
        label="Allow self-service reset"
        description="Users can reset passwords via email"
        checked={settings.allowSelfReset}
        onCheckedChange={(checked) => onUpdate({ allowSelfReset: checked })}
      />

      {settings.allowSelfReset && (
        <div className="pl-4 border-l-2 border-muted space-y-3">
          <FormInputField
            label="Reset token expiry (hours)"
            type="number"
            value={settings.resetTokenExpiry.toString()}
            onChange={(e) => onUpdate({ resetTokenExpiry: parseInt(e.target.value) || 24 })}
            error={errors?.resetTokenExpiry?.message}
            description="How long reset links remain valid"
            className="w-48"
          />

          <FormInputField
            label="Max reset attempts"
            type="number"
            value={settings.maxResetAttempts.toString()}
            onChange={(e) => onUpdate({ maxResetAttempts: parseInt(e.target.value) || 3 })}
            error={errors?.maxResetAttempts?.message}
            description="Failed attempts before lockout"
            className="w-48"
          />

          <FormInputField
            label="Reset cooldown (minutes)"
            type="number"
            value={settings.resetCooldown.toString()}
            onChange={(e) => onUpdate({ resetCooldown: parseInt(e.target.value) || 15 })}
            error={errors?.resetCooldown?.message}
            description="Wait time between reset requests"
            className="w-48"
          />
        </div>
      )}
    </SettingsCard>
  )
}
