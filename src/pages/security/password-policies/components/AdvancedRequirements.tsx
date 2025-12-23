import { SettingsCard } from "@/components/card"
import { FormSwitchField, FormInputField } from "@/components/form"
import { Shield } from "lucide-react"
import type { BasePasswordPoliciesProps } from "./types"
import type { PasswordPoliciesFormData } from "@/lib/validations"

interface AdvancedRequirementsProps extends BasePasswordPoliciesProps {
  settings: PasswordPoliciesFormData
}

export function AdvancedRequirements({ settings, onUpdate, errors }: AdvancedRequirementsProps) {
  return (
    <SettingsCard
      title="Advanced Requirements"
      description="Additional security checks for password validation"
      icon={Shield}
      contentClassName="space-y-4"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <FormSwitchField
          label="Prevent common passwords"
          description="Block commonly used passwords"
          labelClassName="text-sm"
          descriptionClassName="text-xs"
          checked={settings.preventCommonPasswords}
          onCheckedChange={(checked) => onUpdate({ preventCommonPasswords: checked })}
        />

        <FormSwitchField
          label="Prevent user info in password"
          description="Block name, email in passwords"
          labelClassName="text-sm"
          descriptionClassName="text-xs"
          checked={settings.preventUserInfoInPassword}
          onCheckedChange={(checked) => onUpdate({ preventUserInfoInPassword: checked })}
        />

        <FormSwitchField
          label="Prevent sequential characters"
          description="Block abc, 123, etc."
          labelClassName="text-sm"
          descriptionClassName="text-xs"
          checked={settings.preventSequentialChars}
          onCheckedChange={(checked) => onUpdate({ preventSequentialChars: checked })}
        />

        <FormSwitchField
          label="Prevent repeating characters"
          description="Limit character repetition"
          labelClassName="text-sm"
          descriptionClassName="text-xs"
          checked={settings.preventRepeatingChars}
          onCheckedChange={(checked) => onUpdate({ preventRepeatingChars: checked })}
        />
      </div>

      {settings.preventRepeatingChars && (
        <div className="pl-4 border-l-2 border-muted">
          <FormInputField
            label="Max repeating characters"
            type="number"
            value={settings.maxRepeatingChars.toString()}
            onChange={(e) => onUpdate({ maxRepeatingChars: parseInt(e.target.value) || 3 })}
            error={errors?.maxRepeatingChars?.message}
            description="Maximum number of consecutive same characters allowed"
            className="w-48"
          />
        </div>
      )}
    </SettingsCard>
  )
}
