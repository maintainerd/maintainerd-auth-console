/**
 * Session Termination Component
 */

import { Controller } from 'react-hook-form'
import { FormSwitchField } from '@/components/form/FormSwitchField'
import { SettingsCard } from '@/components/card/SettingsCard'
import { Users } from 'lucide-react'
import type { BaseSessionSettingsProps } from './types'

export function SessionTermination({ control }: BaseSessionSettingsProps) {
  return (
    <SettingsCard
      icon={Users}
      title="Session Termination"
      description="Configure automatic session termination and user session management"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Controller
          name="forceLogoutOnPasswordChange"
          control={control}
          render={({ field }) => (
            <FormSwitchField
              label="Force logout on password change"
              description="End all sessions when password changes"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />

        <Controller
          name="forceLogoutOnRoleChange"
          control={control}
          render={({ field }) => (
            <FormSwitchField
              label="Force logout on role change"
              description="End sessions when permissions change"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />

        <Controller
          name="adminCanTerminateSessions"
          control={control}
          render={({ field }) => (
            <FormSwitchField
              label="Admin can terminate sessions"
              description="Allow admins to end user sessions"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />

        <Controller
          name="userCanViewActiveSessions"
          control={control}
          render={({ field }) => (
            <FormSwitchField
              label="Users can view active sessions"
              description="Show users their active sessions"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
      </div>
    </SettingsCard>
  )
}
