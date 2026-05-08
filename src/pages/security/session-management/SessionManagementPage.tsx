/**
 * Session Management Page
 */

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button } from '@/components/ui/button'
import { DetailsContainer } from '@/components/container'
import { Save } from 'lucide-react'
import { useSessionSettings, useUpdateSessionSettings } from '@/hooks/useSessionSettings'
import { useToast } from '@/hooks/useToast'
import { sessionSettingsSchema, type SessionSettingsFormData } from '@/lib/validations/sessionSettingsSchema'
import type { SessionSettingsPayload } from '@/services/api/session-settings/types'
import { SessionTimeouts } from './components/SessionTimeouts'
import { SessionSecurity } from './components/SessionSecurity'
import { SessionMonitoring } from './components/SessionMonitoring'
import { SessionTermination } from './components/SessionTermination'
import { AdvancedSessionSettings } from './components/AdvancedSessionSettings'

export default function SessionManagementPage() {
  const { showSuccess, showError } = useToast()
  const { data: sessionSettings, isLoading } = useSessionSettings()
  const updateSettingsMutation = useUpdateSessionSettings()

  const { control, handleSubmit, reset, watch, formState: { isSubmitting } } = useForm<SessionSettingsFormData>({
    resolver: yupResolver(sessionSettingsSchema),
    defaultValues: {
      sessionTimeout: 30,
      idleTimeout: 15,
      absoluteTimeout: 480,
      rememberMeEnabled: true,
      rememberMeDuration: 30,
      concurrentSessionsEnabled: true,
      maxConcurrentSessions: 3,
      sessionBindingEnabled: true,
      ipBindingEnabled: false,
      deviceBindingEnabled: true,
      sessionLoggingEnabled: true,
      suspiciousSessionDetection: true,
      geoLocationTracking: true,
      deviceFingerprintingEnabled: true,
      forceLogoutOnPasswordChange: true,
      forceLogoutOnRoleChange: true,
      adminCanTerminateSessions: true,
      userCanViewActiveSessions: true,
      sessionTokenRotation: true,
      tokenRotationInterval: 60,
      secureSessionCookies: true,
      sameSiteCookies: 'strict',
    },
  })

  useEffect(() => {
    if (sessionSettings) {
      reset({
        sessionTimeout: sessionSettings.sessionTimeout ?? 30,
        idleTimeout: sessionSettings.idleTimeout ?? 15,
        absoluteTimeout: sessionSettings.absoluteTimeout ?? 480,
        rememberMeEnabled: sessionSettings.rememberMeEnabled ?? true,
        rememberMeDuration: sessionSettings.rememberMeDuration ?? 30,
        concurrentSessionsEnabled: sessionSettings.concurrentSessionsEnabled ?? true,
        maxConcurrentSessions: sessionSettings.maxConcurrentSessions ?? 3,
        sessionBindingEnabled: sessionSettings.sessionBindingEnabled ?? true,
        ipBindingEnabled: sessionSettings.ipBindingEnabled ?? false,
        deviceBindingEnabled: sessionSettings.deviceBindingEnabled ?? true,
        sessionLoggingEnabled: sessionSettings.sessionLoggingEnabled ?? true,
        suspiciousSessionDetection: sessionSettings.suspiciousSessionDetection ?? true,
        geoLocationTracking: sessionSettings.geoLocationTracking ?? true,
        deviceFingerprintingEnabled: sessionSettings.deviceFingerprintingEnabled ?? true,
        forceLogoutOnPasswordChange: sessionSettings.forceLogoutOnPasswordChange ?? true,
        forceLogoutOnRoleChange: sessionSettings.forceLogoutOnRoleChange ?? true,
        adminCanTerminateSessions: sessionSettings.adminCanTerminateSessions ?? true,
        userCanViewActiveSessions: sessionSettings.userCanViewActiveSessions ?? true,
        sessionTokenRotation: sessionSettings.sessionTokenRotation ?? true,
        tokenRotationInterval: sessionSettings.tokenRotationInterval ?? 60,
        secureSessionCookies: sessionSettings.secureSessionCookies ?? true,
        sameSiteCookies: sessionSettings.sameSiteCookies ?? 'strict',
      })
    }
  }, [sessionSettings, reset])

  const onSubmit = async (data: SessionSettingsFormData) => {
    try {
      const payload: SessionSettingsPayload = {
        session_timeout: data.sessionTimeout,
        idle_timeout: data.idleTimeout,
        absolute_timeout: data.absoluteTimeout,
        remember_me_enabled: data.rememberMeEnabled,
        remember_me_duration: data.rememberMeDuration,
        concurrent_sessions_enabled: data.concurrentSessionsEnabled,
        max_concurrent_sessions: data.maxConcurrentSessions,
        session_binding_enabled: data.sessionBindingEnabled,
        ip_binding_enabled: data.ipBindingEnabled,
        device_binding_enabled: data.deviceBindingEnabled,
        session_logging_enabled: data.sessionLoggingEnabled,
        suspicious_session_detection: data.suspiciousSessionDetection,
        geo_location_tracking: data.geoLocationTracking,
        device_fingerprinting_enabled: data.deviceFingerprintingEnabled,
        force_logout_on_password_change: data.forceLogoutOnPasswordChange,
        force_logout_on_role_change: data.forceLogoutOnRoleChange,
        admin_can_terminate_sessions: data.adminCanTerminateSessions,
        user_can_view_active_sessions: data.userCanViewActiveSessions,
        session_token_rotation: data.sessionTokenRotation,
        token_rotation_interval: data.tokenRotationInterval,
        secure_session_cookies: data.secureSessionCookies,
        same_site_cookies: data.sameSiteCookies,
      }

      await updateSettingsMutation.mutateAsync(payload)
      showSuccess('Session settings saved successfully')
    } catch (error) {
      showError(error)
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <DetailsContainer>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <div className="text-center">
            <h2 className="text-2xl font-semibold">Loading...</h2>
            <p className="text-muted-foreground mt-2">
              Fetching session settings
            </p>
          </div>
        </div>
      </DetailsContainer>
    )
  }

  return (
    <DetailsContainer>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">Session Management</h1>
          <p className="text-muted-foreground">
            Configure user session timeouts, security policies, and monitoring to protect against unauthorized access.
          </p>
        </div>

        <div className="grid gap-6">
          <SessionTimeouts control={control} watch={watch} />
          <SessionSecurity control={control} watch={watch} />
          <SessionMonitoring control={control} watch={watch} />
          <SessionTermination control={control} watch={watch} />
          <AdvancedSessionSettings control={control} watch={watch} />

          <div className="flex justify-end">
            <Button 
              type="submit" 
              className="min-w-[140px] px-6"
              disabled={updateSettingsMutation.isPending || isSubmitting}
            >
              <Save className="mr-2 h-4 w-4" />
              {updateSettingsMutation.isPending || isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </form>
    </DetailsContainer>
  )
}
