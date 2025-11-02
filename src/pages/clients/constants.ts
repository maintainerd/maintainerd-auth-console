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

export type FieldMapping = {
  id?: string           // Unique identifier for React key
  fieldType: "standard" | "custom" // Whether it's a standard field or custom field
  localField?: string    // Local field name for standard fields (e.g., "email", "username", "firstName")
  customFieldName?: string // Custom field name when fieldType is "custom"
  externalField: string // External provider field name (e.g., "email_address", "login", "given_name")
  required: boolean     // Whether this field mapping is required
  transform?: string    // Optional transformation rule (e.g., "lowercase", "trim")
  category: "user" | "profile" | "custom" // Where the field is stored
}

export type Client = {
  id: string
  name: string
  description: string
  type: ClientType
  status: ClientStatus
  clientId: string
  providerId: string           // Associated provider (identity or social)
  providerName: string         // Provider display name
  providerType: string         // Provider type (e.g., "auth0", "google", "custom")
  redirectUris: string[]
  allowedOrigins: string[]
  grantTypes: string[]
  scopes: string[]
  tokenLifetime: number // in seconds
  refreshTokenLifetime: number // in seconds
  fieldMappings: FieldMapping[] // Field mappings for external providers
  customFields: Record<string, string> // Custom fields for provider-specific requirements
  userCount: number
  lastUsed?: string
  createdAt: string
  createdBy: string
  updatedAt: string
  isDefault: boolean
}

