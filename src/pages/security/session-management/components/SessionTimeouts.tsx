/**
 * Session Timeouts Component
 */

import { Controller } from 'react-hook-form'
import { FormSelectField } from '@/components/form'
import { FormSwitchField } from '@/components/form/FormSwitchField'
import { SettingsCard } from '@/components/card/SettingsCard'
import { Clock } from 'lucide-react'
import type { BaseSessionSettingsProps } from './types'

export function SessionTimeouts({ control }: BaseSessionSettingsProps) {
  return (
    <SettingsCard
      icon={Clock}
      title="Session Timeouts"
      description="Configure automatic session expiration and timeout policies"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Controller
          name="sessionTimeout"
          control={control}
          render={({ field }) => (
            <FormSelectField
              key={`sessionTimeout-${field.value || 'empty'}`}
              label="Session timeout (minutes)"
              value={field.value?.toString() || ''}
              onValueChange={(value) => field.onChange(parseInt(value))}
              options={[
                { label: '15 minutes', value: '15' },
                { label: '30 minutes', value: '30' },
                { label: '1 hour', value: '60' },
                { label: '2 hours', value: '120' },
                { label: '4 hours', value: '240' },
              ]}
            />
          )}
        />

        <Controller
          name="idleTimeout"
          control={control}
          render={({ field }) => (
            <FormSelectField
              key={`idleTimeout-${field.value || 'empty'}`}
              label="Idle timeout (minutes)"
              value={field.value?.toString() || ''}
              onValueChange={(value) => field.onChange(parseInt(value))}
              options={[
                { label: '5 minutes', value: '5' },
                { label: '10 minutes', value: '10' },
                { label: '15 minutes', value: '15' },
                { label: '30 minutes', value: '30' },
                { label: '1 hour', value: '60' },
              ]}
            />
          )}
        />

        <Controller
          name="absoluteTimeout"
          control={control}
          render={({ field }) => (
            <FormSelectField
              key={`absoluteTimeout-${field.value || 'empty'}`}
              label="Absolute timeout (minutes)"
              value={field.value?.toString() || ''}
              onValueChange={(value) => field.onChange(parseInt(value))}
              options={[
                { label: '4 hours', value: '240' },
                { label: '8 hours', value: '480' },
                { label: '12 hours', value: '720' },
                { label: '24 hours', value: '1440' },
              ]}
            />
          )}
        />

        <Controller
          name="rememberMeDuration"
          control={control}
          render={({ field }) => (
            <FormSelectField
              key={`rememberMeDuration-${field.value || 'empty'}`}
              label="Remember me duration (days)"
              value={field.value?.toString() || ''}
              onValueChange={(value) => field.onChange(parseInt(value))}
              options={[
                { label: '7 days', value: '7' },
                { label: '14 days', value: '14' },
                { label: '30 days', value: '30' },
                { label: '90 days', value: '90' },
              ]}
            />
          )}
        />
      </div>

      <Controller
        name="rememberMeEnabled"
        control={control}
        render={({ field }) => (
          <FormSwitchField
            label='Enable "Remember Me" option'
            description="Allow users to stay logged in longer"
            checked={field.value}
            onCheckedChange={field.onChange}
          />
        )}
      />
    </SettingsCard>
  )
}
