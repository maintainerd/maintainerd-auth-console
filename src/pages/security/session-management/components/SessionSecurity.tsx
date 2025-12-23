/**
 * Session Security Component
 */

import { Controller } from 'react-hook-form'
import { FormSelectField } from '@/components/form'
import { FormSwitchField } from '@/components/form/FormSwitchField'
import { SettingsCard } from '@/components/card/SettingsCard'
import { Shield } from 'lucide-react'
import type { BaseSessionSettingsProps } from './types'

export function SessionSecurity({ control, watch }: BaseSessionSettingsProps) {
  const concurrentSessionsEnabled = watch('concurrentSessionsEnabled')

  return (
    <SettingsCard
      icon={Shield}
      title="Session Security"
      description="Configure session binding and concurrent session policies"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Controller
          name="concurrentSessionsEnabled"
          control={control}
          render={({ field }) => (
            <FormSwitchField
              label="Limit concurrent sessions"
              description="Restrict multiple logins"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />

        <Controller
          name="sessionBindingEnabled"
          control={control}
          render={({ field }) => (
            <FormSwitchField
              label="Session binding"
              description="Bind sessions to browser"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />

        <Controller
          name="ipBindingEnabled"
          control={control}
          render={({ field }) => (
            <FormSwitchField
              label="IP address binding"
              description="Bind sessions to IP"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />

        <Controller
          name="deviceBindingEnabled"
          control={control}
          render={({ field }) => (
            <FormSwitchField
              label="Device binding"
              description="Bind sessions to device"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
      </div>

      {concurrentSessionsEnabled && (
        <div className="pl-4 border-l-2 border-muted">
          <Controller
            name="maxConcurrentSessions"
            control={control}
            render={({ field }) => (
              <FormSelectField
                key={`maxConcurrentSessions-${field.value || 'empty'}`}
                label="Maximum concurrent sessions"
                value={field.value?.toString() || ''}
                onValueChange={(value) => field.onChange(parseInt(value))}
                options={[
                  { label: '1 session', value: '1' },
                  { label: '2 sessions', value: '2' },
                  { label: '3 sessions', value: '3' },
                  { label: '5 sessions', value: '5' },
                  { label: '10 sessions', value: '10' },
                ]}
              />
            )}
          />
        </div>
      )}
    </SettingsCard>
  )
}
