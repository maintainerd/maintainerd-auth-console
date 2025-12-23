/**
 * Bot Protection Component
 */

import { Controller } from 'react-hook-form'
import { FormSwitchField } from '@/components/form/FormSwitchField'
import { SettingsCard } from '@/components/card/SettingsCard'
import { Bot } from 'lucide-react'
import type { BaseThreatDetectionSettingsProps } from './types'

export function BotProtection({ control, watch }: BaseThreatDetectionSettingsProps) {
  const botProtectionEnabled = watch('botProtectionEnabled')

  return (
    <SettingsCard
      icon={Bot}
      title="Bot Protection"
      description="Detect and block automated attacks and bot traffic"
    >
      <Controller
        name="botProtectionEnabled"
        control={control}
        render={({ field }) => (
          <FormSwitchField
            label="Enable bot protection"
            description="Protect against automated attacks"
            checked={field.value}
            onCheckedChange={field.onChange}
          />
        )}
      />

      {botProtectionEnabled && (
        <div className="grid gap-3 pl-4 border-l-2 border-muted sm:grid-cols-2">
          <Controller
            name="captchaEnabled"
            control={control}
            render={({ field }) => (
              <FormSwitchField
                label="CAPTCHA challenges"
                description="Challenge suspicious requests"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />

          <Controller
            name="userAgentFiltering"
            control={control}
            render={({ field }) => (
              <FormSwitchField
                label="User agent filtering"
                description="Block suspicious user agents"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />

          <Controller
            name="honeypotEnabled"
            control={control}
            render={({ field }) => (
              <FormSwitchField
                label="Honeypot traps"
                description="Deploy hidden form fields"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </div>
      )}
    </SettingsCard>
  )
}
