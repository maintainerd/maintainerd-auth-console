/**
 * Tenant Settings Validation Schema
 */

import * as yup from 'yup'

export const tenantSettingsSchema = yup.object({
  name: yup.string().required('Tenant name is required').min(2, 'Tenant name must be at least 2 characters'),
  description: yup.string().required('Description is required').min(10, 'Description must be at least 10 characters'),
  is_public: yup.boolean().required(),
}).required()

export type TenantSettingsFormData = yup.InferType<typeof tenantSettingsSchema>
