import type { IdentityProvider } from "./components/IdentityProviderColumns"

// Available status options
export const IDENTITY_PROVIDER_STATUSES = [
  "active",
  "inactive",
  "configuring"
] as const

export const MOCK_IDENTITY_PROVIDERS: IdentityProvider[] = [
  {
    id: "k8m3n9p2q7r5",
    name: "Default",
    description: "Built-in authentication system with user management and security features",
    type: "custom",
    status: "active",
    userCount: 15420,
    isDefault: true,
    endpoint: "internal://auth.system",
    createdAt: "2024-01-01T00:00:00Z",
    createdBy: "system",
    updatedAt: "2024-10-26T08:15:00Z",
    lastSync: "2024-10-26T08:15:00Z"
  },
  {
    id: "x4v7w2z9a6b3",
    name: "Auth0 Enterprise",
    description: "Enterprise Auth0 tenant for B2B customer authentication",
    type: "auth0",
    status: "active",
    userCount: 8750,
    isDefault: false,
    endpoint: "https://company-prod.auth0.com",
    createdAt: "2024-02-10T09:15:00Z",
    createdBy: "admin",
    updatedAt: "2024-10-25T11:30:00Z",
    lastSync: "2024-10-26T07:45:00Z"
  },
  {
    id: "h9j4l8n1p5q2",
    name: "Okta Corporate",
    description: "Corporate Okta instance for employee SSO and directory services",
    type: "okta",
    status: "active",
    userCount: 2340,
    isDefault: false,
    endpoint: "https://company.okta.com",
    createdAt: "2024-03-05T14:20:00Z",
    createdBy: "admin",
    updatedAt: "2024-10-24T16:10:00Z",
    lastSync: "2024-10-26T06:30:00Z"
  },
  {
    id: "m7s3t8u4v9w1",
    name: "Azure AD Integration",
    description: "Microsoft Azure Active Directory for Office 365 integration",
    type: "azure_ad",
    status: "active",
    userCount: 5680,
    isDefault: false,
    endpoint: "https://login.microsoftonline.com/tenant-id",
    createdAt: "2024-01-20T11:45:00Z",
    createdBy: "system",
    updatedAt: "2024-10-23T13:25:00Z",
    lastSync: "2024-10-26T05:20:00Z"
  },
  {
    id: "r6e2y5i8o3u7",
    name: "Development Keycloak",
    description: "Self-hosted Keycloak instance for development and testing",
    type: "keycloak",
    status: "inactive",
    userCount: 125,
    isDefault: false,
    endpoint: "https://dev-auth.company.com/auth/realms/development",
    createdAt: "2024-04-12T08:30:00Z",
    createdBy: "developer",
    updatedAt: "2024-09-15T10:00:00Z",
    lastSync: "2024-09-15T10:00:00Z"
  },
  {
    id: "f4g7h2j9k5l8",
    name: "Firebase Auth",
    description: "Firebase Authentication for mobile app users",
    type: "firebase",
    status: "active",
    userCount: 12500,
    isDefault: false,
    endpoint: "https://company-mobile-app.firebaseapp.com",
    createdAt: "2024-05-08T15:20:00Z",
    createdBy: "mobile-team",
    updatedAt: "2024-10-22T09:40:00Z",
    lastSync: "2024-10-26T04:15:00Z"
  },
  {
    id: "z3x6c9v2b5n8",
    name: "Legacy LDAP Bridge",
    description: "Custom bridge connecting legacy LDAP directory to modern auth",
    type: "custom",
    status: "configuring",
    userCount: 890,
    isDefault: false,
    endpoint: "https://auth-bridge.company.com/ldap",
    createdAt: "2024-09-20T12:10:00Z",
    createdBy: "admin",
    updatedAt: "2024-10-25T14:30:00Z"
  },
  {
    id: "q1w4e7r9t2y6",
    name: "Staging Cognito",
    description: "AWS Cognito user pool for staging environment testing",
    type: "cognito",
    status: "active",
    userCount: 45,
    isDefault: false,
    region: "us-west-2",
    endpoint: "cognito-idp.us-west-2.amazonaws.com/us-west-2_XYZ789ABC",
    createdAt: "2024-06-15T10:00:00Z",
    createdBy: "devops",
    updatedAt: "2024-10-21T16:45:00Z",
    lastSync: "2024-10-26T03:30:00Z"
  },
  {
    id: "a8s5d2f6g3h9",
    name: "Partner Auth0",
    description: "Dedicated Auth0 tenant for partner and vendor access",
    type: "auth0",
    status: "active",
    userCount: 320,
    isDefault: false,
    endpoint: "https://company-partners.auth0.com",
    createdAt: "2024-07-22T13:25:00Z",
    createdBy: "partnerships",
    updatedAt: "2024-10-20T11:15:00Z",
    lastSync: "2024-10-26T02:45:00Z"
  },
  {
    id: "p9o4i7u1y5t3",
    name: "Custom SAML Provider",
    description: "Custom SAML 2.0 identity provider for enterprise clients",
    type: "custom",
    status: "active",
    userCount: 1250,
    isDefault: false,
    endpoint: "https://saml.company.com/sso",
    createdAt: "2024-08-10T09:30:00Z",
    createdBy: "enterprise-team",
    updatedAt: "2024-10-19T14:20:00Z",
    lastSync: "2024-10-26T01:30:00Z"
  }
]
