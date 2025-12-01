/**
 * Policy Validation Schema
 * Validation rules for policy forms using Yup
 */

import * as yup from 'yup'

/**
 * Policy statement schema
 */
export const policyStatementSchema = yup.object({
  effect: yup
    .string()
    .oneOf(['allow', 'deny'], 'Effect must be either allow or deny')
    .required('Effect is required'),
  action: yup
    .array()
    .of(yup.string().required('Action cannot be empty'))
    .min(1, 'At least one action is required')
    .required('Actions are required'),
  resource: yup
    .array()
    .of(yup.string().required('Resource cannot be empty'))
    .min(1, 'At least one resource is required')
    .required('Resources are required'),
})

/**
 * Policy document schema
 * Note: version field is not included here as it's synced from the root version field
 */
export const policyDocumentSchema = yup.object({
  statement: yup
    .array()
    .of(policyStatementSchema)
    .min(1, 'At least one statement is required')
    .required('Statements are required'),
})

/**
 * Policy form validation schema
 */
export const policySchema = yup.object({
  name: yup
    .string()
    .required('Policy name is required')
    .min(3, 'Policy name must be at least 3 characters')
    .max(100, 'Policy name must not exceed 100 characters')
    .matches(
      /^[a-z0-9-:_]+$/,
      'Policy name can only contain lowercase letters, numbers, hyphens, colons, and underscores'
    ),
  description: yup
    .string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must not exceed 500 characters'),
  version: yup
    .string()
    .required('Version is required')
    .matches(
      /^\d+\.\d+\.\d+$/,
      'Version must be in semantic versioning format (e.g., 1.0.0)'
    ),
  status: yup
    .string()
    .oneOf(['active', 'inactive'], 'Status must be either active or inactive')
    .required('Status is required'),
  document: policyDocumentSchema.required('Policy document is required'),
})

/**
 * TypeScript type inferred from the schema
 */
export type PolicyFormData = yup.InferType<typeof policySchema>
export type PolicyStatementFormData = yup.InferType<typeof policyStatementSchema>
export type PolicyDocumentFormData = yup.InferType<typeof policyDocumentSchema>

