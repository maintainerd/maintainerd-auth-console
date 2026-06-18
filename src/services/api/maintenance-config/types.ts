export interface MaintenanceConfig {
  enabled: boolean
  message: string
  scheduled_start: string | null
  scheduled_end: string | null
}

export interface MaintenanceConfigResponse {
  success: boolean
  data: MaintenanceConfig
  message: string
}

export type MaintenanceConfigPayload = Partial<MaintenanceConfig>
