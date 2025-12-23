/**
 * Advanced Session Settings Component
 */

import { Controller } from 'react-hook-form'
import { FormSelectField } from '@/components/form'
import { FormSwitchField } from '@/components/form/FormSwitchField'
import { SettingsCard } from '@/components/card/SettingsCard'
import { Globe } from 'lucide-react'
import type { BaseSessionSettingsProps } from './types'

export function AdvancedSessionSettings({ control, watch }: BaseSessionSettingsProps) {
  const sessionTokenRotation = watch('sessionTokenRotation')

  return (
    <SettingsCard
      icon={Globe}
      title="Advanced Settings"
      description="Configure session token rotation and cookie security settings"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Controller
          name="sessionTokenRotation"
          control={control}
          render={({ field }) => (
            <FormSwitchField
              label="Session token rotation"
              description="Rotate tokens periodically"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />

        <Controller
          name="secureSessionCookies"
          control={control}
          render={({ field }) => (
            <FormSwitchField
              label="Secure session cookies"
              description="Use secure cookie flags"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
      </div>

      {sessionTokenRotation && (
        <div className="grid gap-4 pl-4 border-l-2 border-muted sm:grid-cols-2">
          <Controller
            name="tokenRotationInterval"
            control={control}
            render={({ field }) => (
              <FormSelectField
                key={`tokenRotationInterval-${field.value || 'empty'}`}
                label="Token rotation interval (minutes)"
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
            name="sameSiteCookies"
            control={control}
            render={({ field }) => (
              <FormSelectField
                key={`sameSiteCookies-${field.value || 'empty'}`}
                label="SameSite cookie policy"
                value={field.value || ''}
                onValueChange={(value) => field.onChange(value)}
                options={[
                  { label: 'Strict', value: 'strict' },
                  { label: 'Lax', value: 'lax' },
                  { label: 'None', value: 'none' },
                ]}
              />
            )}
          />
        </div>
      )}
    </SettingsCard>
  )
}
