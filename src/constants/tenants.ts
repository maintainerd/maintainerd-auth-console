export type TenantStatus = "active" | "suspended" | "inactive"

export type Tenant = {
  id: string
  identifier: string // Random alphanumeric identifier used in URLs
  name: string
  description: string
  status: TenantStatus
  userCount: number
  createdAt: string
  createdBy: string
  features: string[]
  isSystem: boolean
}

export const MOCK_TENANTS: Tenant[] = [
  {
    id: "default",
    identifier: "def4ult",
    name: "Default",
    description: "System tenant for admin and system users",
    status: "active",
    userCount: 5,
    createdAt: "2024-01-01T00:00:00Z",
    createdBy: "System",
    features: ["sso", "mfa", "audit", "api"],
    isSystem: true,
  },
  {
    id: "acme-corp",
    identifier: "acm3c0rp",
    name: "Acme Corp",
    description: "Main corporate tenant for Acme Corporation",
    status: "active",
    userCount: 1250,
    createdAt: "2024-01-15T10:30:00Z",
    createdBy: "admin@acme.com",
    features: ["sso", "mfa", "audit", "api", "custom-branding"],
    isSystem: false,
  },
  {
    id: "beta-testing",
    identifier: "b3t4t3st",
    name: "Beta Testing",
    description: "Tenant for beta testing new features",
    status: "active",
    userCount: 25,
    createdAt: "2024-02-01T14:20:00Z",
    createdBy: "admin@acme.com",
    features: ["sso", "mfa", "beta-features"],
    isSystem: false,
  },
  {
    id: "staging-env",
    identifier: "st4g1ng3",
    name: "Staging Environment",
    description: "Staging tenant for development and testing",
    status: "suspended",
    userCount: 10,
    createdAt: "2024-01-20T09:15:00Z",
    createdBy: "dev@acme.com",
    features: ["sso", "audit"],
    isSystem: false,
  },
  {
    id: "partner-portal",
    identifier: "p4rtn3rp",
    name: "Partner Portal",
    description: "Dedicated tenant for external partners",
    status: "inactive",
    userCount: 0,
    createdAt: "2024-03-01T16:45:00Z",
    createdBy: "admin@acme.com",
    features: ["sso", "limited-api"],
    isSystem: false,
  },
]

// Utility functions
export const findTenantByIdentifier = (identifier: string): Tenant | undefined => {
  return MOCK_TENANTS.find(tenant => tenant.identifier === identifier)
}

export const findTenantById = (id: string): Tenant | undefined => {
  return MOCK_TENANTS.find(tenant => tenant.id === id)
}

// Generate a random alphanumeric identifier for new tenants
export const generateTenantIdentifier = (): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Note: In the URL structure /{tenantIdentifier}/subpages
 * - The route parameter is still named 'tenantId' for backward compatibility
 * - But the actual value is now the tenant's 'identifier' field (random alphanumeric)
 * - Use findTenantByIdentifier() to get tenant data from URL parameters
 */
