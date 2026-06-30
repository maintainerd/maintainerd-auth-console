/**
 * Registration Flow Form Validation Schema
 * Yup validation schema for registration flow-related forms
 */

import * as yup from 'yup'

// Registration Flow Form Schema
export const registrationFlowSchema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),
  identifier: yup
    .string()
    .max(255, 'Identifier must not exceed 255 characters')
    .matches(
      /^[a-z0-9][a-z0-9-_]*$/,
      'Identifier must contain only lowercase letters, numbers, hyphens, and underscores'
    )
    .nullable()
    .optional(),
  description: yup
    .string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must not exceed 500 characters'),
  status: yup
    .string()
    .oneOf(['active', 'inactive'], 'Invalid status')
    .required('Status is required'),
  clientId: yup
    .string()
    .required('Client is required'),
})

export type RegistrationFlowFormData = yup.InferType<typeof registrationFlowSchema>
