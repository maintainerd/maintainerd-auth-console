import type { FieldErrors } from "react-hook-form"

export interface TenantSettings {
  name: string
  display_name: string
  description: string
  is_public: boolean
}

export interface BaseSettingsProps {
  onUpdate: (updates: Partial<TenantSettings>) => void
  errors?: FieldErrors<TenantSettings>
}
