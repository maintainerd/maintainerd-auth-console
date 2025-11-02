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
    id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    name: "google-oauth",
    displayName: "Google OAuth",
    description: "Google OAuth 2.0 for Gmail and Google Workspace users",
    identifier: "A1b2C3d4E5f6",
    type: "google",
    status: "active",
    userCount: 12450,
    clientId: "123456789-abcdefghijklmnop.apps.googleusercontent.com",
    clientSecret: "***hidden***",
    scopes: ["openid", "profile", "email"],
    endpoint: "https://accounts.google.com/oauth/authorize",
    metadata: {
      project_id: "company-auth-project",
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token"
    },
    createdAt: "2024-01-15T10:30:00Z",
    createdBy: "admin",
    updatedAt: "2024-10-25T14:20:00Z",
    lastSync: "2024-10-26T08:00:00Z"
  },
  {
    id: "b2c3d4e5-f6g7-8901-bcde-f23456789012",
    name: "facebook-login",
    displayName: "Facebook Login",
    description: "Facebook Login for social authentication and user engagement",
    identifier: "G7h8I9j0K1l2",
    type: "facebook",
    status: "active",
    userCount: 8920,
    clientId: "1234567890123456",
    clientSecret: "***hidden***",
    scopes: ["public_profile", "email"],
    endpoint: "https://www.facebook.com/v18.0/dialog/oauth",
    metadata: {
      app_id: "1234567890123456",
      app_secret: "***hidden***",
      graph_api_version: "v18.0"
    },
    createdAt: "2024-02-01T09:15:00Z",
    createdBy: "admin",
    updatedAt: "2024-10-24T16:45:00Z",
    lastSync: "2024-10-26T07:30:00Z"
  },
  {
    id: "c3d4e5f6-g7h8-9012-cdef-345678901234",
    name: "github-oauth",
    displayName: "GitHub OAuth",
    description: "GitHub OAuth for developer authentication and repository access",
    identifier: "M3n4O5p6Q7r8",
    type: "github",
    status: "active",
    userCount: 3240,
    clientId: "Iv1.a1b2c3d4e5f6g7h8",
    clientSecret: "***hidden***",
    scopes: ["user:email", "read:user"],
    endpoint: "https://github.com/login/oauth/authorize",
    metadata: {
      access_token_url: "https://github.com/login/oauth/access_token",
      user_api_url: "https://api.github.com/user"
    },
    createdAt: "2024-01-20T11:45:00Z",
    createdBy: "dev-team",
    updatedAt: "2024-10-23T12:30:00Z",
    lastSync: "2024-10-26T06:45:00Z"
  },
  {
    id: "d4e5f6g7-h8i9-0123-defg-456789012345",
    name: "linkedin-oauth",
    displayName: "LinkedIn OAuth",
    description: "LinkedIn OAuth for professional networking and B2B authentication",
    identifier: "S9t0U1v2W3x4",
    type: "linkedin",
    status: "active",
    userCount: 1850,
    clientId: "78abcdefghijklmn",
    clientSecret: "***hidden***",
    scopes: ["r_liteprofile", "r_emailaddress"],
    endpoint: "https://www.linkedin.com/oauth/v2/authorization",
    metadata: {
      access_token_url: "https://www.linkedin.com/oauth/v2/accessToken",
      profile_api_url: "https://api.linkedin.com/v2/people/~"
    },
    createdAt: "2024-03-10T13:20:00Z",
    createdBy: "marketing",
    updatedAt: "2024-10-22T15:10:00Z",
    lastSync: "2024-10-26T05:15:00Z"
  },
  {
    id: "e5f6g7h8-i9j0-1234-efgh-567890123456",
    name: "apple-sign-in",
    displayName: "Apple Sign In",
    description: "Sign in with Apple for iOS and macOS users",
    identifier: "Y5z6A7b8C9d0",
    type: "apple",
    status: "active",
    userCount: 2680,
    clientId: "com.company.app.signin",
    clientSecret: "***hidden***",
    scopes: ["name", "email"],
    endpoint: "https://appleid.apple.com/auth/authorize",
    metadata: {
      team_id: "ABC123DEF4",
      key_id: "XYZ789ABC1",
      private_key: "***hidden***"
    },
    createdAt: "2024-02-15T14:30:00Z",
    createdBy: "mobile-team",
    updatedAt: "2024-10-21T10:25:00Z",
    lastSync: "2024-10-26T04:30:00Z"
  },
  {
    id: "f6g7h8i9-j0k1-2345-fghi-678901234567",
    name: "microsoft-oauth",
    displayName: "Microsoft OAuth",
    description: "Microsoft OAuth for Office 365 and Azure AD users",
    identifier: "E1f2G3h4I5j6",
    type: "microsoft",
    status: "active",
    userCount: 4320,
    clientId: "12345678-1234-1234-1234-123456789012",
    clientSecret: "***hidden***",
    scopes: ["openid", "profile", "email", "User.Read"],
    endpoint: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
    metadata: {
      tenant_id: "common",
      authority: "https://login.microsoftonline.com/common",
      graph_api_url: "https://graph.microsoft.com/v1.0"
    },
    createdAt: "2024-01-25T08:45:00Z",
    createdBy: "enterprise-team",
    updatedAt: "2024-10-20T13:40:00Z",
    lastSync: "2024-10-26T03:20:00Z"
  },
  {
    id: "g7h8i9j0-k1l2-3456-ghij-789012345678",
    name: "discord-oauth",
    displayName: "Discord OAuth",
    description: "Discord OAuth for gaming community and developer authentication",
    identifier: "K7l8M9n0O1p2",
    type: "discord",
    status: "inactive",
    userCount: 890,
    clientId: "123456789012345678",
    clientSecret: "***hidden***",
    scopes: ["identify", "email"],
    endpoint: "https://discord.com/api/oauth2/authorize",
    metadata: {
      api_endpoint: "https://discord.com/api/v10",
      bot_token: "***hidden***"
    },
    createdAt: "2024-04-05T16:20:00Z",
    createdBy: "community-team",
    updatedAt: "2024-09-15T11:30:00Z",
    lastSync: "2024-09-15T11:30:00Z"
  },
  {
    id: "h8i9j0k1-l2m3-4567-hijk-890123456789",
    name: "twitter-oauth",
    displayName: "Twitter OAuth",
    description: "Twitter OAuth for social media integration and user engagement",
    identifier: "Q3r4S5t6U7v8",
    type: "twitter",
    status: "configuring",
    userCount: 0,
    clientId: "abcdefghijklmnopqrstuvwxyz",
    clientSecret: "***hidden***",
    scopes: ["tweet.read", "users.read"],
    endpoint: "https://twitter.com/i/oauth2/authorize",
    metadata: {
      api_version: "2.0",
      bearer_token: "***hidden***"
    },
    createdAt: "2024-10-01T12:00:00Z",
    createdBy: "social-team",
    updatedAt: "2024-10-25T09:15:00Z",
    lastSync: null
  }
]
