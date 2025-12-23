/**
 * Advanced Detection Component
 */

import { Controller } from 'react-hook-form'
import { FormSwitchField } from '@/components/form/FormSwitchField'
import { SettingsCard } from '@/components/card/SettingsCard'
import { Shield } from 'lucide-react'
import type { BaseIpRestrictionSettingsProps } from './types'

export function AdvancedDetection({ control }: BaseIpRestrictionSettingsProps) {
  return (
    <SettingsCard
      icon={Shield}
      title="Advanced Detection"
      description="Detect and block proxies, VPNs, and other anonymization methods"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Controller
          name="proxyDetectionEnabled"
          control={control}
          render={({ field }) => (
            <FormSwitchField
              label="Proxy detection"
              description="Block known proxy servers"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />

        <Controller
          name="vpnDetectionEnabled"
          control={control}
          render={({ field }) => (
            <FormSwitchField
              label="VPN detection"
              description="Block VPN connections"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />

        <Controller
          name="torDetectionEnabled"
          control={control}
          render={({ field }) => (
            <FormSwitchField
              label="Tor detection"
              description="Block Tor exit nodes"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />

        <Controller
          name="cloudProviderBlocking"
          control={control}
          render={({ field }) => (
            <FormSwitchField
              label="Cloud provider blocking"
              description="Block cloud hosting IPs"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
      </div>
    </SettingsCard>
  )
}
