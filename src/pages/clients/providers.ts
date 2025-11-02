import { MOCK_IDENTITY_PROVIDERS } from "../identity-providers/constants"
import { MOCK_SOCIAL_PROVIDERS } from "../social-providers/constants"

// Combined provider type for client form
export type Provider = {
  id: string
  name: string
  displayName: string
  type: string
  status: string
  isDefault?: boolean
  category: "identity" | "social"
}

// Combine identity providers and social providers for client form
export const AVAILABLE_PROVIDERS: Provider[] = [
  // Identity Providers
  ...MOCK_IDENTITY_PROVIDERS.map(provider => ({
    id: provider.id,
    name: provider.name,
    displayName: provider.displayName,
    type: provider.type,
    status: provider.status,
    isDefault: provider.isDefault,
    category: "identity" as const
  })),
  // Social Providers
  ...MOCK_SOCIAL_PROVIDERS.map(provider => ({
    id: provider.id,
    name: provider.name,
    displayName: provider.displayName,
    type: provider.type,
    status: provider.status,
    isDefault: false,
    category: "social" as const
  }))
].filter(provider => provider.status === "active") // Only show active providers

// Common field mappings for different provider types
export const COMMON_FIELD_MAPPINGS = {
  auth0: [
    { fieldType: "standard", localField: "email", externalField: "email", required: true, category: "user" },
    { fieldType: "standard", localField: "username", externalField: "nickname", required: true, category: "user" },
    { fieldType: "standard", localField: "firstName", externalField: "given_name", required: false, category: "profile" },
    { fieldType: "standard", localField: "lastName", externalField: "family_name", required: false, category: "profile" },
    { fieldType: "standard", localField: "avatar", externalField: "picture", required: false, category: "profile" }
  ],
  google: [
    { fieldType: "standard", localField: "email", externalField: "email", required: true, category: "user" },
    { fieldType: "standard", localField: "username", externalField: "email", required: true, transform: "lowercase", category: "user" },
    { fieldType: "standard", localField: "firstName", externalField: "given_name", required: false, category: "profile" },
    { fieldType: "standard", localField: "lastName", externalField: "family_name", required: false, category: "profile" },
    { fieldType: "standard", localField: "avatar", externalField: "picture", required: false, category: "profile" },
    { fieldType: "standard", localField: "locale", externalField: "locale", required: false, category: "profile" }
  ],
  facebook: [
    { localField: "email", externalField: "email", required: true },
    { localField: "username", externalField: "email", required: true },
    { localField: "firstName", externalField: "first_name", required: false },
    { localField: "lastName", externalField: "last_name", required: false },
    { localField: "avatar", externalField: "picture.data.url", required: false }
  ],
  github: [
    { localField: "email", externalField: "email", required: true },
    { localField: "username", externalField: "login", required: true },
    { localField: "firstName", externalField: "name", required: false },
    { localField: "avatar", externalField: "avatar_url", required: false }
  ],
  linkedin: [
    { localField: "email", externalField: "emailAddress", required: true },
    { localField: "firstName", externalField: "localizedFirstName", required: false },
    { localField: "lastName", externalField: "localizedLastName", required: false },
    { localField: "avatar", externalField: "profilePicture", required: false }
  ],
  microsoft: [
    { localField: "email", externalField: "mail", required: true },
    { localField: "username", externalField: "userPrincipalName", required: true },
    { localField: "firstName", externalField: "givenName", required: false },
    { localField: "lastName", externalField: "surname", required: false }
  ],
  azure_ad: [
    { fieldType: "standard", localField: "email", externalField: "mail", required: true, category: "user" },
    { fieldType: "standard", localField: "username", externalField: "userPrincipalName", required: true, category: "user" },
    { fieldType: "standard", localField: "firstName", externalField: "givenName", required: false, category: "profile" },
    { fieldType: "standard", localField: "lastName", externalField: "surname", required: false, category: "profile" },
    { fieldType: "custom", customFieldName: "department", externalField: "department", required: false, category: "custom" },
    { fieldType: "custom", customFieldName: "jobTitle", externalField: "jobTitle", required: false, category: "custom" }
  ],
  okta: [
    { localField: "email", externalField: "email", required: true },
    { localField: "username", externalField: "preferred_username", required: true },
    { localField: "firstName", externalField: "given_name", required: false },
    { localField: "lastName", externalField: "family_name", required: false }
  ],
  apple: [
    { localField: "email", externalField: "email", required: true },
    { localField: "firstName", externalField: "name.firstName", required: false },
    { localField: "lastName", externalField: "name.lastName", required: false }
  ],
  cognito: [
    { localField: "email", externalField: "email", required: true },
    { localField: "username", externalField: "cognito:username", required: true },
    { localField: "firstName", externalField: "given_name", required: false },
    { localField: "lastName", externalField: "family_name", required: false }
  ]
}

// Standard fields that map to user and profile tables
export const STANDARD_FIELDS = [
  // User Fields (mapped directly to user table)
  { value: "email", label: "Email", required: true, category: "user", description: "User's email address" },
  { value: "username", label: "Username", required: true, category: "user", description: "Unique username" },
  { value: "phone", label: "Phone Number", required: false, category: "user", description: "User's phone number" },

  // Profile Fields (mapped to user profile table)
  { value: "firstName", label: "First Name", required: false, category: "profile", description: "User's first name" },
  { value: "lastName", label: "Last Name", required: false, category: "profile", description: "User's last name" },
  { value: "avatar", label: "Avatar URL", required: false, category: "profile", description: "Profile picture URL" },
  { value: "locale", label: "Locale", required: false, category: "profile", description: "User's locale/language" },
  { value: "timezone", label: "Timezone", required: false, category: "profile", description: "User's timezone" }
]

// Field type options
export const FIELD_TYPE_OPTIONS = [
  { value: "standard", label: "Standard Field", description: "Maps to user or profile table" },
  { value: "custom", label: "Custom Field", description: "Stored in metadata JSONB field" }
]

// Available transformation options
export const TRANSFORM_OPTIONS = [
  { value: "none", label: "No transformation" },
  { value: "lowercase", label: "Convert to lowercase" },
  { value: "uppercase", label: "Convert to uppercase" },
  { value: "trim", label: "Remove whitespace" },
  { value: "email_domain", label: "Extract email domain" }
]
