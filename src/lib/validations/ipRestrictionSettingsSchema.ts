/**
 * IP Restriction Settings Validation Schema
 */

import * as yup from 'yup'

export const ipRestrictionSettingsSchema = yup.object({
  // Global Settings
  ipRestrictionsEnabled: yup.boolean().required(),
  defaultAction: yup.string().required().oneOf(['allow', 'deny']),
  logBlockedAttempts: yup.boolean().required(),
  geoBlockingEnabled: yup.boolean().required(),
  
  // Rate Limiting
  rateLimitingEnabled: yup.boolean().required(),
  requestsPerMinute: yup.number().required().min(1).max(10000),
  burstLimit: yup.number().required().min(1).max(10000),
  
  // Geo-blocking
  blockedCountries: yup.array().of(yup.string().required()).required(),
  allowedCountries: yup.array().of(yup.string().required()).required(),
  
  // Advanced Detection
  proxyDetectionEnabled: yup.boolean().required(),
  vpnDetectionEnabled: yup.boolean().required(),
  torDetectionEnabled: yup.boolean().required(),
  cloudProviderBlocking: yup.boolean().required(),
}).required()

export type IpRestrictionSettingsFormData = yup.InferType<typeof ipRestrictionSettingsSchema>
