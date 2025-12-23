/**
 * Session Settings Validation Schema
 */

import * as yup from 'yup'

export const sessionSettingsSchema = yup.object({
  // Session Timeouts
  sessionTimeout: yup.number().required().min(5).max(1440),
  idleTimeout: yup.number().required().min(5).max(1440),
  absoluteTimeout: yup.number().required().min(60).max(1440),
  rememberMeEnabled: yup.boolean().required(),
  rememberMeDuration: yup.number().required().min(1).max(90),
  
  // Session Security
  concurrentSessionsEnabled: yup.boolean().required(),
  maxConcurrentSessions: yup.number().required().min(1).max(20),
  sessionBindingEnabled: yup.boolean().required(),
  ipBindingEnabled: yup.boolean().required(),
  deviceBindingEnabled: yup.boolean().required(),
  
  // Session Monitoring
  sessionLoggingEnabled: yup.boolean().required(),
  suspiciousSessionDetection: yup.boolean().required(),
  geoLocationTracking: yup.boolean().required(),
  deviceFingerprintingEnabled: yup.boolean().required(),
  
  // Session Termination
  forceLogoutOnPasswordChange: yup.boolean().required(),
  forceLogoutOnRoleChange: yup.boolean().required(),
  adminCanTerminateSessions: yup.boolean().required(),
  userCanViewActiveSessions: yup.boolean().required(),
  
  // Advanced Settings
  sessionTokenRotation: yup.boolean().required(),
  tokenRotationInterval: yup.number().required().min(15).max(1440),
  secureSessionCookies: yup.boolean().required(),
  sameSiteCookies: yup.string().required().oneOf(['strict', 'lax', 'none']),
}).required()

export type SessionSettingsFormData = yup.InferType<typeof sessionSettingsSchema>
