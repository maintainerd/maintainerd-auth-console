// Log Monitoring Page Data Constants
// This file contains mock data for the log monitoring page

// =============================================================================
// LOG ENTRY TYPE DEFINITIONS
// =============================================================================
export type LogLevel = "info" | "warn" | "error" | "debug" | "trace"
export type LogCategory = "auth" | "api" | "security" | "system" | "user" | "service"
export type LogStatus = "success" | "failure" | "pending" | "timeout"

export type LogEntry = {
  id: string
  timestamp: string
  level: LogLevel
  category: LogCategory
  message: string
  source: string
  userId?: string
  userEmail?: string
  ipAddress: string
  userAgent?: string
  requestId?: string
  sessionId?: string
  service: string
  endpoint?: string
  method?: string
  statusCode?: number
  responseTime?: number
  status: LogStatus
  metadata?: Record<string, any>
  tags: string[]
}

// =============================================================================
// MOCK LOG ENTRIES DATA
// =============================================================================
// Used in: Main logs data table
// Generate recent timestamps (within the last hour)
const now = new Date()
const generateRecentTimestamp = (minutesAgo: number) => {
  return new Date(now.getTime() - minutesAgo * 60 * 1000).toISOString()
}

export const MOCK_LOGS: LogEntry[] = [
  {
    id: "log_001",
    timestamp: generateRecentTimestamp(2),
    level: "info",
    category: "auth",
    message: "User login successful",
    source: "auth-service",
    userId: "usr_123",
    userEmail: "john.doe@example.com",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    requestId: "req_abc123",
    sessionId: "sess_xyz789",
    service: "auth-service",
    endpoint: "/api/auth/login",
    method: "POST",
    statusCode: 200,
    responseTime: 145,
    status: "success",
    metadata: { mfaUsed: true, provider: "local" },
    tags: ["authentication", "mfa", "success"]
  },
  {
    id: "log_002",
    timestamp: generateRecentTimestamp(5),
    level: "warn",
    category: "security",
    message: "Multiple failed login attempts detected",
    source: "security-monitor",
    userId: "usr_456",
    userEmail: "suspicious@example.com",
    ipAddress: "203.0.113.1",
    userAgent: "curl/7.68.0",
    requestId: "req_def456",
    service: "auth-service",
    endpoint: "/api/auth/login",
    method: "POST",
    statusCode: 401,
    responseTime: 89,
    status: "failure",
    metadata: { attemptCount: 5, blocked: false },
    tags: ["security", "brute-force", "warning"]
  },
  {
    id: "log_003",
    timestamp: generateRecentTimestamp(8),
    level: "error",
    category: "api",
    message: "Database connection timeout",
    source: "user-service",
    ipAddress: "172.16.0.1",
    requestId: "req_ghi789",
    service: "user-service",
    endpoint: "/api/users/profile",
    method: "GET",
    statusCode: 500,
    responseTime: 5000,
    status: "timeout",
    metadata: { dbHost: "db-primary", timeout: 5000 },
    tags: ["database", "timeout", "error"]
  },
  {
    id: "log_004",
    timestamp: generateRecentTimestamp(12),
    level: "info",
    category: "user",
    message: "User profile updated",
    source: "user-service",
    userId: "usr_789",
    userEmail: "jane.smith@example.com",
    ipAddress: "10.0.0.45",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    requestId: "req_jkl012",
    sessionId: "sess_uvw345",
    service: "user-service",
    endpoint: "/api/users/profile",
    method: "PUT",
    statusCode: 200,
    responseTime: 234,
    status: "success",
    metadata: { fieldsUpdated: ["name", "phone"] },
    tags: ["user", "profile", "update"]
  },
  {
    id: "log_005",
    timestamp: generateRecentTimestamp(15),
    level: "debug",
    category: "system",
    message: "Cache miss for user permissions",
    source: "permission-service",
    userId: "usr_101",
    ipAddress: "172.16.0.2",
    requestId: "req_mno345",
    service: "permission-service",
    endpoint: "/api/permissions/check",
    method: "GET",
    statusCode: 200,
    responseTime: 67,
    status: "success",
    metadata: { cacheKey: "perms:usr_101", ttl: 300 },
    tags: ["cache", "permissions", "debug"]
  },
  {
    id: "log_006",
    timestamp: generateRecentTimestamp(20),
    level: "error",
    category: "service",
    message: "External API rate limit exceeded",
    source: "notification-service",
    ipAddress: "172.16.0.3",
    requestId: "req_pqr678",
    service: "notification-service",
    endpoint: "/api/notifications/send",
    method: "POST",
    statusCode: 429,
    responseTime: 123,
    status: "failure",
    metadata: { provider: "sendgrid", limit: 100, window: "1h" },
    tags: ["rate-limit", "external-api", "notification"]
  },
  {
    id: "log_007",
    timestamp: generateRecentTimestamp(25),
    level: "info",
    category: "auth",
    message: "API key authentication successful",
    source: "api-gateway",
    ipAddress: "198.51.100.2",
    userAgent: "MyApp/1.0.0",
    requestId: "req_stu901",
    service: "api-gateway",
    endpoint: "/api/v1/data",
    method: "GET",
    statusCode: 200,
    responseTime: 45,
    status: "success",
    metadata: { keyId: "key_abc123", scopes: ["read:data"] },
    tags: ["api-key", "authentication", "gateway"]
  },
  {
    id: "log_008",
    timestamp: generateRecentTimestamp(30),
    level: "warn",
    category: "security",
    message: "Suspicious IP address detected",
    source: "threat-detection",
    ipAddress: "185.220.101.1",
    requestId: "req_vwx234",
    service: "auth-service",
    endpoint: "/api/auth/login",
    method: "POST",
    statusCode: 403,
    responseTime: 12,
    status: "failure",
    metadata: { threatScore: 85, country: "Unknown", tor: true },
    tags: ["security", "threat", "tor", "blocked"]
  },
  {
    id: "log_009",
    timestamp: generateRecentTimestamp(35),
    level: "info",
    category: "user",
    message: "Password reset requested",
    source: "auth-service",
    userId: "usr_999",
    userEmail: "user@example.com",
    ipAddress: "192.168.1.50",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)",
    requestId: "req_rst456",
    service: "auth-service",
    endpoint: "/api/auth/reset-password",
    method: "POST",
    statusCode: 200,
    responseTime: 234,
    status: "success",
    metadata: { resetToken: "token_xyz", expiresIn: 3600 },
    tags: ["password", "reset", "email"]
  },
  {
    id: "log_010",
    timestamp: generateRecentTimestamp(40),
    level: "debug",
    category: "api",
    message: "Rate limit check passed",
    source: "api-gateway",
    ipAddress: "10.0.0.100",
    requestId: "req_rate123",
    service: "api-gateway",
    endpoint: "/api/v1/users",
    method: "GET",
    statusCode: 200,
    responseTime: 23,
    status: "success",
    metadata: { remainingRequests: 95, windowReset: 3600 },
    tags: ["rate-limit", "api", "gateway"]
  },
  {
    id: "log_011",
    timestamp: generateRecentTimestamp(45),
    level: "error",
    category: "system",
    message: "Redis connection failed",
    source: "session-service",
    ipAddress: "172.16.0.5",
    requestId: "req_redis789",
    service: "session-service",
    endpoint: "/api/sessions/validate",
    method: "POST",
    statusCode: 500,
    responseTime: 2000,
    status: "failure",
    metadata: { redisHost: "redis-cluster", error: "ECONNREFUSED" },
    tags: ["redis", "connection", "error", "session"]
  },
  {
    id: "log_012",
    timestamp: generateRecentTimestamp(50),
    level: "info",
    category: "auth",
    message: "Two-factor authentication enabled",
    source: "auth-service",
    userId: "usr_555",
    userEmail: "secure@example.com",
    ipAddress: "192.168.1.75",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    requestId: "req_2fa123",
    sessionId: "sess_secure456",
    service: "auth-service",
    endpoint: "/api/auth/enable-2fa",
    method: "POST",
    statusCode: 200,
    responseTime: 156,
    status: "success",
    metadata: { method: "totp", backupCodes: 8 },
    tags: ["2fa", "security", "totp", "enabled"]
  },
  // Add some older logs for testing different time ranges
  {
    id: "log_013",
    timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    level: "info",
    category: "api",
    message: "Scheduled backup completed",
    source: "backup-service",
    ipAddress: "172.16.0.10",
    requestId: "req_backup123",
    service: "backup-service",
    endpoint: "/api/backup/run",
    method: "POST",
    statusCode: 200,
    responseTime: 45000,
    status: "success",
    metadata: { backupSize: "2.3GB", duration: "45s" },
    tags: ["backup", "scheduled", "success"]
  },
  {
    id: "log_014",
    timestamp: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    level: "warn",
    category: "system",
    message: "High memory usage detected",
    source: "monitoring-service",
    ipAddress: "172.16.0.15",
    requestId: "req_memory456",
    service: "user-service",
    statusCode: 200,
    responseTime: 100,
    status: "success",
    metadata: { memoryUsage: "85%", threshold: "80%" },
    tags: ["memory", "warning", "monitoring"]
  },
  {
    id: "log_015",
    timestamp: new Date(now.getTime() - 25 * 60 * 60 * 1000).toISOString(), // 25 hours ago (yesterday)
    level: "error",
    category: "security",
    message: "Failed certificate validation",
    source: "ssl-service",
    ipAddress: "203.0.113.50",
    requestId: "req_ssl789",
    service: "api-gateway",
    endpoint: "/api/secure/data",
    method: "GET",
    statusCode: 403,
    responseTime: 50,
    status: "failure",
    metadata: { certificate: "expired", issuer: "LetsEncrypt" },
    tags: ["ssl", "certificate", "expired", "security"]
  }
]

