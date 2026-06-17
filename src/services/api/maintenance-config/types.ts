export interface MaintenanceConfig {
  enabled: boolean
  message: string
  bypass_ips: string[]
  scheduled_start: string | null
  scheduled_end: string | null
  admin_bypass_roles: string[]
}

export interface MaintenanceConfigResponse {
  success: boolean
  data: MaintenanceConfig
  message: string
}

export type MaintenanceConfigPayload = Partial<MaintenanceConfig>
