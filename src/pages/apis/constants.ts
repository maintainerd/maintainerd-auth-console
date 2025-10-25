import type { Api } from "./components/ApiColumns"

export const MOCK_APIS: Api[] = [
  // Core Service APIs
  {
    id: "api_core_system",
    name: "System Management API",
    description: "Core system operations including health checks, metrics, and configuration management",
    serviceId: "core",
    serviceName: "Core Service",
    status: "active",
    permissionCount: 5,
    version: "1.0",
    isPublic: false,
    createdAt: "2024-01-01T00:00:00Z",
    createdBy: "system"
  },
  {
    id: "api_core_monitoring",
    name: "Monitoring API",
    description: "System monitoring, alerting, and performance tracking capabilities",
    serviceId: "core",
    serviceName: "Core Service",
    status: "active",
    permissionCount: 3,
    version: "1.2",
    isPublic: false,
    createdAt: "2024-01-01T00:00:00Z",
    createdBy: "system"
  },

  // Authentication Service APIs
  {
    id: "api_auth_session",
    name: "Session Management API",
    description: "User authentication, session management, and token operations",
    serviceId: "auth",
    serviceName: "Authentication Service",
    status: "active",
    permissionCount: 4,
    version: "2.1",
    isPublic: true,
    createdAt: "2024-01-01T00:00:00Z",
    createdBy: "system"
  },
  {
    id: "api_auth_profile",
    name: "User Profile API",
    description: "User profile management, settings, and account operations",
    serviceId: "auth",
    serviceName: "Authentication Service",
    status: "active",
    permissionCount: 6,
    version: "2.0",
    isPublic: false,
    createdAt: "2024-01-01T00:00:00Z",
    createdBy: "system"
  },
  {
    id: "api_auth_security",
    name: "Security API",
    description: "Password management, 2FA, and security settings",
    serviceId: "auth",
    serviceName: "Authentication Service",
    status: "active",
    permissionCount: 3,
    version: "1.8",
    isPublic: false,
    createdAt: "2024-01-01T00:00:00Z",
    createdBy: "system"
  },

  // SMS Service APIs
  {
    id: "api_sms_messaging",
    name: "SMS Messaging API",
    description: "Send SMS messages, check delivery status, and manage messaging operations",
    serviceId: "sms",
    serviceName: "SMS Service",
    status: "active",
    permissionCount: 4,
    version: "1.5",
    isPublic: false,
    createdAt: "2024-01-15T10:30:00Z",
    createdBy: "admin"
  },
  {
    id: "api_sms_templates",
    name: "SMS Templates API",
    description: "Create, manage, and customize SMS message templates",
    serviceId: "sms",
    serviceName: "SMS Service",
    status: "active",
    permissionCount: 3,
    version: "1.2",
    isPublic: false,
    createdAt: "2024-01-15T10:30:00Z",
    createdBy: "admin"
  },

  // Email Service APIs
  {
    id: "api_email_delivery",
    name: "Email Delivery API",
    description: "Send emails, track delivery, and manage email operations",
    serviceId: "email",
    serviceName: "Email Service",
    status: "active",
    permissionCount: 5,
    version: "2.3",
    isPublic: false,
    createdAt: "2024-01-15T10:30:00Z",
    createdBy: "admin"
  },
  {
    id: "api_email_templates",
    name: "Email Templates API",
    description: "Create, manage, and customize email templates with rich content",
    serviceId: "email",
    serviceName: "Email Service",
    status: "active",
    permissionCount: 4,
    version: "2.1",
    isPublic: false,
    createdAt: "2024-01-15T10:30:00Z",
    createdBy: "admin"
  },

  // Storage Service APIs
  {
    id: "api_storage_files",
    name: "File Management API",
    description: "Upload, download, delete, and manage files in secure storage",
    serviceId: "storage",
    serviceName: "Storage Service",
    status: "active",
    permissionCount: 6,
    version: "1.8",
    isPublic: false,
    createdAt: "2024-01-15T10:30:00Z",
    createdBy: "admin"
  },
  {
    id: "api_storage_metadata",
    name: "File Metadata API",
    description: "Manage file metadata, tags, and organizational structures",
    serviceId: "storage",
    serviceName: "Storage Service",
    status: "active",
    permissionCount: 3,
    version: "1.4",
    isPublic: false,
    createdAt: "2024-01-15T10:30:00Z",
    createdBy: "admin"
  },

  // Analytics Service APIs (Maintenance)
  {
    id: "api_analytics_tracking",
    name: "Event Tracking API",
    description: "Track user events, analytics data, and behavioral insights",
    serviceId: "analytics",
    serviceName: "Analytics Service",
    status: "maintenance",
    permissionCount: 2,
    version: "0.9",
    isPublic: false,
    createdAt: "2024-01-20T14:20:00Z",
    createdBy: "admin"
  },

  // Webhook Service APIs (Deprecated)
  {
    id: "api_webhook_management",
    name: "Webhook Management API",
    description: "Register, manage, and configure webhook endpoints for event notifications",
    serviceId: "webhook",
    serviceName: "Webhook Service",
    status: "deprecated",
    permissionCount: 3,
    version: "1.0",
    isPublic: false,
    createdAt: "2024-01-10T09:15:00Z",
    createdBy: "admin"
  },

  // Legacy API Service (Inactive)
  {
    id: "api_legacy_users",
    name: "Legacy User Management API",
    description: "Legacy user management operations (no longer maintained)",
    serviceId: "legacy-api",
    serviceName: "Legacy API Service",
    status: "inactive",
    permissionCount: 0,
    version: "0.5",
    isPublic: false,
    createdAt: "2023-12-01T00:00:00Z",
    createdBy: "system"
  }
]
