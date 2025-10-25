import type { Role } from "./components/RoleColumns"

export const MOCK_ROLES: Role[] = [
  {
    id: "1",
    name: "Admin",
    description: "Full system access with all permissions",
    permissions: ["users.read", "users.write", "users.delete", "roles.read", "roles.write", "roles.delete", "system.admin"],
    userCount: 3,
    isSystem: true,
    isActive: true,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
    createdBy: "System"
  },
  {
    id: "2",
    name: "User",
    description: "Standard user access with basic permissions",
    permissions: ["users.read", "profile.write"],
    userCount: 15,
    isSystem: true,
    isActive: true,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
    createdBy: "System"
  },
  {
    id: "3",
    name: "Manager",
    description: "Team management permissions with user oversight",
    permissions: ["users.read", "users.write", "teams.read", "teams.write", "reports.read"],
    userCount: 8,
    isSystem: false,
    isActive: true,
    createdAt: "2024-02-01T14:20:00Z",
    updatedAt: "2024-02-15T09:45:00Z",
    createdBy: "admin@example.com"
  },
  {
    id: "4",
    name: "Developer",
    description: "Development team access with code and deployment permissions",
    permissions: ["users.read", "code.read", "code.write", "deploy.read", "deploy.write", "logs.read"],
    userCount: 12,
    isSystem: false,
    isActive: true,
    createdAt: "2024-02-05T11:15:00Z",
    updatedAt: "2024-02-20T16:30:00Z",
    createdBy: "admin@example.com"
  },
  {
    id: "5",
    name: "Security",
    description: "Security team with audit and monitoring permissions",
    permissions: ["users.read", "audit.read", "security.read", "security.write", "logs.read", "monitoring.read"],
    userCount: 2,
    isSystem: false,
    isActive: true,
    createdAt: "2024-02-10T08:45:00Z",
    updatedAt: "2024-02-25T13:20:00Z",
    createdBy: "admin@example.com"
  },
  {
    id: "6",
    name: "Viewer",
    description: "Read-only access for reporting and monitoring",
    permissions: ["users.read", "reports.read", "monitoring.read"],
    userCount: 5,
    isSystem: false,
    isActive: true,
    createdAt: "2024-02-12T16:00:00Z",
    updatedAt: "2024-02-12T16:00:00Z",
    createdBy: "admin@example.com"
  },
  {
    id: "7",
    name: "Guest",
    description: "Temporary access role for external users",
    permissions: ["profile.read"],
    userCount: 0,
    isSystem: false,
    isActive: false,
    createdAt: "2024-01-20T12:00:00Z",
    updatedAt: "2024-02-28T10:15:00Z",
    createdBy: "admin@example.com"
  }
]

// Available permissions for role management
export const AVAILABLE_PERMISSIONS = [
  // User Management
  "users.read",
  "users.write", 
  "users.delete",
  
  // Role Management
  "roles.read",
  "roles.write",
  "roles.delete",
  
  // Team Management
  "teams.read",
  "teams.write",
  "teams.delete",
  
  // Code & Development
  "code.read",
  "code.write",
  "deploy.read",
  "deploy.write",
  
  // Security & Audit
  "security.read",
  "security.write",
  "audit.read",
  "logs.read",
  
  // Monitoring & Reports
  "monitoring.read",
  "reports.read",
  "reports.write",
  
  // System Administration
  "system.admin",
  "system.config",
  
  // Profile Management
  "profile.read",
  "profile.write"
] as const

// Role status options
export const ROLE_STATUSES = [
  "active", "inactive"
] as const

// Permission categories for better organization
export const PERMISSION_CATEGORIES = {
  "User Management": ["users.read", "users.write", "users.delete"],
  "Role Management": ["roles.read", "roles.write", "roles.delete"],
  "Team Management": ["teams.read", "teams.write", "teams.delete"],
  "Development": ["code.read", "code.write", "deploy.read", "deploy.write"],
  "Security": ["security.read", "security.write", "audit.read", "logs.read"],
  "Monitoring": ["monitoring.read", "reports.read", "reports.write"],
  "System": ["system.admin", "system.config"],
  "Profile": ["profile.read", "profile.write"]
} as const
