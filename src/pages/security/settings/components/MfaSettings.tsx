import { SettingsCard } from "@/components/card"
import { FormSwitchField, FormCheckboxField } from "@/components/form"
import { Smartphone } from "lucide-react"
import type { BaseSettingsProps } from "./types"

interface MfaSettingsProps extends BaseSettingsProps {
  settings: {
    mfaRequired: boolean
    mfaMethods: string[]
  }
}

export function MfaSettings({ settings, onUpdate, errors }: MfaSettingsProps) {
  return (
    <SettingsCard
      title="Multi-Factor Authentication"
      description="Require additional verification methods for enhanced security"
      icon={Smartphone}
      contentClassName="space-y-4"
    >
      <FormSwitchField
          label="Require MFA for all users"
          description="Force all users to set up multi-factor authentication"
          checked={settings.mfaRequired ?? true}
          onCheckedChange={(checked) => onUpdate({ mfaRequired: checked })}
        />

        {settings.mfaRequired && (
          <div className="space-y-3 pl-4 border-l-2 border-muted">
            <p className="text-sm font-medium">Available MFA Methods</p>
            <div className="space-y-2">
              <FormCheckboxField
                label="Authenticator App (TOTP)"
                checked={settings.mfaMethods?.includes("authenticator") ?? false}
                onCheckedChange={(checked) => {
                  const methods = checked
                    ? [...(settings.mfaMethods || []), "authenticator"]
                    : (settings.mfaMethods || []).filter(m => m !== "authenticator")
                  onUpdate({ mfaMethods: methods })
                }}
              />
              <FormCheckboxField
                label="SMS Text Message"
                checked={settings.mfaMethods?.includes("sms") ?? false}
                onCheckedChange={(checked) => {
                  const methods = checked
                    ? [...(settings.mfaMethods || []), "sms"]
                    : (settings.mfaMethods || []).filter(m => m !== "sms")
                  onUpdate({ mfaMethods: methods })
                }}
              />
              <FormCheckboxField
                label="Email Verification"
                checked={settings.mfaMethods?.includes("email") ?? false}
                onCheckedChange={(checked) => {
                  const methods = checked
                    ? [...(settings.mfaMethods || []), "email"]
                    : (settings.mfaMethods || []).filter(m => m !== "email")
                  onUpdate({ mfaMethods: methods })
                }}
                error={errors?.mfaMethods?.message}
              />
            </div>
          </div>
        )}
    </SettingsCard>
  )
}
