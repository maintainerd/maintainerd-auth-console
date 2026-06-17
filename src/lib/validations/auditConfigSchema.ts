import * as yup from 'yup'

export const auditConfigSchema = yup.object({
  enabled: yup.boolean().required(),
  retention_days: yup.number().required().min(1, 'Must be at least 1').integer(),
  gdpr_mode: yup.boolean().required(),
  pii_masking: yup.boolean().required(),
  log_level: yup.string().required().oneOf(['debug', 'info', 'warn', 'error'], 'Invalid log level'),
  event_types: yup.array().of(yup.string().defined()).required(),
  export_format: yup.string().required().oneOf(['json', 'csv', 'pdf'], 'Invalid format'),
}).required()

export type AuditConfigFormData = yup.InferType<typeof auditConfigSchema>
