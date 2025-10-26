import type { Service } from "./components/ServiceColumns"

export const MOCK_SERVICES: Service[] = [
  {
    id: "core",
    name: "Core Service",
    description: "Core system service providing fundamental authentication infrastructure and system operations",
    status: "active",
    apiCount: 8,
    policyCount: 5,
    createdAt: "2024-01-01T00:00:00Z",
    createdBy: "system",
    isSystem: true
  },
  {
    id: "auth",
    name: "Authentication Service",
    description: "Authentication and authorization service handling user login, token management, session control, and user management",
    status: "active",
    apiCount: 15,
    policyCount: 12,
    createdAt: "2024-01-01T00:00:00Z",
    createdBy: "system",
    isSystem: true
  },
  {
    id: "sms",
    name: "SMS Service",
    description: "SMS messaging service for sending text notifications, OTP codes, and alerts",
    status: "active",
    apiCount: 4,
    policyCount: 2,
    createdAt: "2024-02-15T10:30:00Z",
    createdBy: "platform-team@example.com",
    isSystem: false
  },
  {
    id: "email",
    name: "Email Service",
    description: "Email service for sending transactional emails, notifications, and marketing communications",
    status: "active",
    apiCount: 6,
    policyCount: 3,
    createdAt: "2024-02-20T14:15:00Z",
    createdBy: "platform-team@example.com",
    isSystem: false
  },
  {
    id: "storage",
    name: "Storage Service",
    description: "File storage service for managing uploads, downloads, and file operations with multiple backend support",
    status: "active",
    apiCount: 8,
    policyCount: 4,
    createdAt: "2024-01-25T16:20:00Z",
    createdBy: "infrastructure-team@example.com",
    isSystem: false
  },
  {
    id: "analytics",
    name: "Analytics Service",
    description: "Analytics service for collecting user behavior data, generating reports, and providing insights",
    status: "maintenance",
    apiCount: 7,
    policyCount: 5,
    createdAt: "2024-03-10T09:45:00Z",
    createdBy: "data-team@example.com",
    isSystem: false
  },
  {
    id: "webhook",
    name: "Webhook Service",
    description: "Webhook service for managing outbound HTTP callbacks and event notifications to external systems",
    status: "deprecated",
    apiCount: 5,
    policyCount: 3,
    createdAt: "2024-03-20T11:00:00Z",
    createdBy: "integration-team@example.com",
    isSystem: false
  },
  {
    id: "legacy-api",
    name: "Legacy API Service",
    description: "Legacy API service that has been replaced by newer services and is no longer in use",
    status: "inactive",
    apiCount: 3,
    policyCount: 1,
    createdAt: "2024-01-10T08:00:00Z",
    createdBy: "legacy-team@example.com",
    isSystem: false
  }
]
