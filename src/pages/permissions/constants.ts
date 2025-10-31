export type Permission = {
  name: string
  description: string
  apiId: string
  apiName: string
  isSystem: boolean
  roleCount: number
  createdAt: string
  createdBy: string
  updatedAt: string
}

export const MOCK_PERMISSIONS: Permission[] = [
  // System Management API permissions
  {
    name: "system:health:read",
    description: "View system health status and diagnostics",
    apiId: "550e8400-e29b-41d4-a716-446655440001",
    apiName: "System Management API",
    isSystem: true,
    roleCount: 5,
    createdAt: "2024-01-01T00:00:00Z",
    createdBy: "system",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    name: "system:config:read",
    description: "View system configuration settings",
    apiId: "550e8400-e29b-41d4-a716-446655440001",
    apiName: "System Management API",
    isSystem: true,
    roleCount: 3,
    createdAt: "2024-01-01T00:00:00Z",
    createdBy: "system",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    name: "system:config:write",
    description: "Modify system configuration settings",
    apiId: "550e8400-e29b-41d4-a716-446655440001",
    apiName: "System Management API",
    isSystem: true,
    roleCount: 2,
    createdAt: "2024-01-01T00:00:00Z",
    createdBy: "system",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    name: "system:metrics:read",
    description: "Access system performance metrics",
    apiId: "550e8400-e29b-41d4-a716-446655440001",
    apiName: "System Management API",
    isSystem: true,
    roleCount: 4,
    createdAt: "2024-01-01T00:00:00Z",
    createdBy: "system",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    name: "system:maintenance:write",
    description: "Perform system maintenance operations",
    apiId: "550e8400-e29b-41d4-a716-446655440001",
    apiName: "System Management API",
    isSystem: true,
    roleCount: 1,
    createdAt: "2024-01-01T00:00:00Z",
    createdBy: "system",
    updatedAt: "2024-01-01T00:00:00Z"
  },

  // Monitoring API permissions
  {
    name: "monitoring:alerts:read",
    description: "View system alerts and notifications",
    apiId: "550e8400-e29b-41d4-a716-446655440002",
    apiName: "Monitoring API",
    isSystem: true,
    roleCount: 6,
    createdAt: "2024-01-01T00:00:00Z",
    createdBy: "system",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    name: "monitoring:alerts:write",
    description: "Create and manage system alerts",
    apiId: "550e8400-e29b-41d4-a716-446655440002",
    apiName: "Monitoring API",
    isSystem: true,
    roleCount: 3,
    createdAt: "2024-01-01T00:00:00Z",
    createdBy: "system",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    name: "monitoring:performance:read",
    description: "Access performance tracking data",
    apiId: "550e8400-e29b-41d4-a716-446655440002",
    apiName: "Monitoring API",
    isSystem: true,
    roleCount: 5,
    createdAt: "2024-01-01T00:00:00Z",
    createdBy: "system",
    updatedAt: "2024-01-01T00:00:00Z"
  },

  // Session Management API permissions
  {
    name: "auth:session:create",
    description: "Create new user authentication sessions",
    apiId: "550e8400-e29b-41d4-a716-446655440003",
    apiName: "Session Management API",
    isSystem: true,
    roleCount: 4,
    createdAt: "2024-01-01T00:00:00Z",
    createdBy: "system",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    name: "auth:session:read",
    description: "View user session information",
    apiId: "550e8400-e29b-41d4-a716-446655440003",
    apiName: "Session Management API",
    isSystem: true,
    roleCount: 6,
    createdAt: "2024-01-01T00:00:00Z",
    createdBy: "system",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    name: "auth:session:revoke",
    description: "Revoke user authentication sessions",
    apiId: "550e8400-e29b-41d4-a716-446655440003",
    apiName: "Session Management API",
    isSystem: true,
    roleCount: 3,
    createdAt: "2024-01-01T00:00:00Z",
    createdBy: "system",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    name: "auth:token:manage",
    description: "Manage authentication tokens and refresh tokens",
    apiId: "550e8400-e29b-41d4-a716-446655440003",
    apiName: "Session Management API",
    isSystem: true,
    roleCount: 2,
    createdAt: "2024-01-01T00:00:00Z",
    createdBy: "system",
    updatedAt: "2024-01-01T00:00:00Z"
  },

  {
    name: "users:write",
    description: "Create, update, and manage user accounts",
    apiId: "api_001",
    apiName: "User Management API",
    isSystem: true,
    roleCount: 3,
    createdAt: "2024-01-15T10:30:00Z",
    createdBy: "system",
    updatedAt: "2024-01-15T10:30:00Z"
  },
  {
    name: "users:delete",
    description: "Delete user accounts and related data",
    apiId: "api_001",
    apiName: "User Management API",
    isSystem: true,
    roleCount: 2,
    createdAt: "2024-01-15T10:30:00Z",
    createdBy: "system",
    updatedAt: "2024-01-15T10:30:00Z"
  },
  {
    name: "roles:read",
    description: "View role definitions and assignments",
    apiId: "api_002",
    apiName: "Role Management API",
    isSystem: true,
    roleCount: 4,
    createdAt: "2024-01-15T10:30:00Z",
    createdBy: "system",
    updatedAt: "2024-01-15T10:30:00Z"
  },
  {
    name: "roles:write",
    description: "Create and modify role definitions",
    apiId: "api_002",
    apiName: "Role Management API",
    isSystem: true,
    roleCount: 2,
    createdAt: "2024-01-15T10:30:00Z",
    createdBy: "system",
    updatedAt: "2024-01-15T10:30:00Z"
  },
  {
    name: "orders:read",
    description: "View order information and history",
    apiId: "api_003",
    apiName: "Order Management API",
    isSystem: false,
    roleCount: 6,
    createdAt: "2024-01-15T10:30:00Z",
    createdBy: "system",
    updatedAt: "2024-01-15T10:30:00Z"
  },
  {
    name: "orders:write",
    description: "Create and modify orders",
    apiId: "api_003",
    apiName: "Order Management API",
    isSystem: false,
    roleCount: 3,
    createdAt: "2024-01-20T14:15:00Z",
    createdBy: "admin",
    updatedAt: "2024-01-20T14:15:00Z"
  },
  {
    name: "products:read",
    description: "View product catalog and information",
    apiId: "api_004",
    apiName: "Product Catalog API",
    isSystem: false,
    roleCount: 7,
    createdAt: "2024-01-15T10:30:00Z",
    createdBy: "system",
    updatedAt: "2024-01-15T10:30:00Z"
  },
  {
    name: "products:write",
    description: "Create and modify product information",
    apiId: "api_004",
    apiName: "Product Catalog API",
    isSystem: false,
    roleCount: 4,
    createdAt: "2024-01-18T09:45:00Z",
    createdBy: "admin",
    updatedAt: "2024-01-18T09:45:00Z"
  },
  {
    name: "notifications:read",
    description: "View notification history and settings",
    apiId: "api_005",
    apiName: "Notification API",
    isSystem: false,
    roleCount: 5,
    createdAt: "2024-01-15T10:30:00Z",
    createdBy: "system",
    updatedAt: "2024-01-15T10:30:00Z"
  },
  {
    name: "notifications:send",
    description: "Send notifications to users",
    apiId: "api_005",
    apiName: "Notification API",
    isSystem: false,
    roleCount: 2,
    createdAt: "2024-01-22T11:20:00Z",
    createdBy: "admin",
    updatedAt: "2024-01-22T11:20:00Z"
  },
  {
    name: "payments:read",
    description: "View payment information and transaction history",
    apiId: "api_006",
    apiName: "Payment Processing API",
    isSystem: false,
    roleCount: 3,
    createdAt: "2024-01-15T10:30:00Z",
    createdBy: "system",
    updatedAt: "2024-01-15T10:30:00Z"
  },
  {
    name: "payments:process",
    description: "Process payments and refunds",
    apiId: "api_006",
    apiName: "Payment Processing API",
    isSystem: false,
    roleCount: 1,
    createdAt: "2024-01-15T10:30:00Z",
    createdBy: "system",
    updatedAt: "2024-01-15T10:30:00Z"
  },
  {
    name: "analytics:read",
    description: "View analytics data and reports",
    apiId: "api_007",
    apiName: "Analytics API",
    isSystem: false,
    roleCount: 4,
    createdAt: "2024-01-15T10:30:00Z",
    createdBy: "system",
    updatedAt: "2024-01-15T10:30:00Z"
  },
  {
    name: "analytics:export",
    description: "Export analytics data and generate reports",
    apiId: "api_007",
    apiName: "Analytics API",
    isSystem: false,
    roleCount: 3,
    createdAt: "2024-01-25T16:30:00Z",
    createdBy: "admin",
    updatedAt: "2024-01-25T16:30:00Z"
  }
]
