import * as yup from 'yup'

export const maintenanceConfigSchema = yup.object({
  enabled: yup.boolean().required(),
  message: yup.string().required('Message is required').max(500),
  bypass_ips: yup.array().of(yup.string().defined()).required(),
  scheduled_start: yup.string().nullable().default(null),
  scheduled_end: yup.string().nullable().default(null),
  admin_bypass_roles: yup.array().of(yup.string().defined()).required(),
}).required()

export type MaintenanceConfigFormData = yup.InferType<typeof maintenanceConfigSchema>
