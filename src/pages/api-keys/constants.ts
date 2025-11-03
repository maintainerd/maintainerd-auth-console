export const API_KEY_STATUSES = [
  "active",
  "inactive",
  "expired"
] as const

export const API_KEY_TYPES = [
  "read-only",
  "read-write",
  "admin"
] as const

export type ApiKeyStatus = typeof API_KEY_STATUSES[number]
export type ApiKeyType = typeof API_KEY_TYPES[number]

export interface ApiKey {
  id: string // UUID format
  name: string
  displayName: string
  description: string
  type: ApiKeyType
  status: ApiKeyStatus
  keyPrefix: string
  permissions: string[]
  expiresAt?: string
  lastUsed?: string
  usageCount: number
  createdAt: string
  createdBy: string
  updatedAt: string
}

// Available permissions for API keys (comprehensive list)
export const AVAILABLE_PERMISSIONS = [
  // User Management
  "users:read", "users:write", "users:delete",
  "profile:read", "profile:write",

  // Role & Permission Management
  "roles:read", "roles:write", "roles:delete",
  "permissions:read", "permissions:write",

  // API Management
  "apis:read", "apis:write", "apis:delete",
  "api-keys:read", "api-keys:write", "api-keys:delete",

  // Service Management
  "services:read", "services:write", "services:delete",

  // Analytics & Monitoring
  "analytics:read", "reports:read", "reports:write",
  "monitoring:read", "alerts:read", "logs:read",

  // Authentication & Authorization
  "auth:read", "auth:write",
  "tokens:read", "tokens:write",

  // Webhooks & Events
  "webhooks:read", "webhooks:write",
  "events:read", "events:write",

  // System Administration
  "system:read", "system:write", "system:admin",
  "deploy:read", "deploy:write",

  // Development & Testing
  "test:read", "test:write",
  "dev:access", "demo:read",

  // Legacy & Migration
  "legacy:read", "legacy:write"
] as const

export const MOCK_API_KEYS: ApiKey[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    name: "prod-api-key",
    displayName: "Production API",
    description: "Main production API key for web application backend services",
    type: "read-write",
    status: "active",
    keyPrefix: "sk_prod_",
    permissions: ["users:read", "users:write", "roles:read", "apis:read"],
    expiresAt: "2025-01-15T00:00:00Z",
    usageCount: 12450,
    lastUsed: "2024-10-26T14:30:00Z",
    createdAt: "2024-01-15T10:30:00Z",
    createdBy: "admin",
    updatedAt: "2024-10-25T09:15:00Z"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    name: "analytics-service-key",
    displayName: "Analytics Service",
    description: "Read-only access for analytics and reporting dashboard",
    type: "read-only",
    status: "active",
    keyPrefix: "sk_analytics_",
    permissions: ["analytics:read", "reports:read", "monitoring:read"],
    expiresAt: "2024-12-31T23:59:59Z",
    usageCount: 8920,
    lastUsed: "2024-10-26T12:15:00Z",
    createdAt: "2024-02-01T14:20:00Z",
    createdBy: "analytics-team",
    updatedAt: "2024-10-20T16:30:00Z"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    name: "mobile-backend-key",
    displayName: "Mobile App Backend",
    description: "API key for mobile application backend integration",
    type: "read-write",
    status: "active",
    keyPrefix: "sk_mobile_",
    permissions: ["users:read", "profile:write", "auth:read"],
    expiresAt: "2025-06-01T00:00:00Z",
    usageCount: 5670,
    lastUsed: "2024-10-26T11:45:00Z",
    createdAt: "2024-03-10T09:00:00Z",
    createdBy: "mobile-team",
    updatedAt: "2024-10-15T14:20:00Z"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440004",
    name: "webhook-service-key",
    displayName: "Webhook Service",
    description: "API key for webhook delivery and event processing",
    type: "read-only",
    status: "active",
    keyPrefix: "sk_webhook_",
    permissions: ["webhooks:read", "events:read"],
    expiresAt: "2025-03-15T00:00:00Z",
    usageCount: 3240,
    lastUsed: "2024-10-26T10:20:00Z",
    createdAt: "2024-04-05T16:45:00Z",
    createdBy: "webhook-service",
    updatedAt: "2024-10-10T11:30:00Z"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440005",
    name: "cicd-pipeline-key",
    displayName: "CI/CD Pipeline",
    description: "Automated deployment and testing pipeline access",
    type: "admin",
    status: "active",
    keyPrefix: "sk_cicd_",
    permissions: ["deploy:read", "deploy:write", "system:read"],
    expiresAt: "2025-12-31T23:59:59Z",
    usageCount: 1890,
    lastUsed: "2024-10-26T08:30:00Z",
    createdAt: "2024-05-20T12:00:00Z",
    createdBy: "devops-team",
    updatedAt: "2024-10-05T15:45:00Z"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440006",
    name: "legacy-integration-key",
    displayName: "Legacy Integration",
    description: "Temporary key for legacy system migration",
    type: "read-only",
    status: "inactive",
    keyPrefix: "sk_legacy_",
    permissions: ["users:read", "legacy:read"],
    expiresAt: "2024-11-30T23:59:59Z",
    usageCount: 450,
    lastUsed: "2024-10-20T14:15:00Z",
    createdAt: "2024-06-15T10:30:00Z",
    createdBy: "migration-team",
    updatedAt: "2024-10-20T14:15:00Z"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440007",
    name: "test-environment-key",
    displayName: "Test Environment",
    description: "Development and testing environment API access",
    type: "read-write",
    status: "active",
    keyPrefix: "sk_test_",
    permissions: ["users:read", "users:write", "test:read", "test:write"],
    usageCount: 2340,
    lastUsed: "2024-10-26T13:20:00Z",
    createdAt: "2024-07-01T09:15:00Z",
    createdBy: "dev-team",
    updatedAt: "2024-10-25T16:40:00Z"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440008",
    name: "monitoring-service-key",
    displayName: "Monitoring Service",
    description: "System monitoring and alerting service access",
    type: "read-only",
    status: "active",
    keyPrefix: "sk_monitor_",
    permissions: ["monitoring:read", "alerts:read", "logs:read"],
    expiresAt: "2025-08-01T00:00:00Z",
    usageCount: 6780,
    lastUsed: "2024-10-26T15:50:00Z",
    createdAt: "2024-08-10T14:30:00Z",
    createdBy: "monitoring-team",
    updatedAt: "2024-10-22T10:25:00Z"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440009",
    name: "expired-demo-key",
    displayName: "Expired Demo Key",
    description: "Demo API key that has expired",
    type: "read-only",
    status: "expired",
    keyPrefix: "sk_demo_",
    permissions: ["demo:read"],
    expiresAt: "2024-09-30T23:59:59Z",
    usageCount: 120,
    lastUsed: "2024-09-29T18:45:00Z",
    createdAt: "2024-09-01T10:00:00Z",
    createdBy: "demo-team",
    updatedAt: "2024-09-30T23:59:59Z"
  }
]
