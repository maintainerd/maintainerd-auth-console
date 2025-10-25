import type { SocialProvider } from "./components/SocialProviderColumns"

// Available status options
export const SOCIAL_PROVIDER_STATUSES = [
  "active",
  "inactive", 
  "configuring"
] as const

// Available provider types
export const SOCIAL_PROVIDER_TYPES = [
  "google",
  "facebook", 
  "github",
  "twitter",
  "linkedin",
  "apple",
  "microsoft",
  "discord",
  "custom"
] as const

export const MOCK_SOCIAL_PROVIDERS: SocialProvider[] = [
  {
    id: "g8k2m5n9p1q4",
    name: "Google OAuth",
    description: "Google OAuth 2.0 for Gmail and Google Workspace users",
    type: "google",
    status: "active",
    userCount: 12450,
    clientId: "123456789-abcdefghijklmnop.apps.googleusercontent.com",
    scopes: ["openid", "profile", "email"],
    endpoint: "https://accounts.google.com/oauth/authorize",
    createdAt: "2024-01-15T10:30:00Z",
    createdBy: "admin",
    updatedAt: "2024-10-25T14:20:00Z",
    lastSync: "2024-10-26T08:00:00Z"
  },
  {
    id: "f3h7j2k8l5m9",
    name: "Facebook Login",
    description: "Facebook Login for social authentication and user engagement",
    type: "facebook",
    status: "active", 
    userCount: 8920,
    clientId: "1234567890123456",
    scopes: ["public_profile", "email"],
    endpoint: "https://www.facebook.com/v18.0/dialog/oauth",
    createdAt: "2024-02-01T09:15:00Z",
    createdBy: "admin",
    updatedAt: "2024-10-24T16:45:00Z",
    lastSync: "2024-10-26T07:30:00Z"
  },
  {
    id: "t5w8x1y4z7a2",
    name: "GitHub OAuth",
    description: "GitHub OAuth for developer authentication and repository access",
    type: "github",
    status: "active",
    userCount: 3240,
    clientId: "Iv1.a1b2c3d4e5f6g7h8",
    scopes: ["user:email", "read:user"],
    endpoint: "https://github.com/login/oauth/authorize",
    createdAt: "2024-01-20T11:45:00Z",
    createdBy: "dev-team",
    updatedAt: "2024-10-23T12:30:00Z",
    lastSync: "2024-10-26T06:45:00Z"
  },
  {
    id: "l6n9p2q5r8s1",
    name: "LinkedIn OAuth",
    description: "LinkedIn OAuth for professional networking and B2B authentication",
    type: "linkedin",
    status: "active",
    userCount: 1850,
    clientId: "78abcdefghijklmn",
    scopes: ["r_liteprofile", "r_emailaddress"],
    endpoint: "https://www.linkedin.com/oauth/v2/authorization",
    createdAt: "2024-03-10T13:20:00Z",
    createdBy: "marketing",
    updatedAt: "2024-10-22T15:10:00Z",
    lastSync: "2024-10-26T05:15:00Z"
  },
  {
    id: "a4d7g0j3m6p9",
    name: "Apple Sign In",
    description: "Sign in with Apple for iOS and macOS users",
    type: "apple",
    status: "active",
    userCount: 2680,
    clientId: "com.company.app.signin",
    scopes: ["name", "email"],
    endpoint: "https://appleid.apple.com/auth/authorize",
    createdAt: "2024-02-15T14:30:00Z",
    createdBy: "mobile-team",
    updatedAt: "2024-10-21T10:25:00Z",
    lastSync: "2024-10-26T04:30:00Z"
  },
  {
    id: "m8p1s4v7y0b3",
    name: "Microsoft OAuth",
    description: "Microsoft OAuth for Office 365 and Azure AD users",
    type: "microsoft",
    status: "active",
    userCount: 4320,
    clientId: "12345678-1234-1234-1234-123456789012",
    scopes: ["openid", "profile", "email", "User.Read"],
    endpoint: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
    createdAt: "2024-01-25T08:45:00Z",
    createdBy: "enterprise-team",
    updatedAt: "2024-10-20T13:40:00Z",
    lastSync: "2024-10-26T03:20:00Z"
  },
  {
    id: "d2g5j8m1p4s7",
    name: "Discord OAuth",
    description: "Discord OAuth for gaming community and developer authentication",
    type: "discord",
    status: "inactive",
    userCount: 890,
    clientId: "123456789012345678",
    scopes: ["identify", "email"],
    endpoint: "https://discord.com/api/oauth2/authorize",
    createdAt: "2024-04-05T16:20:00Z",
    createdBy: "community-team",
    updatedAt: "2024-09-15T11:30:00Z",
    lastSync: "2024-09-15T11:30:00Z"
  },
  {
    id: "x9z2c5f8i1l4",
    name: "Twitter OAuth",
    description: "Twitter OAuth for social media integration and user engagement",
    type: "twitter",
    status: "configuring",
    userCount: 0,
    clientId: "abcdefghijklmnopqrstuvwxyz",
    scopes: ["tweet.read", "users.read"],
    endpoint: "https://twitter.com/i/oauth2/authorize",
    createdAt: "2024-10-01T12:00:00Z",
    createdBy: "social-team",
    updatedAt: "2024-10-25T09:15:00Z",
    lastSync: null
  }
]