// =============================================================================
// FILTER OPTIONS
// =============================================================================
// Used in: LogToolbar advanced filters

export const LOG_LEVEL_OPTIONS = [
  { label: "All Levels", value: "all" },
  { label: "Error", value: "error" },
  { label: "Warning", value: "warn" },
  { label: "Info", value: "info" },
  { label: "Debug", value: "debug" },
  { label: "Trace", value: "trace" }
]



export const LOG_STATUS_OPTIONS = [
  { label: "All Status", value: "all" },
  { label: "Success", value: "success" },
  { label: "Failure", value: "failure" },
  { label: "Pending", value: "pending" },
  { label: "Timeout", value: "timeout" }
]

export const LOG_SERVICE_OPTIONS = [
  { label: "All Services", value: "all" },
  { label: "Auth Service", value: "auth-service" },
  { label: "User Service", value: "user-service" },
  { label: "API Gateway", value: "api-gateway" },
  { label: "Notification Service", value: "notification-service" },
  { label: "Permission Service", value: "permission-service" },
  { label: "Session Service", value: "session-service" },
  { label: "Backup Service", value: "backup-service" },
  { label: "Monitoring Service", value: "monitoring-service" },
  { label: "SSL Service", value: "ssl-service" }
]

export const TIME_RANGE_OPTIONS = [
  { label: "Last 5 minutes", value: "5m" },
  { label: "Last 15 minutes", value: "15m" },
  { label: "Last hour", value: "1h" },
  { label: "Last 6 hours", value: "6h" },
  { label: "Last 24 hours", value: "24h" },
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
  { label: "All time", value: "all" }
]

// =============================================================================
// LOG STATISTICS
// =============================================================================
// Used in: Log monitoring dashboard metrics

export const LOG_STATS = {
  totalLogs: 15,
  errorCount: 4,
  warningCount: 3,
  successRate: 73.3, // percentage
  avgResponseTime: 1247, // milliseconds
  uniqueUsers: 8,
  uniqueIPs: 12,
  topService: "auth-service",
  criticalAlerts: 2,
  lastUpdated: new Date().toISOString()
}
