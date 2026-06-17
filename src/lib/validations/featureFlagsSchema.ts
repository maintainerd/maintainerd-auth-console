import * as yup from 'yup'

export const featureFlagsSchema = yup.object({
  enable_passwordless_login: yup.boolean().required(),
  enable_email_sending: yup.boolean().required(),
  enable_sms_sending: yup.boolean().required(),
  enable_social_logins: yup.boolean().required(),
  enable_audit_export: yup.boolean().required(),
  enable_advanced_analytics: yup.boolean().required(),
  enable_experimental_features: yup.boolean().required(),
}).required()

export type FeatureFlagsFormData = yup.InferType<typeof featureFlagsSchema>
