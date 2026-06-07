/**
 * User Pool Form Validation Schema
 * Yup validation schema for user pool create/update forms
 */

import * as yup from 'yup'

export const userPoolSchema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),
  display_name: yup
    .string()
    .max(150, 'Display name must not exceed 150 characters')
    .default(''),
  status: yup
    .string()
    .oneOf(['active', 'inactive'], 'Invalid status')
    .required('Status is required'),
})

export type UserPoolFormData = yup.InferType<typeof userPoolSchema>
