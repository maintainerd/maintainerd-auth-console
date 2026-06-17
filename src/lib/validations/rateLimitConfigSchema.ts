import * as yup from 'yup'

export const rateLimitConfigSchema = yup.object({
  enabled: yup.boolean().required(),
  requests_per_window: yup.number().required().min(1, 'Must be at least 1').integer(),
  window_duration_seconds: yup.number().required().min(1, 'Must be at least 1').integer(),
  per_ip: yup.boolean().required(),
  per_api_key: yup.boolean().required(),
  exempt_ips: yup.array().of(yup.string().defined()).required(),
}).required()

export type RateLimitConfigFormData = yup.InferType<typeof rateLimitConfigSchema>
