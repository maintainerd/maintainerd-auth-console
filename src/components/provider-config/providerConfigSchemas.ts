/**
 * Provider Configuration Schemas
 *
 * Declarative, per-provider field maps. Shared connection fields live as
 * top-level identity provider columns on the backend (`issuer`,
 * `provider_client_id`, `provider_client_secret`, `allow_jit_provisioning`, and `email_domains`). The schemas
 * below only describe provider-specific config JSON keys such as scopes,
 * endpoint overrides, directory IDs, and social-provider options.
 *
 * Note: this is distinct from the Clients resource, which models the apps that
 * authenticate *against* Maintainerd and whose credentials Maintainerd issues.
 */

import type { ProviderOption } from "@/services/api/identity-providers/types"

export type ProviderFieldType = "text" | "password" | "url" | "list" | "switch"

/** Backend `provider_type` discriminator. */
export type ProviderKind = "system" | "social" | "enterprise"
export type ProviderConnectionFieldKey =
  | "issuer"
  | "provider_client_id"
  | "provider_client_secret"
  | "allow_jit_provisioning"
  | "email_domains"

export interface ProviderConfigField {
  /** Key written into the provider `config` JSON. */
  key: string
  label: string
  type: ProviderFieldType
  required?: boolean
  placeholder?: string
  description?: string
}

export interface ProviderConfigGroup {
  /** Subsection heading, e.g. "Connection", "User Pool", or "Directory". */
  title: string
  description?: string
  fields: ProviderConfigField[]
}

export interface ProviderConfigSchema {
  /** Backend `provider_type` value this provider is created with. */
  kind: ProviderKind
  /** Explanatory line shown under the section header. */
  summary: string
  /** Optional external setup documentation. */
  docsLabel?: string
  docsUrl?: string
  /** Grouped, well-known fields. Empty for providers with no provider-level config. */
  groups: ProviderConfigGroup[]
}

export interface ProviderConnectionField {
  key: ProviderConnectionFieldKey
  label: string
  type: ProviderFieldType
  required?: boolean
  placeholder?: string
  description?: string
}

export interface ProviderConnectionSchema {
  summary: string
  fields: ProviderConnectionField[]
}

/** Human-friendly provider names, shared across forms, tables, and detail pages. */
export const PROVIDER_LABELS: Record<string, string> = {
  maintainerd: "Maintainerd",
  saml: "SAML 2.0",
  cognito: "AWS Cognito",
  auth0: "Auth0",
  microsoft: "Microsoft Entra ID",
  google: "Google",
  github: "GitHub",
  gitlab: "GitLab",
  facebook: "Facebook",
  apple: "Apple",
  linkedin: "LinkedIn",
  twitter: "X (Twitter)",
}

/** Display order for the provider dropdown — identity providers first, then social. */
export const PROVIDER_ORDER: ProviderOption[] = [
  "maintainerd",
  "saml",
  "cognito",
  "auth0",
  "microsoft",
  "google",
  "github",
  "gitlab",
  "facebook",
  "apple",
  "linkedin",
  "twitter",
]

const DEFAULT_ISSUERS: Partial<Record<ProviderOption, string>> = {
  cognito: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_aB12cD34",
  auth0: "https://your-tenant.us.auth0.com/",
  microsoft: "https://login.microsoftonline.com/common/v2.0",
  google: "https://accounts.google.com",
  github: "https://github.com",
  gitlab: "https://gitlab.com",
  facebook: "https://www.facebook.com",
  apple: "https://appleid.apple.com",
  linkedin: "https://www.linkedin.com",
  twitter: "https://twitter.com",
}

const CLIENT_ID_LABELS: Partial<Record<ProviderOption, string>> = {
  cognito: "App Client ID",
  auth0: "Application Client ID",
  apple: "Services ID",
}

const CLIENT_SECRET_LABELS: Partial<Record<ProviderOption, string>> = {
  cognito: "App Client Secret",
  apple: "Client Secret JWT",
}

