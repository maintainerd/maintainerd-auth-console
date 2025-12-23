/**
 * Response Actions Component
 */

import { Controller } from 'react-hook-form'
import { FormSwitchField } from '@/components/form/FormSwitchField'
import { FormCheckboxField } from '@/components/form'
import { SettingsCard } from '@/components/card/SettingsCard'
import { AlertTriangle } from 'lucide-react'
import type { BaseThreatDetectionSettingsProps } from './types'

export function ResponseActions({ control }: BaseThreatDetectionSettingsProps) {

  return (
    <SettingsCard
      icon={AlertTriangle}
      title="Response Actions"
      description="Configure automated responses to detected threats"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Controller
          name="autoResponseEnabled"
          control={control}
          render={({ field }) => (
            <FormSwitchField
              label="Auto-response"
              description="Automatically respond to threats"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />

        <Controller
          name="escalationEnabled"
          control={control}
          render={({ field }) => (
            <FormSwitchField
              label="Escalation"
              description="Escalate critical threats"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />

        <Controller
          name="quarantineEnabled"
          control={control}
          render={({ field }) => (
            <FormSwitchField
              label="Quarantine"
              description="Isolate affected accounts"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
      </div>

      <div className="space-y-3 pl-4 border-l-2 border-muted">
        <p className="text-sm font-medium">Notification Channels</p>
        <div className="space-y-2">
          <Controller
            name="notificationChannels"
            control={control}
            render={({ field }) => (
              <>
                <FormCheckboxField
                  label="Email notifications"
                  checked={field.value?.includes('email') ?? false}
                  onCheckedChange={(checked) => {
                    const channels = checked
                      ? [...(field.value || []), 'email']
                      : (field.value || []).filter(c => c !== 'email')
                    field.onChange(channels)
                  }}
                />
                <FormCheckboxField
                  label="Webhook notifications"
                  checked={field.value?.includes('webhook') ?? false}
                  onCheckedChange={(checked) => {
                    const channels = checked
                      ? [...(field.value || []), 'webhook']
                      : (field.value || []).filter(c => c !== 'webhook')
                    field.onChange(channels)
                  }}
                />
                <FormCheckboxField
                  label="SMS notifications"
                  checked={field.value?.includes('sms') ?? false}
                  onCheckedChange={(checked) => {
                    const channels = checked
                      ? [...(field.value || []), 'sms']
                      : (field.value || []).filter(c => c !== 'sms')
                    field.onChange(channels)
                  }}
                />
              </>
            )}
          />
        </div>
      </div>
    </SettingsCard>
  )
}
