/**
 * IP Restrictions Settings Page
 */

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button } from '@/components/ui/button'
import { DetailsContainer } from '@/components/container'
import { useIpRestrictionSettings, useUpdateIpRestrictionSettings } from '@/hooks/useIpRestrictionSettings'
import { useToast } from '@/hooks/useToast'
import { ipRestrictionSettingsSchema, type IpRestrictionSettingsFormData } from '@/lib/validations/ipRestrictionSettingsSchema'
import { GlobalIpSettings } from './components/GlobalIpSettings'
import { RateLimiting } from './components/RateLimiting'
import { GeoBlocking } from './components/GeoBlocking'
import { AdvancedDetection } from './components/AdvancedDetection'
import { IpAllowBlockLists } from './components/IpAllowBlockLists'

export default function IpRestrictionsPage() {
  const { data: savedSettings, isLoading, error } = useIpRestrictionSettings()
  const { mutateAsync: updateSettings, isPending } = useUpdateIpRestrictionSettings()
  const { showSuccess, showError } = useToast()

  const { control, handleSubmit, watch, formState, reset } = useForm<IpRestrictionSettingsFormData>({
    resolver: yupResolver(ipRestrictionSettingsSchema),
    defaultValues: {
      ipRestrictionsEnabled: true,
      defaultAction: 'allow',
      logBlockedAttempts: true,
      geoBlockingEnabled: false,
      rateLimitingEnabled: true,
      requestsPerMinute: 60,
      burstLimit: 100,
      blockedCountries: [],
      allowedCountries: [],
      proxyDetectionEnabled: true,
      vpnDetectionEnabled: true,
      torDetectionEnabled: true,
      cloudProviderBlocking: false,
    },
  })

  // Load saved settings when data is fetched
  useEffect(() => {
    if (savedSettings) {
      const formData: IpRestrictionSettingsFormData = {
        ipRestrictionsEnabled: savedSettings.ipRestrictionsEnabled ?? true,
        defaultAction: savedSettings.defaultAction ?? 'allow',
        logBlockedAttempts: savedSettings.logBlockedAttempts ?? true,
        geoBlockingEnabled: savedSettings.geoBlockingEnabled ?? false,
        rateLimitingEnabled: savedSettings.rateLimitingEnabled ?? true,
        requestsPerMinute: savedSettings.requestsPerMinute ?? 60,
        burstLimit: savedSettings.burstLimit ?? 100,
        blockedCountries: savedSettings.blockedCountries ?? [],
        allowedCountries: savedSettings.allowedCountries ?? [],
        proxyDetectionEnabled: savedSettings.proxyDetectionEnabled ?? true,
        vpnDetectionEnabled: savedSettings.vpnDetectionEnabled ?? true,
        torDetectionEnabled: savedSettings.torDetectionEnabled ?? true,
        cloudProviderBlocking: savedSettings.cloudProviderBlocking ?? false,
      }
      
      reset(formData)
    }
  }, [savedSettings, reset])

  const onSubmit = async (data: IpRestrictionSettingsFormData) => {
    try {
      await updateSettings({
        ip_restrictions_enabled: data.ipRestrictionsEnabled,
        default_action: data.defaultAction,
        log_blocked_attempts: data.logBlockedAttempts,
        geo_blocking_enabled: data.geoBlockingEnabled,
        rate_limiting_enabled: data.rateLimitingEnabled,
        requests_per_minute: data.requestsPerMinute,
        burst_limit: data.burstLimit,
        blocked_countries: data.blockedCountries,
        allowed_countries: data.allowedCountries,
        proxy_detection_enabled: data.proxyDetectionEnabled,
        vpn_detection_enabled: data.vpnDetectionEnabled,
        tor_detection_enabled: data.torDetectionEnabled,
        cloud_provider_blocking: data.cloudProviderBlocking,
      })
      showSuccess('IP restriction settings updated successfully')
    } catch {
      showError('Failed to update IP restriction settings')
    }
  }

  if (isLoading) {
    return (
      <DetailsContainer>
        <div className="flex h-64 items-center justify-center">
          <p className="text-muted-foreground">Loading IP restriction settings...</p>
        </div>
      </DetailsContainer>
    )
  }

  if (error) {
    return (
      <DetailsContainer>
        <div className="flex h-64 items-center justify-center">
          <p className="text-destructive">Failed to load IP restriction settings</p>
        </div>
      </DetailsContainer>
    )
  }

  return (
    <DetailsContainer>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">IP Restrictions</h1>
          <p className="text-muted-foreground">
            Configure IP-based access controls, geo-blocking, and rate limiting to protect against unauthorized access and attacks.
          </p>
        </div>

        <div className="grid gap-6">
          <GlobalIpSettings control={control} watch={watch} />
          <RateLimiting control={control} watch={watch} />
          <GeoBlocking control={control} watch={watch} />
          <AdvancedDetection control={control} watch={watch} />
          <IpAllowBlockLists />
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => reset()}
            disabled={isPending || formState.isSubmitting}
          >
            Reset
          </Button>
          <Button type="submit" disabled={isPending || formState.isSubmitting}>
            {isPending || formState.isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </DetailsContainer>
  )
}
