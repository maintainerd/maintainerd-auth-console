import * as yup from 'yup'

export const tokenConfigSchema = yup.object({
  clock_skew_leeway_seconds: yup
    .number()
    .required()
    .min(0, 'Cannot be negative')
    .max(300, 'Cannot exceed 300'),
  signing_algorithm: yup
    .string()
    .required()
    .oneOf(['RS256', 'ES256', 'PS256']),
  require_pkce: yup.boolean().required(),
  additional_id_token_claims: yup.array().of(yup.string()).required(),
  additional_access_token_claims: yup.array().of(yup.string()).required(),
}).required()

export type TokenConfigFormData = yup.InferType<typeof tokenConfigSchema>
