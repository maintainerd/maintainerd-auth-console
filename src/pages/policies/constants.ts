export type PolicyEffect = "allow" | "deny"
export type PolicyStatus = "active" | "inactive" | "draft"

export type PolicyStatement = {
  effect: PolicyEffect
  actions: string[]
  resources: string[]
  conditions?: Record<string, any>
}

export type Policy = {
  id: string
  name: string
  description: string
  status: PolicyStatus
  version: string
  statements: PolicyStatement[]
  appliedToServices: string[]
  serviceCount: number
  createdAt: string
  createdBy: string
  updatedAt: string
  isSystem: boolean
}

export const POLICY_EFFECTS: PolicyEffect[] = ["allow", "deny"]
export const POLICY_STATUSES: PolicyStatus[] = ["active", "inactive", "draft"]

export const MOCK_POLICIES: Policy[] = [
  {
    id: "pol_sys_admin_access",
    name: "System Admin Access",
    description: "Full administrative access to all system resources and operations",
    status: "active",
    version: "1.0.0",
    statements: [
      {
        effect: "allow",
        actions: ["*"],
        resources: ["*"]
      }
    ],
    appliedToServices: ["core", "auth", "user-management"],
    serviceCount: 3,
    createdAt: "2024-01-01T00:00:00Z",
    createdBy: "system",
    updatedAt: "2024-01-01T00:00:00Z",
    isSystem: true
  },
  {
    id: "pol_user_read_only",
    name: "User Read-Only Access",
    description: "Read-only access to user data and profile information",
    status: "active",
    version: "2.1.0",
    statements: [
      {
        effect: "allow",
        actions: ["users:read", "profile:read", "roles:read"],
        resources: ["arn:service:user-management:*:user/*", "arn:service:auth:*:profile/*"]
      },
      {
        effect: "deny",
        actions: ["users:write", "users:delete", "roles:write"],
        resources: ["*"]
      }
    ],
    appliedToServices: ["user-management", "auth"],
    serviceCount: 2,
    createdAt: "2024-02-15T10:30:00Z",
    createdBy: "admin",
    updatedAt: "2024-10-20T14:15:00Z",
    isSystem: false
  },
  {
    id: "pol_api_management",
    name: "API Management Policy",
    description: "Comprehensive access control for API management operations",
    status: "active",
    version: "1.5.2",
    statements: [
      {
        effect: "allow",
        actions: ["apis:read", "apis:write", "apis:create"],
        resources: ["arn:service:api-gateway:*:api/*"]
      },
      {
        effect: "allow",
        actions: ["permissions:read"],
        resources: ["arn:service:auth:*:permission/*"]
      },
      {
        effect: "deny",
        actions: ["apis:delete"],
        resources: ["arn:service:api-gateway:*:api/core-*"],
        conditions: {
          "StringEquals": {
            "service:type": "system"
          }
        }
      }
    ],
    appliedToServices: ["api-gateway", "auth"],
    serviceCount: 2,
    createdAt: "2024-03-10T09:15:00Z",
    createdBy: "api-team",
    updatedAt: "2024-09-25T16:45:00Z",
    isSystem: false
  },
  {
    id: "pol_monitoring_access",
    name: "Monitoring and Analytics",
    description: "Access to monitoring data, logs, and analytics across all services",
    status: "active",
    version: "1.2.0",
    statements: [
      {
        effect: "allow",
        actions: ["monitoring:read", "logs:read", "analytics:read", "metrics:read"],
        resources: ["arn:service:*:*:logs/*", "arn:service:*:*:metrics/*"]
      }
    ],
    appliedToServices: ["monitoring", "analytics", "core"],
    serviceCount: 3,
    createdAt: "2024-04-05T14:20:00Z",
    createdBy: "ops-team",
    updatedAt: "2024-08-15T11:30:00Z",
    isSystem: false
  },
  {
    id: "pol_webhook_service",
    name: "Webhook Service Policy",
    description: "Policy for webhook delivery and event processing services",
    status: "active",
    version: "1.0.3",
    statements: [
      {
        effect: "allow",
        actions: ["webhooks:read", "webhooks:write", "events:read", "events:publish"],
        resources: ["arn:service:webhook:*:webhook/*", "arn:service:events:*:event/*"]
      },
      {
        effect: "allow",
        actions: ["users:read"],
        resources: ["arn:service:user-management:*:user/*"],
        conditions: {
          "StringLike": {
            "webhook:event_type": "user.*"
          }
        }
      }
    ],
    appliedToServices: ["webhook", "events"],
    serviceCount: 2,
    createdAt: "2024-05-12T16:45:00Z",
    createdBy: "webhook-team",
    updatedAt: "2024-10-10T09:20:00Z",
    isSystem: false
  },
  {
    id: "pol_client_management",
    name: "Client Application Management",
    description: "Policy for managing OAuth clients and application integrations",
    status: "active",
    version: "2.0.1",
    statements: [
      {
        effect: "allow",
        actions: ["clients:read", "clients:write", "clients:create"],
        resources: ["arn:service:auth:*:client/*"]
      },
      {
        effect: "allow",
        actions: ["api-keys:read", "api-keys:create"],
        resources: ["arn:service:auth:*:api-key/*"]
      },
      {
        effect: "deny",
        actions: ["clients:delete"],
        resources: ["arn:service:auth:*:client/system-*"]
      }
    ],
    appliedToServices: ["auth"],
    serviceCount: 1,
    createdAt: "2024-06-20T11:00:00Z",
    createdBy: "client-team",
    updatedAt: "2024-10-05T15:30:00Z",
    isSystem: false
  },
  {
    id: "pol_security_audit",
    name: "Security Audit Policy",
    description: "Read-only access for security auditing and compliance monitoring",
    status: "active",
    version: "1.1.0",
    statements: [
      {
        effect: "allow",
        actions: ["*:read", "logs:read", "audit:read"],
        resources: ["*"]
      },
      {
        effect: "deny",
        actions: ["*:write", "*:delete", "*:create"],
        resources: ["*"]
      }
    ],
    appliedToServices: ["core", "auth", "user-management", "monitoring"],
    serviceCount: 4,
    createdAt: "2024-07-08T13:15:00Z",
    createdBy: "security-team",
    updatedAt: "2024-09-12T10:45:00Z",
    isSystem: false
  },
  {
    id: "pol_temp_migration",
    name: "Temporary Migration Policy",
    description: "Temporary policy for data migration operations",
    status: "inactive",
    version: "1.0.0",
    statements: [
      {
        effect: "allow",
        actions: ["migration:read", "migration:write", "users:migrate", "data:export"],
        resources: ["arn:service:migration:*:*/*"]
      }
    ],
    appliedToServices: [],
    serviceCount: 0,
    createdAt: "2024-08-15T09:30:00Z",
    createdBy: "migration-team",
    updatedAt: "2024-09-30T17:00:00Z",
    isSystem: false
  },
  {
    id: "pol_draft_new_feature",
    name: "New Feature Access Policy",
    description: "Draft policy for upcoming feature access control",
    status: "draft",
    version: "0.1.0",
    statements: [
      {
        effect: "allow",
        actions: ["feature:read", "feature:test"],
        resources: ["arn:service:feature-flags:*:feature/*"]
      }
    ],
    appliedToServices: [],
    serviceCount: 0,
    createdAt: "2024-10-01T14:20:00Z",
    createdBy: "feature-team",
    updatedAt: "2024-10-20T11:15:00Z",
    isSystem: false
  }
]
