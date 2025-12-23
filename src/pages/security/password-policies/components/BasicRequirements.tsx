import { SettingsCard } from "@/components/card"
import { FormSwitchField, FormInputField } from "@/components/form"
import { Lock } from "lucide-react"
import type { BasePasswordPoliciesProps } from "./types"
import type { PasswordPoliciesFormData } from "@/lib/validations"

interface BasicRequirementsProps extends BasePasswordPoliciesProps {
  settings: PasswordPoliciesFormData
}

export function BasicRequirements({ settings, onUpdate, errors }: BasicRequirementsProps) {
  return (
    <SettingsCard
      title="Basic Requirements"
      description="Configure minimum password requirements for all users"
      icon={Lock}
      contentClassName="space-y-4"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <FormInputField
          label="Minimum length"
          type="number"
          value={settings.minLength.toString()}
          onChange={(e) => onUpdate({ minLength: parseInt(e.target.value) || 4 })}
          error={errors?.minLength?.message}
          required
        />
        
        <FormInputField
          label="Maximum length"
          type="number"
          value={settings.maxLength.toString()}
          onChange={(e) => onUpdate({ maxLength: parseInt(e.target.value) || 128 })}
          error={errors?.maxLength?.message}
          required
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <FormSwitchField
          label="Require uppercase letters"
          description="At least one A-Z character"
          labelClassName="text-sm"
          descriptionClassName="text-xs"
          checked={settings.requireUppercase}
          onCheckedChange={(checked) => onUpdate({ requireUppercase: checked })}
        />

        <FormSwitchField
          label="Require lowercase letters"
          description="At least one a-z character"
          labelClassName="text-sm"
          descriptionClassName="text-xs"
          checked={settings.requireLowercase}
          onCheckedChange={(checked) => onUpdate({ requireLowercase: checked })}
        />

        <FormSwitchField
          label="Require numbers"
          description="At least one 0-9 digit"
          labelClassName="text-sm"
          descriptionClassName="text-xs"
          checked={settings.requireNumbers}
          onCheckedChange={(checked) => onUpdate({ requireNumbers: checked })}
        />

        <FormSwitchField
          label="Require special characters"
          description="At least one symbol"
          labelClassName="text-sm"
          descriptionClassName="text-xs"
          checked={settings.requireSpecialChars}
          onCheckedChange={(checked) => onUpdate({ requireSpecialChars: checked })}
        />
      </div>

      <FormInputField
        label="Allowed special characters"
        value={settings.allowedSpecialChars}
        onChange={(e) => onUpdate({ allowedSpecialChars: e.target.value })}
        error={errors?.allowedSpecialChars?.message}
        description="Characters allowed for password special character requirement"
        required
      />
    </SettingsCard>
  )
}