/** Provider-specific labels for the backend-owned connection columns. */
export function getProviderConnectionSchema(provider: string): ProviderConnectionSchema | undefined {
  const option = provider as ProviderOption
  const schema = getProviderConfigSchema(option)
  if (!schema || schema.kind === "system") return undefined

  return {
    summary:
      "Connection details are stored as dedicated provider fields. Provider-specific options below are saved into config JSON.",
    fields: [
      {
        key: "issuer",
        label: option === "cognito" ? "User Pool Issuer URL" : "Issuer URL",
        type: "url",
        required: true,
        placeholder: DEFAULT_ISSUERS[option] ?? "https://provider.example.com",
        description:
          "Issuer or authority URL used by the broker to discover metadata and validate tokens.",
      },
      {
        key: "provider_client_id",
        label: CLIENT_ID_LABELS[option] ?? "OAuth Client ID",
        type: "text",
        required: true,
        placeholder: option === "cognito" ? "your-app-client-id" : "your-oauth-client-id",
        description: "OAuth application identifier issued by the external provider.",
      },
      {
        key: "provider_client_secret",
        label: CLIENT_SECRET_LABELS[option] ?? "OAuth Client Secret",
        type: "password",
        required: true,
        placeholder: "••••••••",
        description:
          "Stored encrypted by the backend. Leave blank when editing to keep the existing secret.",
      },
      {
        key: "allow_jit_provisioning",
        label: "Just-in-Time Provisioning",
        type: "switch",
        description: "Create a local user automatically on first successful broker sign-in.",
      },
      {
        key: "email_domains",
        label: "Email Domains",
        type: "list",
        placeholder: "example.com, corp.example.com",
        description: "Domains routed to this provider during home-realm discovery.",
      },
    ],
  }
}

export function getPromotedProviderFieldKeys(): string[] {
  return [
    "issuer",
    "provider_client_id",
    "provider_client_secret",
    "allow_jit_provisioning",
    "email_domains",
    // Legacy config keys from before the backend promoted provider credentials.
    "client_id",
    "client_secret",
  ]
}

function scopesGroup(defaultScopes = "openid, profile, email"): ProviderConfigGroup {
  return {
    title: "OAuth",
    description: "Optional scopes requested during sign-in.",
    fields: [
      {
        key: "scopes",
        label: "Scopes",
        type: "list",
        placeholder: defaultScopes,
        description: "Comma-separated scopes requested during sign-in.",
      },
    ],
  }
}

function endpointOverridesGroup(): ProviderConfigGroup {
  return {
    title: "Endpoint Overrides",
    description: "Optional overrides for providers that do not fully match discovery metadata.",
    fields: [
      {
        key: "authorization_endpoint",
        label: "Authorization Endpoint",
        type: "url",
        placeholder: "https://provider.example.com/oauth2/authorize",
      },
      {
        key: "token_endpoint",
        label: "Token Endpoint",
        type: "url",
        placeholder: "https://provider.example.com/oauth2/token",
      },
      {
        key: "userinfo_endpoint",
        label: "UserInfo Endpoint",
        type: "url",
        placeholder: "https://provider.example.com/oauth2/userinfo",
      },
      {
        key: "jwks_uri",
        label: "JWKS URI",
        type: "url",
        placeholder: "https://provider.example.com/.well-known/jwks.json",
      },
    ],
  }
}

function commonExternalGroups(defaultScopes?: string): ProviderConfigGroup[] {
  return [scopesGroup(defaultScopes), endpointOverridesGroup()]
}

