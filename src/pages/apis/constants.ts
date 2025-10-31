import type { Api } from "./components/ApiColumns"

export const MOCK_APIS: Api[] = [
  // Core Service APIs
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    name: "system-management",
    displayName: "System Management API",
    identifier: "SYS7X9K2M",
    description: "Core system operations including health checks, metrics, and configuration management",
    serviceId: "550e8400-e29b-41d4-a716-446655440001",
    serviceName: "Core Service",
    status: "active",
    permissionCount: 5,
    version: "1.0",
    isPublic: false,
    isSystem: true,
    createdAt: "2024-01-01T00:00:00Z",
    createdBy: "system"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    name: "monitoring",
    displayName: "Monitoring API",
    identifier: "MON3K8L9P",
    description: "System monitoring, alerting, and performance tracking capabilities",
    serviceId: "550e8400-e29b-41d4-a716-446655440001",
    serviceName: "Core Service",
    status: "active",
    permissionCount: 3,
    version: "1.2",
    isPublic: false,
    isSystem: true,
    createdAt: "2024-01-01T00:00:00Z",
    createdBy: "system"
  },

  // Authentication Service APIs
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    name: "session-management",
    displayName: "Session Management API",
    identifier: "SES4M7N9Q",
    description: "User authentication, session management, and token operations",
    serviceId: "550e8400-e29b-41d4-a716-446655440002",
    serviceName: "Authentication Service",
    status: "active",
    permissionCount: 4,
    version: "2.1",
    isPublic: true,
    isSystem: true,
    createdAt: "2024-01-01T00:00:00Z",
    createdBy: "system"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440004",
    name: "user-profile",
    displayName: "User Profile API",
    identifier: "USR5P8R2T",
    description: "User profile management, settings, and account operations",
    serviceId: "550e8400-e29b-41d4-a716-446655440002",
    serviceName: "Authentication Service",
    status: "active",
    permissionCount: 6,
    version: "2.0",
    isPublic: false,
    isSystem: false,
    createdAt: "2024-01-01T00:00:00Z",
    createdBy: "system"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440005",
    name: "security",
    displayName: "Security API",
    identifier: "SEC6Q9W3E",
    description: "Password management, 2FA, and security settings",
    serviceId: "550e8400-e29b-41d4-a716-446655440002",
    serviceName: "Authentication Service",
    status: "active",
    permissionCount: 3,
    version: "1.8",
    isPublic: false,
    isSystem: true,
    createdAt: "2024-01-01T00:00:00Z",
    createdBy: "system"
  },

  // SMS Service APIs
  {
    id: "550e8400-e29b-41d4-a716-446655440006",
    name: "sms-messaging",
    displayName: "SMS Messaging API",
    identifier: "SMS7R4T6Y",
    description: "Send SMS messages, check delivery status, and manage messaging operations",
    serviceId: "550e8400-e29b-41d4-a716-446655440003",
    serviceName: "SMS Service",
    status: "active",
    permissionCount: 4,
    version: "1.5",
    isPublic: false,
    isSystem: false,
    createdAt: "2024-01-15T10:30:00Z",
    createdBy: "admin"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440007",
    name: "sms-templates",
    displayName: "SMS Templates API",
    identifier: "TPL8U5I7O",
    description: "Create, manage, and customize SMS message templates",
    serviceId: "550e8400-e29b-41d4-a716-446655440003",
    serviceName: "SMS Service",
    status: "active",
    permissionCount: 3,
    version: "1.2",
    isPublic: false,
    isSystem: false,
    createdAt: "2024-01-15T10:30:00Z",
    createdBy: "admin"
  },

  // Email Service APIs
  {
    id: "550e8400-e29b-41d4-a716-446655440008",
    name: "email-delivery",
    displayName: "Email Delivery API",
    identifier: "EML9P2A5S",
    description: "Send emails, track delivery, and manage email operations",
    serviceId: "550e8400-e29b-41d4-a716-446655440004",
    serviceName: "Email Service",
    status: "active",
    permissionCount: 5,
    version: "2.3",
    isPublic: false,
    isSystem: false,
    createdAt: "2024-01-15T10:30:00Z",
    createdBy: "admin"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440009",
    name: "email-templates",
    displayName: "Email Templates API",
    identifier: "TPL0D3F6G",
    description: "Create, manage, and customize email templates with rich content",
    serviceId: "550e8400-e29b-41d4-a716-446655440004",
    serviceName: "Email Service",
    status: "active",
    permissionCount: 4,
    version: "2.1",
    isPublic: false,
    isSystem: false,
    createdAt: "2024-01-15T10:30:00Z",
    createdBy: "admin"
  },

  // Storage Service APIs
  {
    id: "550e8400-e29b-41d4-a716-446655440010",
    name: "file-management",
    displayName: "File Management API",
    identifier: "FIL1H7J8K",
    description: "Upload, download, delete, and manage files in secure storage",
    serviceId: "550e8400-e29b-41d4-a716-446655440005",
    serviceName: "Storage Service",
    status: "active",
    permissionCount: 6,
    version: "1.8",
    isPublic: false,
    isSystem: false,
    createdAt: "2024-01-15T10:30:00Z",
    createdBy: "admin"
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440011",
    name: "file-metadata",
    displayName: "File Metadata API",
    identifier: "MET2L9M4N",
    description: "Manage file metadata, tags, and organizational structures",
    serviceId: "550e8400-e29b-41d4-a716-446655440005",
    serviceName: "Storage Service",
    status: "active",
    permissionCount: 3,
    version: "1.4",
    isPublic: false,
    isSystem: false,
    createdAt: "2024-01-15T10:30:00Z",
    createdBy: "admin"
  },

  // Analytics Service APIs (Maintenance)
  {
    id: "550e8400-e29b-41d4-a716-446655440012",
    name: "event-tracking",
    displayName: "Event Tracking API",
    identifier: "EVT3B6V8C",
    description: "Track user events, analytics data, and behavioral insights",
    serviceId: "550e8400-e29b-41d4-a716-446655440006",
    serviceName: "Analytics Service",
    status: "maintenance",
    permissionCount: 2,
    version: "0.9",
    isPublic: false,
    isSystem: false,
    createdAt: "2024-01-20T14:20:00Z",
    createdBy: "admin"
  },

  // Webhook Service APIs (Deprecated)
  {
    id: "550e8400-e29b-41d4-a716-446655440013",
    name: "webhook-management",
    displayName: "Webhook Management API",
    identifier: "WHK4X7Z9A",
    description: "Register, manage, and configure webhook endpoints for event notifications",
    serviceId: "550e8400-e29b-41d4-a716-446655440007",
    serviceName: "Webhook Service",
    status: "deprecated",
    permissionCount: 3,
    version: "1.0",
    isPublic: false,
    isSystem: false,
    createdAt: "2024-01-10T09:15:00Z",
    createdBy: "admin"
  },

  // Legacy API Service (Inactive)
  {
    id: "550e8400-e29b-41d4-a716-446655440014",
    name: "legacy-user-management",
    displayName: "Legacy User Management API",
    identifier: "LEG5Y8U2I",
    description: "Legacy user management operations (no longer maintained)",
    serviceId: "550e8400-e29b-41d4-a716-446655440008",
    serviceName: "Legacy API Service",
    status: "inactive",
    permissionCount: 0,
    version: "0.5",
    isPublic: false,
    isSystem: false,
    createdAt: "2023-12-01T00:00:00Z",
    createdBy: "system"
  }
]
