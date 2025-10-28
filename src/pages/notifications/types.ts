export interface Notification {
  id: string
  type: "user" | "system" | "security" | "api" | "service"
  title: string
  message: string
  status: "read" | "unread"
  priority: "low" | "medium" | "high" | "critical"
  createdAt: string
  actionUrl?: string
  metadata?: {
    userId?: string
    serviceId?: string
    apiId?: string
    containerId?: string
    [key: string]: any
  }
}
