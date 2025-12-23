import { SettingsCard } from "@/components/card"
import { FormSwitchField } from "@/components/form"
import { Lock } from "lucide-react"
import type { BaseSettingsProps } from "./types"

interface LoginMethodsSettingsProps extends BaseSettingsProps {
  settings: {
    passwordlessLogin: boolean
    socialLoginEnabled: boolean
    requireEmailVerification: boolean
    allowPasswordReset: boolean
  }
}

export function LoginMethodsSettings({ settings, onUpdate }: LoginMethodsSettingsProps) {
  return (
    <SettingsCard
      title="Login Methods"
      description="Configure available authentication methods for users"
      icon={Lock}
      contentClassName="space-y-4"
    >
      <div className="grid gap-3 sm:grid-cols-2">
          <FormSwitchField
            label="Enable passwordless login"
            description="Magic links or biometrics"
            labelClassName="text-sm"
            descriptionClassName="text-xs"
            checked={settings.passwordlessLogin ?? false}
            onCheckedChange={(checked) => onUpdate({ passwordlessLogin: checked })}
          />

          <FormSwitchField
            label="Enable social login"
            description="Google, GitHub, etc."
            labelClassName="text-sm"
            descriptionClassName="text-xs"
            checked={settings.socialLoginEnabled ?? true}
            onCheckedChange={(checked) => onUpdate({ socialLoginEnabled: checked })}
          />

          <FormSwitchField
            label="Require email verification"
            description="Verify email before access"
            labelClassName="text-sm"
            descriptionClassName="text-xs"
            checked={settings.requireEmailVerification ?? true}
            onCheckedChange={(checked) => onUpdate({ requireEmailVerification: checked })}
          />

          <FormSwitchField
            label="Allow password reset"
            description="Reset passwords via email"
            labelClassName="text-sm"
            descriptionClassName="text-xs"
            checked={settings.allowPasswordReset ?? true}
            onCheckedChange={(checked) => onUpdate({ allowPasswordReset: checked })}
          />
        </div>
    </SettingsCard>
  )
}