export const MOCK_CLIENTS: Client[] = [
  {
    id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    name: "Default",
    description: "Built-in default client for this authentication application",
    type: "spa",
    status: "active",
    clientId: "system-default-client",
    providerId: "k8m3n9p2-q7r5-s1t2-u3v4-w5x6y7z8a9b0",
    providerName: "Built-in Authentication System",
    providerType: "custom",
    redirectUris: ["https://auth.company.com/callback"],
    allowedOrigins: ["https://auth.company.com"],
    grantTypes: ["authorization_code", "refresh_token"],
    scopes: ["openid", "profile", "email"],
    tokenLifetime: 3600, // 1 hour
    refreshTokenLifetime: 604800, // 7 days
    fieldMappings: [], // Built-in provider doesn't need field mappings
    customFields: {},
    userCount: 15420,
    lastUsed: "2024-10-26T16:45:00Z",
    createdAt: "2024-01-01T00:00:00Z",
    createdBy: "system",
    updatedAt: "2024-10-26T16:45:00Z",
    isDefault: true
  },
  {
    id: "b2c3d4e5-f6g7-8901-bcde-f23456789012",
    name: "Web Dashboard",
    description: "Main web application dashboard for user management and administration",
    type: "spa",
    status: "active",
    clientId: "web-dashboard-spa-client",
    providerId: "x4v7w2z9-a6b3-c4d5-e6f7-g8h9i0j1k2l3",
    providerName: "Auth0 Enterprise",
    providerType: "auth0",
    redirectUris: ["https://app.company.com/callback", "https://app.company.com/silent-callback"],
    allowedOrigins: ["https://app.company.com", "https://staging.company.com"],
    grantTypes: ["authorization_code", "refresh_token"],
    scopes: ["openid", "profile", "email", "read:users", "write:users"],
    tokenLifetime: 3600, // 1 hour
    refreshTokenLifetime: 604800, // 7 days
    fieldMappings: [
      { localField: "email", externalField: "email", required: true },
      { localField: "username", externalField: "nickname", required: true },
      { localField: "firstName", externalField: "given_name", required: false },
      { localField: "lastName", externalField: "family_name", required: false },
      { localField: "avatar", externalField: "picture", required: false }
    ],
    customFields: {
      "auth0_user_id": "user_id",
      "connection": "Username-Password-Authentication"
    },
    userCount: 2450,
    lastUsed: "2024-10-26T14:30:00Z",
    createdAt: "2024-01-15T10:30:00Z",
    createdBy: "admin",
    updatedAt: "2024-10-25T16:20:00Z",
    isDefault: false
  },
  {
    id: "c3d4e5f6-g7h8-9012-cdef-345678901234",
    name: "Mobile App iOS",
    description: "Native iOS application for mobile users with biometric authentication",
    type: "native",
    status: "active",
    clientId: "mobile-ios-native-client",
    providerId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890", // Google OAuth
    providerName: "Google OAuth",
    providerType: "google",
    redirectUris: ["com.company.app://callback"],
    allowedOrigins: [],
    grantTypes: ["authorization_code", "refresh_token"],
    scopes: ["openid", "profile", "email", "offline_access"],
    tokenLifetime: 3600, // 1 hour
    refreshTokenLifetime: 2592000, // 30 days
    fieldMappings: [
      { localField: "email", externalField: "email", required: true },
      { localField: "username", externalField: "email", required: true, transform: "lowercase" },
      { localField: "firstName", externalField: "given_name", required: false },
      { localField: "lastName", externalField: "family_name", required: false },
      { localField: "avatar", externalField: "picture", required: false },
      { localField: "locale", externalField: "locale", required: false }
    ],
    customFields: {
      "google_id": "sub",
      "verified_email": "email_verified"
    },
    userCount: 8920,
    lastUsed: "2024-10-26T15:45:00Z",
    createdAt: "2024-02-20T14:15:00Z",
    createdBy: "mobile-team",
    updatedAt: "2024-10-24T09:30:00Z",
    isDefault: false
  },
  {
    id: "d4e5f6g7-h8i9-0123-def4-456789012345",
    name: "API Service",
    description: "Machine-to-machine client for backend service communication and automation",
    type: "m2m",
    status: "active",
    clientId: "api-service-m2m-client",
    providerId: "m7s3t8u4-v9w1-x2y3-z4a5-b6c7d8e9f0g1",
    providerName: "Azure AD Integration",
    providerType: "azure_ad",
    redirectUris: [],
    allowedOrigins: [],
    grantTypes: ["client_credentials"],
    scopes: ["read:services", "write:services", "read:apis", "write:apis"],
    tokenLifetime: 7200, // 2 hours
    refreshTokenLifetime: 0, // No refresh token for M2M
    fieldMappings: [], // M2M doesn't need user field mappings
    customFields: {},
    userCount: 0, // M2M doesn't have users
    lastUsed: "2024-10-26T16:00:00Z",
    createdAt: "2024-03-10T11:45:00Z",
    createdBy: "backend-team",
    updatedAt: "2024-10-26T12:15:00Z",
    isDefault: false
  },
  {
    id: "e5f6g7h8-i9j0-1234-efg5-567890123456",
    name: "Partner Portal",
    description: "External partner access portal with limited permissions and custom branding",
    type: "regular",
    status: "active",
    clientId: "partner-portal-web-client",
    providerId: "x4v7w2z9-a6b3-c4d5-e6f7-g8h9i0j1k2l3",
    providerName: "Auth0 Enterprise",
    providerType: "auth0",
    redirectUris: ["https://partners.company.com/auth/callback"],
    allowedOrigins: ["https://partners.company.com"],
    grantTypes: ["authorization_code", "refresh_token"],
    scopes: ["openid", "profile", "email", "read:partner-data"],
    tokenLifetime: 1800, // 30 minutes
    refreshTokenLifetime: 86400, // 1 day
    fieldMappings: [
      { localField: "email", externalField: "email", required: true },
      { localField: "username", externalField: "nickname", required: true }
    ],
    customFields: { "partner_tier": "metadata.tier" },
    userCount: 156,
    lastUsed: "2024-10-26T13:20:00Z",
    createdAt: "2024-04-05T16:30:00Z",
    createdBy: "partnerships",
    updatedAt: "2024-10-22T14:45:00Z",
    isDefault: false
  },
  {
    id: "f6g7h8i9-j0k1-2345-fgh6-678901234567",
    name: "Mobile App Android",
    description: "Native Android application with push notifications and offline capabilities",
    type: "native",
    status: "active",
    clientId: "mobile-android-native-client",
    providerId: "h9j4l8n1-p5q2-r3s4-t5u6-v7w8x9y0z1a2",
    providerName: "Okta Corporate",
    providerType: "okta",
    redirectUris: ["com.company.app://callback"],
    allowedOrigins: [],
    grantTypes: ["authorization_code", "refresh_token"],
    scopes: ["openid", "profile", "email", "offline_access", "push:notifications"],
    tokenLifetime: 3600, // 1 hour
    refreshTokenLifetime: 2592000, // 30 days
    fieldMappings: [
      { localField: "email", externalField: "email", required: true },
      { localField: "username", externalField: "preferred_username", required: true }
    ],
    customFields: {},
    userCount: 7340,
    lastUsed: "2024-10-26T15:50:00Z",
    createdAt: "2024-02-25T09:20:00Z",
    createdBy: "mobile-team",
    updatedAt: "2024-10-23T11:10:00Z",
    isDefault: false
  },
  {
    id: "g7h8i9j0-k1l2-3456-ghi7-789012345678",
    name: "Analytics Dashboard",
    description: "Internal analytics and reporting dashboard for business intelligence",
    type: "spa",
    status: "active",
    clientId: "analytics-spa-client",
    providerId: "m7s3t8u4-v9w1-x2y3-z4a5-b6c7d8e9f0g1",
    providerName: "Azure AD Integration",
    providerType: "azure_ad",
    redirectUris: ["https://analytics.company.com/callback"],
    allowedOrigins: ["https://analytics.company.com"],
    grantTypes: ["authorization_code", "refresh_token"],
    scopes: ["openid", "profile", "read:analytics", "read:reports"],
    tokenLifetime: 7200, // 2 hours
    refreshTokenLifetime: 604800, // 7 days
    fieldMappings: [
      { localField: "email", externalField: "mail", required: true },
      { localField: "username", externalField: "userPrincipalName", required: true }
    ],
    customFields: {},
    userCount: 45,
    lastUsed: "2024-10-26T10:15:00Z",
    createdAt: "2024-05-12T13:40:00Z",
    createdBy: "analytics-team",
    updatedAt: "2024-10-20T15:25:00Z",
    isDefault: false
  },
  {
    id: "h8i9j0k1-l2m3-4567-hij8-890123456789",
    name: "Legacy Desktop App",
    description: "Legacy desktop application being migrated to modern authentication",
    type: "regular",
    status: "inactive",
    clientId: "legacy-desktop-client",
    providerId: "r6e2y5i8-o3u7-a1b2-c3d4-e5f6g7h8i9j0",
    providerName: "Development Keycloak",
    providerType: "keycloak",
    redirectUris: ["http://localhost:8080/callback"],
    allowedOrigins: [],
    grantTypes: ["authorization_code", "refresh_token", "password"],
    scopes: ["openid", "profile", "email", "legacy:access"],
    tokenLifetime: 1800, // 30 minutes
    refreshTokenLifetime: 43200, // 12 hours
    fieldMappings: [],
    customFields: {},
    userCount: 23,
    lastUsed: "2024-10-20T08:30:00Z",
    createdAt: "2023-11-15T14:20:00Z",
    createdBy: "legacy-team",
    updatedAt: "2024-09-15T10:45:00Z",
    isDefault: false
  },
  {
    id: "i9j0k1l2-m3n4-5678-ijk9-901234567890",
    name: "Development Test Client",
    description: "Development and testing client for new feature validation",
    type: "spa",
    status: "inactive",
    clientId: "dev-test-spa-client",
    providerId: "r6e2y5i8-o3u7-a1b2-c3d4-e5f6g7h8i9j0",
    providerName: "Development Keycloak",
    providerType: "keycloak",
    redirectUris: ["http://localhost:3000/callback", "https://dev.company.com/callback"],
    allowedOrigins: ["http://localhost:3000", "https://dev.company.com"],
    grantTypes: ["authorization_code", "refresh_token"],
    scopes: ["openid", "profile", "email", "dev:access"],
    tokenLifetime: 900, // 15 minutes
    refreshTokenLifetime: 3600, // 1 hour
    fieldMappings: [],
    customFields: {},
    userCount: 8,
    lastUsed: "2024-10-26T16:45:00Z",
    createdAt: "2024-09-01T12:00:00Z",
    createdBy: "dev-team",
    updatedAt: "2024-10-26T16:45:00Z",
    isDefault: false
  }
]
