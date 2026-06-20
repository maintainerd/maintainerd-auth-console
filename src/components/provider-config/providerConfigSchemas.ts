/**
 * Provider Configuration Schemas
 *
 * Declarative, per-provider field maps. Each identity/social provider stores its
 * connection details in a single free-form `config` JSON blob on the backend.
 * These schemas describe the well-known keys a given provider needs so the form
 * can render a tailored, labelled section for them. Any keys the operator adds
 * beyond this list are surfaced as "Additional configuration" and merged into
 * the same JSON on save.
 *
 * Connection credentials: external providers (Cognito, Auth0, Google, …) include
 * a "Connection" group with the OAuth/OIDC `client_id` and `client_secret` that
 * Maintainerd uses to authenticate *as a relying party* with that provider. The
 * federation runtime (internal/idp) reads these from the provider config; the
 * secret is write-only — stored encrypted at rest and never returned to the form
 * (leave it blank on edit to keep the existing value). The built-in `maintainerd`
 * provider has no external connection and therefore no credentials.
 *
 * Note: this is distinct from the Clients resource, which models the apps that
 * authenticate *against* Maintainerd and whose credentials Maintainerd issues.
 */

import type { ProviderOption } from "@/services/api/identity-providers/types"

export type ProviderFieldType = "text" | "password" | "url" | "list" | "switch"

/** Backend `provider_type` discriminator. */
export type ProviderKind = "identity" | "social"

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

/** Human-friendly provider names, shared across forms, tables, and detail pages. */
export const PROVIDER_LABELS: Record<string, string> = {
  maintainerd: "Maintainerd",
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

/**
 * Build the shared "Connection" credentials group. Every external provider needs
 * the OAuth client_id/client_secret Maintainerd authenticates with; `federation`
 * adds the home-realm and UserInfo overrides relevant to full OIDC providers.
 */
function connectionGroup(opts: { federation?: boolean } = {}): ProviderConfigGroup {
  const fields: ProviderConfigField[] = [
    {
      key: "client_id",
      label: "Client ID",
      type: "text",
      required: true,
      placeholder: "your-app-client-id",
      description: "OAuth client ID issued by the provider for this application.",
    },
    {
      key: "client_secret",
      label: "Client Secret",
      type: "password",
      required: true,
      placeholder: "••••••••",
      description:
        "OAuth client secret issued by the provider. Stored encrypted — leave blank to keep the existing secret.",
    },
    {
      key: "scopes",
      label: "Scopes",
      type: "list",
      placeholder: "openid, profile, email",
      description: "Comma-separated scopes requested during sign-in.",
    },
    {
      key: "allow_jit_provisioning",
      label: "Just-in-Time Provisioning",
      type: "switch",
      description: "Create a local user automatically on first successful sign-in.",
    },
  ]

  if (opts.federation) {
    fields.push(
      {
        key: "email_domains",
        label: "Email Domains",
        type: "list",
        placeholder: "example.com, corp.example.com",
        description: "Email domains routed to this provider for home-realm discovery. Optional.",
      },
      {
        key: "userinfo_endpoint",
        label: "UserInfo Endpoint",
        type: "url",
        placeholder: "https://provider.example.com/userinfo",
        description: "Override the OIDC UserInfo endpoint. Optional; derived from discovery when blank.",
      },
    )
  }

  return {
    title: "Connection",
    description:
      "OAuth/OIDC application credentials Maintainerd uses to authenticate with this provider.",
    fields,
  }
}

export const PROVIDER_CONFIG_SCHEMAS: Record<ProviderOption, ProviderConfigSchema> = {
  maintainerd: {
    kind: "identity",
    summary:
      "Built-in authentication managed by Maintainerd. User accounts, passwords, and sessions are handled natively — no external connection details are required.",
    groups: [],
  },

  cognito: {
    kind: "identity",
    summary: "Connect an Amazon Cognito User Pool. Maintainerd needs the pool's regional identifiers and OAuth credentials to validate tokens and broker sign-in.",
    docsLabel: "AWS Cognito user pool guide",
    docsUrl:
      "https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools.html",
    groups: [
      connectionGroup({ federation: true }),
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
          {
            key: "issuer",
            label: "Issuer URL",
            type: "url",
            placeholder: "https://cognito-idp.us-east-1.amazonaws.com/{pool-id}",
            description: "OIDC issuer URL. Leave blank to derive it from the region and pool ID.",
          },
        ],
      },
    ],
  },

  auth0: {
    kind: "identity",
    summary: "Connect an Auth0 tenant. Provide the tenant connection details and application credentials.",
    docsLabel: "Auth0 application setup",
    docsUrl: "https://auth0.com/docs/get-started/applications",
    groups: [
      connectionGroup({ federation: true }),
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
            key: "issuer",
            label: "Issuer URL",
            type: "url",
            placeholder: "https://your-tenant.us.auth0.com/",
            description: "OIDC issuer URL. Optional; defaults to the tenant domain.",
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
    kind: "identity",
    summary: "Sign in with Microsoft Entra ID (Azure AD). Provide the directory and application credentials.",
    docsLabel: "Microsoft Entra ID platform",
    docsUrl: "https://learn.microsoft.com/en-us/entra/identity-platform/",
    groups: [
      connectionGroup({ federation: true }),
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
          {
            key: "issuer",
            label: "Issuer URL",
            type: "url",
            placeholder: "https://login.microsoftonline.com/{tenant}/v2.0",
            description: "OIDC issuer URL. Optional; derived from the tenant.",
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
      connectionGroup(),
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
      connectionGroup(),
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
      connectionGroup(),
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
      connectionGroup(),
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
      connectionGroup(),
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
    groups: [connectionGroup()],
  },

  twitter: {
    kind: "social",
    summary: "Sign in with X (Twitter) using your OAuth 2.0 application credentials.",
    docsLabel: "X OAuth 2.0",
    docsUrl: "https://developer.twitter.com/en/docs/authentication/oauth-2-0",
    groups: [
      connectionGroup(),
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
