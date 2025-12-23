/**
 * Brute Force Protection Component
 */

import { Controller } from 'react-hook-form'
import { FormSelectField } from '@/components/form'
import { FormSwitchField } from '@/components/form/FormSwitchField'
import { SettingsCard } from '@/components/card/SettingsCard'
import { Shield } from 'lucide-react'
import type { BaseThreatDetectionSettingsProps } from './types'

export function BruteForceProtection({ control, watch }: BaseThreatDetectionSettingsProps) {
  const bruteForceEnabled = watch('bruteForceEnabled')

  return (
    <SettingsCard
      icon={Shield}
      title="Brute Force Protection"
      description="Detect and prevent brute force attacks on login endpoints"
    >
      <Controller
        name="bruteForceEnabled"
        control={control}
        render={({ field }) => (
          <FormSwitchField
            label="Enable brute force protection"
            description="Monitor and block repeated failed login attempts"
            checked={field.value}
            onCheckedChange={field.onChange}
          />
        )}
      />

      {bruteForceEnabled && (
        <div className="grid gap-4 pl-4 border-l-2 border-muted sm:grid-cols-3">
          <Controller
            name="maxFailedAttempts"
            control={control}
            render={({ field }) => (
              <FormSelectField
                key={`maxFailedAttempts-${field.value || 'empty'}`}
                label="Max failed attempts"
                value={field.value?.toString() || ''}
                onValueChange={(value) => field.onChange(parseInt(value))}
                options={[
                  { label: '3 attempts', value: '3' },
                  { label: '5 attempts', value: '5' },
                  { label: '10 attempts', value: '10' },
                  { label: '15 attempts', value: '15' },
                ]}
              />
            )}
          />

          <Controller
            name="bruteForceWindow"
            control={control}
            render={({ field }) => (
              <FormSelectField
                key={`bruteForceWindow-${field.value || 'empty'}`}
                label="Detection window (minutes)"
                value={field.value?.toString() || ''}
                onValueChange={(value) => field.onChange(parseInt(value))}
                options={[
                  { label: '5 minutes', value: '5' },
                  { label: '10 minutes', value: '10' },
                  { label: '15 minutes', value: '15' },
                  { label: '30 minutes', value: '30' },
                ]}
              />
            )}
          />

          <Controller
            name="accountLockoutDuration"
            control={control}
            render={({ field }) => (
              <FormSelectField
                key={`accountLockoutDuration-${field.value || 'empty'}`}
                label="Account lockout duration (minutes)"
                value={field.value?.toString() || ''}
                onValueChange={(value) => field.onChange(parseInt(value))}
                options={[
                  { label: '15 minutes', value: '15' },
                  { label: '30 minutes', value: '30' },
                  { label: '1 hour', value: '60' },
                  { label: '4 hours', value: '240' },
                  { label: '24 hours', value: '1440' },
                ]}
              />
            )}
          />
        </div>
      )}
    </SettingsCard>
  )
}
