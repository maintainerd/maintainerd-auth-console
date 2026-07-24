/**
 * Permission Form Validation Schema
 * Yup validation schema for API permission forms
 */

import * as yup from 'yup'

export const permissionSchema = yup.object({
  name: yup
    .string()
    .required("Permission name is required")
    .matches(
      /^[a-z0-9-]+:[a-z0-9-]+$/,
      "Permission name must follow format: resource:action (e.g., users:read, posts:write)"
    ),
  description: yup.string().required("Description is required"),
  status: yup.string().oneOf(["active", "inactive"]).required("Status is required"),
})

export type PermissionFormData = yup.InferType<typeof permissionSchema>
