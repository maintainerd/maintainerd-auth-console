// Analytics Dashboard Data Constants
// This file contains mock data for all analytics charts and metrics

// =============================================================================
// MAIN ANALYTICS METRICS
// =============================================================================
// Used in: Key metrics cards at the top of analytics dashboard
export const analyticsStats = {
  totalLogins: 2456,
  successfulLogins: 2344,
  failedLogins: 112,
  activeSessions: 47,
  avgSessionDuration: "24m",
  mfaAdoption: 68,
  passwordResets: 23,
  newRegistrations: 89
}

// =============================================================================
// LOGIN ACTIVITY CHART DATA
// =============================================================================
// Used in: 7-day login activity bar chart (successful vs failed logins)
export const loginActivityData = [
  { day: "Mon", successful: 320, failed: 12, total: 332 },
  { day: "Tue", successful: 445, failed: 18, total: 463 },
  { day: "Wed", successful: 389, failed: 15, total: 404 },
  { day: "Thu", successful: 412, failed: 22, total: 434 },
  { day: "Fri", successful: 398, failed: 19, total: 417 },
  { day: "Sat", successful: 201, failed: 8, total: 209 },
  { day: "Sun", successful: 179, failed: 6, total: 185 }
]

// =============================================================================
// API TRAFFIC CHART DATA
// =============================================================================
// Used in: 24-hour API traffic area chart (requests and errors)
export const apiTrafficData = [
  { hour: "00", requests: 45, errors: 2 },
  { hour: "01", requests: 32, errors: 1 },
  { hour: "02", requests: 28, errors: 0 },
  { hour: "03", requests: 25, errors: 1 },
  { hour: "04", requests: 31, errors: 0 },
  { hour: "05", requests: 42, errors: 2 },
  { hour: "06", requests: 78, errors: 3 },
  { hour: "07", requests: 124, errors: 5 },
  { hour: "08", requests: 189, errors: 8 },
  { hour: "09", requests: 234, errors: 12 },
  { hour: "10", requests: 267, errors: 15 },
  { hour: "11", requests: 298, errors: 18 },
  { hour: "12", requests: 312, errors: 14 },
  { hour: "13", requests: 289, errors: 11 },
  { hour: "14", requests: 276, errors: 9 },
  { hour: "15", requests: 298, errors: 13 },
  { hour: "16", requests: 267, errors: 10 },
  { hour: "17", requests: 234, errors: 8 },
  { hour: "18", requests: 198, errors: 6 },
  { hour: "19", requests: 156, errors: 4 },
  { hour: "20", requests: 123, errors: 3 },
  { hour: "21", requests: 98, errors: 2 },
  { hour: "22", requests: 76, errors: 1 },
  { hour: "23", requests: 54, errors: 1 }
]

// =============================================================================
// AUTHENTICATION METHODS CHART DATA
// =============================================================================
// Used in: Horizontal bar chart showing authentication method usage
export const authenticationMethodsData = [
  { method: "Password", count: 1890, percentage: 77 },
  { method: "MFA", count: 432, percentage: 18 },
  { method: "SSO", count: 98, percentage: 4 },
  { method: "API Key", count: 36, percentage: 1 }
]

// =============================================================================
// SERVICE USAGE CHART DATA
// =============================================================================
// Used in: Bar chart showing which microservices use auth service most
export const serviceUsageData = [
  { service: "Task Management", requests: 3420, percentage: 34 },
  { service: "User Dashboard", requests: 2890, percentage: 29 },
  { service: "API Gateway", requests: 1560, percentage: 16 },
  { service: "File Storage", requests: 980, percentage: 10 },
  { service: "Notification Service", requests: 670, percentage: 7 },
  { service: "Analytics Service", requests: 480, percentage: 4 }
]

// =============================================================================
// RECENT ACTIVITY DATA
// =============================================================================
// Used in: Recent activity feed showing live authentication events
export const recentActivityData = [
  { id: 1, type: "login", user: "john.doe@example.com", time: "2 minutes ago", status: "success", ip: "192.168.1.100" },
  { id: 2, type: "signup", user: "jane.smith@example.com", time: "5 minutes ago", status: "success", ip: "10.0.0.45" },
  { id: 3, type: "login", user: "admin@company.com", time: "8 minutes ago", status: "failed", ip: "203.0.113.1" },
  { id: 4, type: "api_call", user: "service-account", time: "10 minutes ago", status: "success", ip: "172.16.0.1" },
  { id: 5, type: "password_reset", user: "user@domain.com", time: "15 minutes ago", status: "success", ip: "198.51.100.2" },
  { id: 6, type: "logout", user: "test@example.com", time: "18 minutes ago", status: "success", ip: "192.168.1.200" }
]

// =============================================================================
// DEVICE STATISTICS DATA
// =============================================================================
// Used in: Device analytics showing user access patterns by device type
export const deviceStatsData = [
  { device: "Desktop", count: 678, percentage: 55, sessions: 1234 },
  { device: "Mobile", count: 432, percentage: 35, sessions: 892 },
  { device: "Tablet", count: 124, percentage: 10, sessions: 234 }
]

// =============================================================================
// FILTER OPTIONS
// =============================================================================
// Used in: Filter dropdowns for charts and analytics
export const timeRangeOptions = [
  { value: "1h", label: "Last Hour" },
  { value: "24h", label: "Last 24 Hours" },
  { value: "7d", label: "Last 7 Days" },
  { value: "30d", label: "Last 30 Days" },
  { value: "90d", label: "Last 90 Days" }
]

export const serviceFilterOptions = [
  { value: "all", label: "All Services" },
  { value: "task-management", label: "Task Management" },
  { value: "user-dashboard", label: "User Dashboard" },
  { value: "api-gateway", label: "API Gateway" },
  { value: "file-storage", label: "File Storage" },
  { value: "notification-service", label: "Notification Service" },
  { value: "analytics-service", label: "Analytics Service" }
]

export const authMethodFilterOptions = [
  { value: "all", label: "All Methods" },
  { value: "password", label: "Password Only" },
  { value: "mfa", label: "MFA Enabled" },
  { value: "sso", label: "SSO" },
  { value: "api-key", label: "API Key" }
]
