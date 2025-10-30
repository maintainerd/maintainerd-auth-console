import type { Container } from "./components/ContainerColumns"

export const MOCK_CONTAINERS: Container[] = [
  {
    id: "SyS7kL9mN2pQ4rT6vX8zA1bC3dE5fG",
    name: "Default",
    description: "System container for internal users and administrative access",
    status: "active",
    userCount: 25,
    createdAt: "2024-01-01T00:00:00Z",
    createdBy: "system",
    features: ["SSO", "2FA", "RBAC", "Audit Logs", "System Access"],
    isSystem: true
  },
  {
    id: "AcM7eK9nL2pQ4rT6vX8zA1bC3dE5fH",
    name: "Acme Corporation",
    description: "Main production tenant for Acme Corporation with full feature access",
    status: "active",
    userCount: 1250,
    createdAt: "2024-01-15T10:30:00Z",
    createdBy: "admin",
    features: ["SSO", "2FA", "RBAC", "Audit Logs", "Custom Branding"],
    isSystem: false
  },
  {
    id: "TeC7hS9tL2pQ4rT6vX8zA1bC3dE5fJ",
    name: "TechStart Inc",
    description: "Startup tenant with basic authentication features",
    status: "active",
    userCount: 45,
    createdAt: "2024-01-08T14:20:00Z",
    createdBy: "admin",
    features: ["SSO", "2FA", "RBAC"],
    isSystem: false
  },
  {
    id: "GlR7eT9aL2pQ4rT6vX8zA1bC3dE5fK",
    name: "Global Retail",
    description: "Multi-region retail chain with complex user hierarchy",
    status: "active",
    userCount: 3200,
    createdAt: "2023-12-25T16:45:00Z",
    createdBy: "system",
    features: ["SSO", "2FA", "RBAC", "Audit Logs", "Custom Branding", "API Access"],
    isSystem: false
  },
  {
    id: "BeT7aO9rG2pQ4rT6vX8zA1bC3dE5fL",
    name: "Beta Testing Org",
    description: "Testing environment for new features and integrations",
    status: "suspended",
    userCount: 12,
    createdAt: "2024-01-20T11:00:00Z",
    createdBy: "developer",
    features: ["SSO"],
    isSystem: false
  },
  {
    id: "DeV7cO9rP2pQ4rT6vX8zA1bC3dE5fM",
    name: "DevCorp Solutions",
    description: "Development agency managing multiple client projects",
    status: "active",
    userCount: 89,
    createdAt: "2024-01-22T09:30:00Z",
    createdBy: "admin",
    features: ["SSO", "2FA", "RBAC"],
    isSystem: false
  },
  {
    id: "HeA7lT9hP2pQ4rT6vX8zA1bC3dE5fN",
    name: "Healthcare Plus",
    description: "Healthcare organization with strict compliance requirements",
    status: "active",
    userCount: 850,
    createdAt: "2023-12-10T08:15:00Z",
    createdBy: "admin",
    features: ["SSO", "2FA", "RBAC", "Audit Logs", "Compliance Reports"],
    isSystem: false
  },
  {
    id: "DeM7oE9nV2pQ4rT6vX8zA1bC3dE5fP",
    name: "Demo Environment",
    description: "Demonstration tenant for sales and marketing purposes",
    status: "inactive",
    userCount: 5,
    createdAt: "2024-01-26T10:45:00Z",
    createdBy: "sales",
    features: ["SSO", "2FA"],
    isSystem: false
  }
]
