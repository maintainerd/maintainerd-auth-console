/**
 * Rate Limiting Component
 */

import { Controller } from 'react-hook-form'
import { FormInputField } from '@/components/form'
import { FormSwitchField } from '@/components/form/FormSwitchField'
import { SettingsCard } from '@/components/card/SettingsCard'
import { Clock } from 'lucide-react'
import type { BaseIpRestrictionSettingsProps } from './types'

export function RateLimiting({ control, watch }: BaseIpRestrictionSettingsProps) {
  const rateLimitingEnabled = watch('rateLimitingEnabled')

  return (
    <SettingsCard
      icon={Clock}
      title="Rate Limiting"
      description="Configure request rate limits to prevent abuse"
    >
      <Controller
        name="rateLimitingEnabled"
        control={control}
        render={({ field }) => (
          <FormSwitchField
            label="Enable rate limiting"
            description="Limit requests per IP address"
            checked={field.value}
            onCheckedChange={field.onChange}
          />
        )}
      />

      {rateLimitingEnabled && (
        <div className="grid gap-4 pl-4 border-l-2 border-muted sm:grid-cols-2">
          <Controller
            name="requestsPerMinute"
            control={control}
            render={({ field }) => (
              <FormInputField
                label="Requests per minute"
                type="number"
                value={field.value?.toString() || ''}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                placeholder="60"
              />
            )}
          />

          <Controller
            name="burstLimit"
            control={control}
            render={({ field }) => (
              <FormInputField
                label="Burst limit"
                type="number"
                value={field.value?.toString() || ''}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                placeholder="100"
              />
            )}
          />
        </div>
      )}
    </SettingsCard>
  )
}
