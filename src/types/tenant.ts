/**
 * Global Tenant Types
 * Shared tenant types used across the application
 */

export interface TenantType {
  tenant_uuid: string
  name: string
  description: string
  identifier: string
  is_active: boolean
  is_public: boolean
  is_default: boolean
  created_at: string
  updated_at: string
}

export interface TenantResponseInterface {
  success: boolean
  data: TenantType
  message: string
}
