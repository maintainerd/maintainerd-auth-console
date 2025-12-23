import { SettingsCard } from "@/components/card"
import { FormSwitchField, FormSelectField, type SelectOption } from "@/components/form"
import { AlertTriangle } from "lucide-react"
import type { BasePasswordPoliciesProps } from "./types"
import type { PasswordPoliciesFormData } from "@/lib/validations"
import { Controller } from "react-hook-form"
import type { Control } from "react-hook-form"

interface StrengthRequirementsProps extends BasePasswordPoliciesProps {
  settings: PasswordPoliciesFormData
  control: Control<PasswordPoliciesFormData>
}

const STRENGTH_SCORE_OPTIONS: SelectOption[] = [
  { value: "1", label: "1 - Very Weak" },
  { value: "2", label: "2 - Weak" },
  { value: "3", label: "3 - Fair" },
  { value: "4", label: "4 - Good" },
  { value: "5", label: "5 - Strong" },
]

export function StrengthRequirements({ settings, control, onUpdate, errors }: StrengthRequirementsProps) {
  return (
    <SettingsCard
      title="Strength Requirements"
      description="Configure password strength validation"
      icon={AlertTriangle}
      contentClassName="space-y-4"
    >
      <Controller
        name="minimumStrengthScore"
        control={control}
        render={({ field }) => (
          <FormSelectField
            key={`minimumStrengthScore-${field.value || 'empty'}`}
            label="Minimum strength score"
            description="Minimum acceptable password strength level"
            options={STRENGTH_SCORE_OPTIONS}
            value={field.value?.toString()}
            onValueChange={(value) => field.onChange(parseInt(value))}
            error={errors?.minimumStrengthScore?.message}
            className="w-48"
          />
        )}
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <FormSwitchField
          label="Show strength meter"
          description="Display visual strength indicator"
          labelClassName="text-sm"
          descriptionClassName="text-xs"
          checked={settings.showStrengthMeter}
          onCheckedChange={(checked) => onUpdate({ showStrengthMeter: checked })}
        />

        <FormSwitchField
          label="Block weak passwords"
          description="Reject passwords below minimum score"
          labelClassName="text-sm"
          descriptionClassName="text-xs"
          checked={settings.blockWeakPasswords}
          onCheckedChange={(checked) => onUpdate({ blockWeakPasswords: checked })}
        />
      </div>
    </SettingsCard>
  )
}
