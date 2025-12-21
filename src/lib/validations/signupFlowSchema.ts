/**
 * Signup Flow Form Validation Schema
 * Yup validation schema for signup flow-related forms
 */

import * as yup from 'yup'

// Signup Flow Form Schema
export const signupFlowSchema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),
  description: yup
    .string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must not exceed 500 characters'),
  status: yup
    .string()
    .oneOf(['active', 'inactive', 'draft'], 'Invalid status')
    .required('Status is required'),
  clientId: yup
    .string()
    .required('Client is required'),
})

export type SignupFlowFormData = yup.InferType<typeof signupFlowSchema>