export const PROVIDER_CONFIG_SCHEMAS: Record<ProviderOption, ProviderConfigSchema> = {
  maintainerd: {
    kind: "system",
    summary:
      "Built-in authentication managed by Maintainerd. User accounts, passwords, and sessions are handled natively — no external connection details are required.",
    groups: [],
  },

  cognito: {
    kind: "enterprise",
    summary: "Connect an Amazon Cognito User Pool. Maintainerd needs the pool's regional identifiers and OAuth credentials to validate tokens and broker sign-in.",
    docsLabel: "AWS Cognito user pool guide",
    docsUrl:
      "https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools.html",
    groups: [
      ...commonExternalGroups(),
      {
        title: "User Pool",
        description: "Identifiers for the Cognito User Pool that issues tokens.",
        fields: [
          {
            key: "region",
            label: "AWS Region",
            type: "text",
            required: true,
            placeholder: "us-east-1",
            description: "Region where the user pool is hosted.",
          },
          {
            key: "user_pool_id",
            label: "User Pool ID",
            type: "text",
            required: true,
            placeholder: "us-east-1_aB12cD34",
            description: "The Cognito User Pool identifier.",
          },
          {
            key: "domain",
            label: "Hosted UI Domain",
            type: "url",
            placeholder: "https://your-app.auth.us-east-1.amazoncognito.com",
            description: "Cognito hosted UI / OAuth domain. Optional if you don't use the hosted UI.",
          },
        ],
      },
    ],
  },

  auth0: {
    kind: "enterprise",
    summary: "Connect an Auth0 tenant. Provide the tenant connection details and application credentials.",
    docsLabel: "Auth0 application setup",
    docsUrl: "https://auth0.com/docs/get-started/applications",
    groups: [
      ...commonExternalGroups(),
      {
        title: "Tenant",
        fields: [
          {
            key: "domain",
            label: "Domain",
            type: "text",
            required: true,
            placeholder: "your-tenant.us.auth0.com",
            description: "Your Auth0 tenant domain, without the https:// prefix.",
          },
          {
            key: "audience",
            label: "API Audience",
            type: "url",
            placeholder: "https://api.example.com",
            description: "Identifier of the API this provider issues access tokens for. Optional.",
          },
          {
            key: "connection",
            label: "Connection",
            type: "text",
            placeholder: "Username-Password-Authentication",
            description: "Restrict logins to a specific Auth0 connection. Optional.",
          },
        ],
      },
    ],
  },

  microsoft: {
    kind: "enterprise",
    summary: "Sign in with Microsoft Entra ID (Azure AD). Provide the directory and application credentials.",
    docsLabel: "Microsoft Entra ID platform",
    docsUrl: "https://learn.microsoft.com/en-us/entra/identity-platform/",
    groups: [
      ...commonExternalGroups(),
      {
        title: "Directory",
        fields: [
          {
            key: "tenant",
            label: "Tenant",
            type: "text",
            required: true,
            placeholder: "common",
            description: "Entra tenant ID, or one of: common, organizations, consumers.",
          },
        ],
      },
    ],
  },

  google: {
    kind: "social",
    summary: "Sign in with Google. Maintainerd uses Google's published OIDC metadata with your OAuth credentials.",
    docsLabel: "Google OAuth 2.0",
    docsUrl: "https://developers.google.com/identity/protocols/oauth2",
    groups: [
      ...commonExternalGroups(),
      {
        title: "Options",
        fields: [
          {
            key: "hosted_domain",
            label: "Hosted Domain (hd)",
            type: "text",
            placeholder: "example.com",
            description: "Restrict sign-in to a Google Workspace domain. Optional.",
          },
        ],
      },
    ],
  },

  github: {
    kind: "social",
    summary: "Sign in with GitHub using your OAuth App credentials.",
    docsLabel: "GitHub OAuth Apps",
    docsUrl:
      "https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app",
    groups: [
      ...commonExternalGroups("read:user, user:email"),
      {
        title: "Options",
        fields: [
          {
            key: "enterprise_base_url",
            label: "Enterprise Base URL",
            type: "url",
            placeholder: "https://github.your-company.com",
            description: "Only for GitHub Enterprise Server. Leave blank for github.com.",
          },
        ],
      },
    ],
  },

  gitlab: {
    kind: "social",
    summary: "Sign in with GitLab using your OAuth application credentials.",
    docsLabel: "GitLab OAuth provider",
    docsUrl: "https://docs.gitlab.com/ee/integration/oauth_provider.html",
    groups: [
      ...commonExternalGroups("openid, profile, email"),
      {
        title: "Options",
        fields: [
          {
            key: "base_url",
            label: "Base URL",
            type: "url",
            placeholder: "https://gitlab.example.com",
            description: "Base URL for self-managed GitLab. Leave blank for gitlab.com.",
          },
        ],
      },
    ],
  },

  facebook: {
    kind: "social",
    summary: "Sign in with Facebook Login using your app credentials.",
    docsLabel: "Facebook Login setup",
    docsUrl: "https://developers.facebook.com/docs/facebook-login/",
    groups: [
      ...commonExternalGroups("public_profile, email"),
      {
        title: "Options",
        fields: [
          {
            key: "api_version",
            label: "Graph API Version",
            type: "text",
            placeholder: "v19.0",
            description: "Graph API version used for token and profile calls. Optional.",
          },
        ],
      },
    ],
  },

  apple: {
    kind: "social",
    summary: "Sign in with Apple. Provide your Services ID as the client ID and the generated client secret (signed with your private key).",
    docsLabel: "Sign in with Apple",
    docsUrl: "https://developer.apple.com/sign-in-with-apple/",
    groups: [
      ...commonExternalGroups("name, email"),
      {
        title: "Developer",
        fields: [
          {
            key: "team_id",
            label: "Team ID",
            type: "text",
            required: true,
            placeholder: "ABCDE12345",
            description: "Your Apple Developer Team ID.",
          },
          {
            key: "key_id",
            label: "Key ID",
            type: "text",
            placeholder: "XYZ1234567",
            description: "Identifier of the private key used to sign the client secret. Optional.",
          },
        ],
      },
    ],
  },

  linkedin: {
    kind: "social",
    summary: "Sign in with LinkedIn using your OAuth application credentials.",
    docsLabel: "Sign in with LinkedIn",
    docsUrl:
      "https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/sign-in-with-linkedin",
    groups: commonExternalGroups("openid, profile, email"),
  },

  twitter: {
    kind: "social",
    summary: "Sign in with X (Twitter) using your OAuth 2.0 application credentials.",
    docsLabel: "X OAuth 2.0",
    docsUrl: "https://developer.twitter.com/en/docs/authentication/oauth-2-0",
    groups: [
      ...commonExternalGroups("tweet.read, users.read, offline.access"),
      {
        title: "Options",
        fields: [
          {
            key: "api_version",
            label: "API Version",
            type: "text",
            placeholder: "2",
            description: "X API version. Optional.",
          },
        ],
      },
    ],
  },

  saml: {
    kind: "enterprise",
    summary: "Connect a SAML 2.0 identity provider. Maintainerd acts as the service provider and validates assertions signed by your enterprise IdP.",
    groups: [
      {
        title: "Identity Provider",
        description: "Endpoints and credentials provided by your SAML IdP.",
        fields: [
          {
            key: "sso_url",
            label: "SSO URL",
            type: "url",
            required: true,
            placeholder: "https://idp.example.com/saml2/sso",
            description: "Single sign-on URL where Maintainerd sends authentication requests.",
          },
          {
            key: "entity_id",
            label: "IdP Entity ID",
            type: "text",
            placeholder: "https://idp.example.com/saml2/metadata",
            description: "Unique identifier for the identity provider (from its metadata).",
          },
          {
            key: "certificate",
            label: "X.509 Certificate",
            type: "text",
            required: true,
            placeholder: "-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----",
            description: "Public certificate used to verify SAML assertion signatures.",
          },
        ],
      },
      {
        title: "Options",
        description: "Attribute mapping and assertion handling.",
        fields: [
          {
            key: "name_id_format",
            label: "NameID Format",
            type: "text",
            placeholder: "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress",
            description: "NameID format requested in authentication requests. Optional.",
          },
          {
            key: "email_attribute",
            label: "Email Attribute",
            type: "text",
            placeholder: "email",
            description: "SAML attribute name that carries the user's email. Defaults to NameID.",
          },
        ],
      },
    ],
  },
}

/** Select options for the provider dropdown, in display order. */
export const PROVIDER_SELECT_OPTIONS = PROVIDER_ORDER.map((value) => ({
  value,
  label: PROVIDER_LABELS[value] ?? value,
}))

/** Resolve the config schema for a provider, if one is defined. */
export function getProviderConfigSchema(provider: string): ProviderConfigSchema | undefined {
  return PROVIDER_CONFIG_SCHEMAS[provider as ProviderOption]
}

/** Flat list of every well-known config field for a provider. */
export function getProviderFields(provider: string): ProviderConfigField[] {
  const schema = getProviderConfigSchema(provider)
  if (!schema) return []
  return schema.groups.flatMap((group) => group.fields)
}

/** Flat list of every well-known config key for a provider. */
export function getProviderFieldKeys(provider: string): string[] {
  return getProviderFields(provider).map((field) => field.key)
}

/** The backend `provider_type` a given provider should be created with. */
export function getProviderKind(provider: string): ProviderKind {
  return getProviderConfigSchema(provider)?.kind ?? "social"
}
