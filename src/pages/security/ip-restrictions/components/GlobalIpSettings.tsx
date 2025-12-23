/**
 * Global IP Settings Component
 */

import { Controller } from 'react-hook-form'
import { FormSelectField } from '@/components/form'
import { FormSwitchField } from '@/components/form/FormSwitchField'
import { SettingsCard } from '@/components/card/SettingsCard'
import { Globe } from 'lucide-react'
import type { BaseIpRestrictionSettingsProps } from './types'

export function GlobalIpSettings({ control }: BaseIpRestrictionSettingsProps) {
  return (
    <SettingsCard
      icon={Globe}
      title="Global IP Settings"
      description="Configure global IP-based access control settings"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Controller
          name="ipRestrictionsEnabled"
          control={control}
          render={({ field }) => (
            <FormSwitchField
              label="Enable IP restrictions"
              description="Activate IP-based access controls"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />

        <Controller
          name="logBlockedAttempts"
          control={control}
          render={({ field }) => (
            <FormSwitchField
              label="Log blocked attempts"
              description="Record all blocked IP attempts"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
      </div>

      <Controller
        name="defaultAction"
        control={control}
        render={({ field }) => (
          <FormSelectField
            key={`defaultAction-${field.value || 'empty'}`}
            label="Default action"
            value={field.value || ''}
            onValueChange={(value) => field.onChange(value)}
            options={[
              { label: 'Allow all (whitelist mode)', value: 'allow' },
              { label: 'Deny all (blacklist mode)', value: 'deny' },
            ]}
          />
        )}
      />
    </SettingsCard>
  )
}
