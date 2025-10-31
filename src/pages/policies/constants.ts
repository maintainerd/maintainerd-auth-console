export type PolicyEffect = "allow" | "deny"
export type PolicyStatus = "active" | "inactive" | "draft"

export type PolicyStatement = {
  effect: PolicyEffect
  actions: string[]
  resources: string[]
  conditions?: Record<string, any>
}

export type Policy = {
  id: string // UUID v4 for database record
  name: string // Short name like "admin-access"
  displayName: string // Display name like "System Admin Access"
  identifier: string // Alphanumeric random identifier for communications
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
    id: "550e8400-e29b-41d4-a716-446655440001",
    name: "admin-access",
    displayName: "System Admin Access",
    identifier: "ADM7X9K2M",
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
    id: "550e8400-e29b-41d4-a716-446655440002",
    name: "user-readonly",
    displayName: "User Read-Only Access",
    identifier: "USR4N8L5Q",
    description: "Read-only access to user data and profile information",
    status: "active",
    version: "2.1.0",
    statements: [
      {
        effect: "allow",
        actions: ["users:read", "profile:read", "roles:read"],
        resources: ["user-management", "auth"]
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
    id: "550e8400-e29b-41d4-a716-446655440003",
    name: "api-management",
    displayName: "API Management Policy",
    identifier: "API3R7W9K",
    description: "Comprehensive access control for API management operations",
    status: "active",
    version: "1.5.2",
    statements: [
      {
        effect: "allow",
        actions: ["apis:read", "apis:write", "apis:create"],
        resources: ["api-gateway"]
      },
      {
        effect: "allow",
        actions: ["permissions:read"],
        resources: ["auth"]
      },
      {
        effect: "deny",
        actions: ["apis:delete"],
        resources: ["api-gateway"],
        conditions: {
          "StringEquals": {
            "service:type": "system"
          },
          "IpAddress": {
            "aws:SourceIp": ["203.0.113.0/24", "198.51.100.0/24"]
          },
          "DateGreaterThan": {
            "aws:CurrentTime": "2024-01-01T00:00:00Z"
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
    id: "550e8400-e29b-41d4-a716-446655440004",
    name: "monitoring-access",
    displayName: "Monitoring and Analytics",
    identifier: "MON8T6P2L",
    description: "Access to monitoring data, logs, and analytics across all services",
    status: "active",
    version: "1.2.0",
    statements: [
      {
        effect: "allow",
        actions: ["monitoring:read", "logs:read", "analytics:read", "metrics:read"],
        resources: ["monitoring", "analytics"]
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
    id: "550e8400-e29b-41d4-a716-446655440005",
    name: "webhook-service",
    displayName: "Webhook Service Policy",
    identifier: "WHK5H3N8P",
    description: "Policy for webhook delivery and event processing services",
    status: "active",
    version: "1.0.3",
    statements: [
      {
        effect: "allow",
        actions: ["webhooks:read", "webhooks:write", "events:read", "events:publish"],
        resources: ["webhook", "events"]
      },
      {
        effect: "allow",
        actions: ["users:read"],
        resources: ["user-management"],
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
    id: "550e8400-e29b-41d4-a716-446655440006",
    name: "client-management",
    displayName: "Client Application Management",
    identifier: "CLT9M4K7Q",
    description: "Policy for managing OAuth clients and application integrations",
    status: "active",
    version: "2.0.1",
    statements: [
      {
        effect: "allow",
        actions: ["clients:read", "clients:write", "clients:create"],
        resources: ["auth"]
      },
      {
        effect: "allow",
        actions: ["api-keys:read", "api-keys:create"],
        resources: ["auth"]
      },
      {
        effect: "deny",
        actions: ["clients:delete"],
        resources: ["auth"]
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
    id: "550e8400-e29b-41d4-a716-446655440007",
    name: "security-audit",
    displayName: "Security Audit Policy",
    identifier: "SEC2L9P4R",
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
    id: "550e8400-e29b-41d4-a716-446655440008",
    name: "temp-migration",
    displayName: "Temporary Migration Policy",
    identifier: "MIG6T4M1S",
    description: "Temporary policy for data migration operations",
    status: "inactive",
    version: "1.0.0",
    statements: [
      {
        effect: "allow",
        actions: ["migration:read", "migration:write", "users:migrate", "data:export"],
        resources: ["migration"]
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
    id: "550e8400-e29b-41d4-a716-446655440009",
    name: "new-feature-access",
    displayName: "New Feature Access Policy",
    identifier: "FTR7Y5U8I",
    description: "Draft policy for upcoming feature access control",
    status: "draft",
    version: "0.1.0",
    statements: [
      {
        effect: "allow",
        actions: ["feature:read", "feature:test"],
        resources: ["feature-flags"]
      }
    ],
    appliedToServices: [],
    serviceCount: 0,
    createdAt: "2024-10-01T14:20:00Z",
    createdBy: "feature-team",
    updatedAt: "2024-10-20T11:15:00Z",
    isSystem: false
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440010",
    name: "complex-conditional",
    displayName: "Complex Conditional Access Policy",
    identifier: "CMP3X7Z9B",
    description: "Advanced policy with multiple conditions and resource patterns for enterprise security",
    status: "active",
    version: "3.2.1",
    statements: [
      {
        effect: "allow",
        actions: [
          "users:read", "users:write", "users:create",
          "roles:read", "roles:assign", "permissions:read",
          "audit:read", "logs:read", "metrics:read"
        ],
        resources: [
          "user-management",
          "auth",
          "monitoring"
        ],
        conditions: {
          "StringEquals": {
            "service:environment": ["production", "staging"],
            "user:department": ["IT", "Security", "Operations"]
          },
          "IpAddress": {
            "aws:SourceIp": ["10.0.0.0/8", "172.16.0.0/12", "192.168.0.0/16"]
          },
          "DateGreaterThan": {
            "aws:CurrentTime": "2024-01-01T00:00:00Z"
          },
          "DateLessThan": {
            "aws:CurrentTime": "2025-12-31T23:59:59Z"
          },
          "NumericLessThan": {
            "user:session_duration": "28800"
          },
          "Bool": {
            "user:mfa_authenticated": "true",
            "service:ssl_required": "true"
          }
        }
      },
      {
        effect: "deny",
        actions: ["*"],
        resources: ["*"],
        conditions: {
          "StringNotEquals": {
            "user:authentication_method": ["saml", "oauth2", "mfa"]
          },
          "IpAddressIfExists": {
            "aws:SourceIp": ["203.0.113.0/24"]
          }
        }
      },
      {
        effect: "allow",
        actions: ["emergency:*"],
        resources: ["emergency-system"],
        conditions: {
          "StringEquals": {
            "user:role": "emergency_responder"
          },
          "Bool": {
            "emergency:active": "true"
          }
        }
      }
    ],
    appliedToServices: ["user-management", "auth", "monitoring", "emergency-system"],
    serviceCount: 4,
    createdAt: "2024-01-15T09:00:00Z",
    createdBy: "security-admin",
    updatedAt: "2024-10-25T16:30:00Z",
    isSystem: false
  }
]
