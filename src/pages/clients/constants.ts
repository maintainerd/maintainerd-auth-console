export const CLIENT_STATUSES = [
  "active",
  "inactive"
] as const

export const CLIENT_TYPES = [
  "regular",
  "native",
  "spa",
  "m2m"
] as const

export type ClientStatus = typeof CLIENT_STATUSES[number]
export type ClientType = typeof CLIENT_TYPES[number]

export type Client = {
  id: string
  name: string
  description: string
  type: ClientType
  status: ClientStatus
  clientId: string
  identityProviderId: string
  identityProviderName: string
  redirectUris: string[]
  allowedOrigins: string[]
  grantTypes: string[]
  scopes: string[]
  tokenLifetime: number // in seconds
  refreshTokenLifetime: number // in seconds
  userCount: number
  lastUsed?: string
  createdAt: string
  createdBy: string
  updatedAt: string
  isDefault: boolean
}

export const MOCK_CLIENTS: Client[] = [
  {
    id: "s9y8t3m2d1e0",
    name: "Default",
    description: "Built-in default client for this authentication application",
    type: "spa",
    status: "active",
    clientId: "system-default-client",
    identityProviderId: "k8m3n9p2q7r5",
    identityProviderName: "Default",
    redirectUris: ["https://auth.company.com/callback"],
    allowedOrigins: ["https://auth.company.com"],
    grantTypes: ["authorization_code", "refresh_token"],
    scopes: ["openid", "profile", "email"],
    tokenLifetime: 3600, // 1 hour
    refreshTokenLifetime: 604800, // 7 days
    userCount: 15420,
    lastUsed: "2024-10-26T16:45:00Z",
    createdAt: "2024-01-01T00:00:00Z",
    createdBy: "system",
    updatedAt: "2024-10-26T16:45:00Z",
    isDefault: true
  },
  {
    id: "c1a2b3c4d5e6",
    name: "Web Dashboard",
    description: "Main web application dashboard for user management and administration",
    type: "spa",
    status: "active",
    clientId: "web-dashboard-spa-client",
    identityProviderId: "x4v7w2z9a6b3",
    identityProviderName: "Auth0 Enterprise",
    redirectUris: ["https://app.company.com/callback", "https://app.company.com/silent-callback"],
    allowedOrigins: ["https://app.company.com", "https://staging.company.com"],
    grantTypes: ["authorization_code", "refresh_token"],
    scopes: ["openid", "profile", "email", "read:users", "write:users"],
    tokenLifetime: 3600, // 1 hour
    refreshTokenLifetime: 604800, // 7 days
    userCount: 2450,
    lastUsed: "2024-10-26T14:30:00Z",
    createdAt: "2024-01-15T10:30:00Z",
    createdBy: "admin",
    updatedAt: "2024-10-25T16:20:00Z",
    isDefault: false
  },
  {
    id: "f7g8h9i0j1k2",
    name: "Mobile App iOS",
    description: "Native iOS application for mobile users with biometric authentication",
    type: "native",
    status: "active",
    clientId: "mobile-ios-native-client",
    identityProviderId: "h9j4l8n1p5q2",
    identityProviderName: "Okta Corporate",
    redirectUris: ["com.company.app://callback"],
    allowedOrigins: [],
    grantTypes: ["authorization_code", "refresh_token"],
    scopes: ["openid", "profile", "email", "offline_access"],
    tokenLifetime: 3600, // 1 hour
    refreshTokenLifetime: 2592000, // 30 days
    userCount: 8920,
    lastUsed: "2024-10-26T15:45:00Z",
    createdAt: "2024-02-20T14:15:00Z",
    createdBy: "mobile-team",
    updatedAt: "2024-10-24T09:30:00Z",
    isDefault: false
  },
  {
    id: "l3m4n5o6p7q8",
    name: "API Service",
    description: "Machine-to-machine client for backend service communication and automation",
    type: "m2m",
    status: "active",
    clientId: "api-service-m2m-client",
    identityProviderId: "m7s3t8u4v9w1",
    identityProviderName: "Azure AD Integration",
    redirectUris: [],
    allowedOrigins: [],
    grantTypes: ["client_credentials"],
    scopes: ["read:services", "write:services", "read:apis", "write:apis"],
    tokenLifetime: 7200, // 2 hours
    refreshTokenLifetime: 0, // No refresh token for M2M
    userCount: 0, // M2M doesn't have users
    lastUsed: "2024-10-26T16:00:00Z",
    createdAt: "2024-03-10T11:45:00Z",
    createdBy: "backend-team",
    updatedAt: "2024-10-26T12:15:00Z",
    isDefault: false
  },
  {
    id: "r9s0t1u2v3w4",
    name: "Partner Portal",
    description: "External partner access portal with limited permissions and custom branding",
    type: "regular",
    status: "active",
    clientId: "partner-portal-web-client",
    identityProviderId: "x4v7w2z9a6b3",
    identityProviderName: "Auth0 Enterprise",
    redirectUris: ["https://partners.company.com/auth/callback"],
    allowedOrigins: ["https://partners.company.com"],
    grantTypes: ["authorization_code", "refresh_token"],
    scopes: ["openid", "profile", "email", "read:partner-data"],
    tokenLifetime: 1800, // 30 minutes
    refreshTokenLifetime: 86400, // 1 day
    userCount: 156,
    lastUsed: "2024-10-26T13:20:00Z",
    createdAt: "2024-04-05T16:30:00Z",
    createdBy: "partnerships",
    updatedAt: "2024-10-22T14:45:00Z",
    isDefault: false
  },
  {
    id: "x5y6z7a8b9c0",
    name: "Mobile App Android",
    description: "Native Android application with push notifications and offline capabilities",
    type: "native",
    status: "active",
    clientId: "mobile-android-native-client",
    identityProviderId: "h9j4l8n1p5q2",
    identityProviderName: "Okta Corporate",
    redirectUris: ["com.company.app://callback"],
    allowedOrigins: [],
    grantTypes: ["authorization_code", "refresh_token"],
    scopes: ["openid", "profile", "email", "offline_access", "push:notifications"],
    tokenLifetime: 3600, // 1 hour
    refreshTokenLifetime: 2592000, // 30 days
    userCount: 7340,
    lastUsed: "2024-10-26T15:50:00Z",
    createdAt: "2024-02-25T09:20:00Z",
    createdBy: "mobile-team",
    updatedAt: "2024-10-23T11:10:00Z",
    isDefault: false
  },
  {
    id: "d1e2f3g4h5i6",
    name: "Analytics Dashboard",
    description: "Internal analytics and reporting dashboard for business intelligence",
    type: "spa",
    status: "active",
    clientId: "analytics-spa-client",
    identityProviderId: "m7s3t8u4v9w1",
    identityProviderName: "Azure AD Integration",
    redirectUris: ["https://analytics.company.com/callback"],
    allowedOrigins: ["https://analytics.company.com"],
    grantTypes: ["authorization_code", "refresh_token"],
    scopes: ["openid", "profile", "read:analytics", "read:reports"],
    tokenLifetime: 7200, // 2 hours
    refreshTokenLifetime: 604800, // 7 days
    userCount: 45,
    lastUsed: "2024-10-26T10:15:00Z",
    createdAt: "2024-05-12T13:40:00Z",
    createdBy: "analytics-team",
    updatedAt: "2024-10-20T15:25:00Z",
    isDefault: false
  },
  {
    id: "j7k8l9m0n1o2",
    name: "Legacy Desktop App",
    description: "Legacy desktop application being migrated to modern authentication",
    type: "regular",
    status: "inactive",
    clientId: "legacy-desktop-client",
    identityProviderId: "r6e2y5i8o3u7",
    identityProviderName: "Development Keycloak",
    redirectUris: ["http://localhost:8080/callback"],
    allowedOrigins: [],
    grantTypes: ["authorization_code", "refresh_token", "password"],
    scopes: ["openid", "profile", "email", "legacy:access"],
    tokenLifetime: 1800, // 30 minutes
    refreshTokenLifetime: 43200, // 12 hours
    userCount: 23,
    lastUsed: "2024-10-20T08:30:00Z",
    createdAt: "2023-11-15T14:20:00Z",
    createdBy: "legacy-team",
    updatedAt: "2024-09-15T10:45:00Z",
    isDefault: false
  },
  {
    id: "p3q4r5s6t7u8",
    name: "Development Test Client",
    description: "Development and testing client for new feature validation",
    type: "spa",
    status: "inactive",
    clientId: "dev-test-spa-client",
    identityProviderId: "r6e2y5i8o3u7",
    identityProviderName: "Development Keycloak",
    redirectUris: ["http://localhost:3000/callback", "https://dev.company.com/callback"],
    allowedOrigins: ["http://localhost:3000", "https://dev.company.com"],
    grantTypes: ["authorization_code", "refresh_token"],
    scopes: ["openid", "profile", "email", "dev:access"],
    tokenLifetime: 900, // 15 minutes
    refreshTokenLifetime: 3600, // 1 hour
    userCount: 8,
    lastUsed: "2024-10-26T16:45:00Z",
    createdAt: "2024-09-01T12:00:00Z",
    createdBy: "dev-team",
    updatedAt: "2024-10-26T16:45:00Z",
    isDefault: false
  }
]
