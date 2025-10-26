import type { Permission } from "./components/PermissionColumns"

export const MOCK_PERMISSIONS: Permission[] = [
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
