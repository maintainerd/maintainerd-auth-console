import { useEffect, useRef, useState } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { useForm, Controller, type Resolver } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { ArrowLeft, Plus, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { DetailsContainer } from "@/components/container"
import { FormPageHeader } from "@/components/header"
import {
  FormInputField,
  FormCheckboxField,
  FormSelectField,
  FormSwitchField,
  FormSubmitButton,
  type SelectOption
} from "@/components/form"
import { FormUrlField, MetadataFieldEditor } from "@/components/inputs"
import { ConfirmationDialog } from "@/components/dialog"
import { clientSchema, type ClientFormData } from "@/lib/validations"
import { useAppSelector } from "@/store/hooks"
import {
  useClient,
  useCreateClient,
  useUpdateClient,
  useClientConfig,
  useCreateClientUri,
  useUpdateClientUri
} from "@/hooks/useClients"
import { useToast } from "@/hooks/useToast"
import { useBrandings } from "@/hooks/useBranding"
import { useMetadataFields } from "@/hooks/useMetadataFields"
import { useUnsavedChangesGuard } from "@/hooks/useUnsavedChangesGuard"
import type {
  CreateClientRequest,
  UpdateClientRequest,
  ClientType,
  ClientStatus,
  ClientUriType
} from "@/services/api/clients/types"
import {
  COMMON_CLIENT_CONFIG_KEYS,
  getClientMetadata,
  parseBooleanConfigValue,
  parseNumberConfigValue,
  parseStringArrayConfigValue,
  parseStringConfigValue,
} from "../clientConfig"
import {
  CLIENT_TYPE_OPTIONS,
  getClientTypeCapability,
  hasApplicationUris,
} from "./clientTypeConfig"
import { UriListField, type UriEntry } from "./UriListField"

const STATUS_OPTIONS: SelectOption[] = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
]

// Required authentication level (ACR) override. "inherit" is the sentinel for
// "no override" — the client follows the tenant security policy. It maps to an
// absent required_acr in the persisted config.
const REQUIRED_ACR_INHERIT = "inherit"
const REQUIRED_ACR_OPTIONS: SelectOption[] = [
  { value: REQUIRED_ACR_INHERIT, label: "Inherit tenant default" },
  { value: "1", label: "Password / single factor (ACR 1)" },
  { value: "2", label: "Require step-up — MFA (ACR 2)" },
]

// Client metadata allows provider-style snake_case keys, must not shadow the
// standard config controls, and follows the shared metadata-editor rules.
const METADATA_OPTIONS = {
  reservedKeys: COMMON_CLIENT_CONFIG_KEYS,
  reservedKeysMessage: "Move standard client configuration to its own controls",
  allowUnderscore: true,
  maxKeyLength: 50,
} as const

// Backend snake_case field keys → form field names, for routing structured
// server validation errors onto the offending inputs.
const BACKEND_FIELD_MAP: Record<string, keyof ClientFormData> = {
  name: "name",
  display_name: "displayName",
  client_type: "clientType",
  domain: "domain",
  status: "status",
}

export default function ClientAddOrUpdateForm() {
  const { clientId } = useParams<{ clientId?: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { showSuccess, showError, parseError } = useToast()
  const currentTenant = useAppSelector((state) => state.tenant.currentTenant)

  const isEditing = Boolean(clientId)

  // Honour where the user came from (e.g. the details page) so the back button,
  // Cancel, and post-submit navigation return there. Falls back to the listing.
  const navState = location.state as { from?: string; backLabel?: string } | null
  const backTo = navState?.from ?? `/clients`
  const backLabel = navState?.backLabel ?? (backTo === `/clients` ? "Back to Clients" : "Back")

  // Fetch existing client if editing
  const { data: clientData, isLoading: isFetchingClient } = useClient(clientId || '')
  const createClientMutation = useCreateClient()
  const updateClientMutation = useUpdateClient()

  // Fetch client config if editing
  const { data: clientConfigData } = useClientConfig(clientId || '')

  // URI mutations (URIs are now included in client response, no need to fetch separately)
  const createClientUriMutation = useCreateClientUri()
  const updateClientUriMutation = useUpdateClientUri()

  // Application URIs state (with IDs for tracking existing URIs)
  const [loginUri, setLoginUri] = useState<UriEntry>({ uri: "" })
  const [redirectUris, setRedirectUris] = useState<UriEntry[]>([{ uri: "" }])
  const [allowedOrigins, setAllowedOrigins] = useState<UriEntry[]>([{ uri: "" }])
  const [allowedLogoutUrls, setAllowedLogoutUrls] = useState<UriEntry[]>([{ uri: "" }])

  // Cross Origin Authentication state (with IDs for tracking existing URIs)
  const [corsEnabled, setCorsEnabled] = useState<boolean>(false)
  const [corsAllowedOrigins, setCorsAllowedOrigins] = useState<UriEntry[]>([{ uri: "" }])

  // OAuth and token configuration state
  const [grantTypes, setGrantTypes] = useState<string[]>(["authorization_code", "refresh_token"])
  const [responseTypes, setResponseTypes] = useState<string[]>(["code"])
  const [tokenEndpointAuthMethod, setTokenEndpointAuthMethod] = useState<string>("none")
  const [allowedScopes, setAllowedScopes] = useState<string>("")
  const [requireConsent, setRequireConsent] = useState<boolean>(true)
  const [pkceRequired, setPkceRequired] = useState<boolean>(true)
  const [accessTokenLifetime, setAccessTokenLifetime] = useState<number>(3600)
  const [refreshTokenLifetime, setRefreshTokenLifetime] = useState<number>(604800)
  const [allowRegistration, setAllowRegistration] = useState<boolean>(true)
  const NO_BRANDING = "__none__"
  const [brandingId, setBrandingId] = useState<string>(NO_BRANDING)
  const { data: brandings } = useBrandings()
  const brandingOptions: SelectOption[] = [
    { value: NO_BRANDING, label: "Use tenant's active branding" },
    ...(brandings ?? []).map((b) => ({
      value: b.branding_id,
      label: b.is_active ? `${b.name} (active)` : b.name,
    })),
  ]
  const [refreshTokenRotation, setRefreshTokenRotation] = useState<boolean>(false)
  const [multiResourceRefreshToken, setMultiResourceRefreshToken] = useState<boolean>(false)

  // Per-client security overrides. Empty / "inherit" means follow the tenant
  // security policy (persisted as an absent key, resolved server-side).
  const [requiredAcr, setRequiredAcr] = useState<string>(REQUIRED_ACR_INHERIT)
  const [sessionIdleTimeout, setSessionIdleTimeout] = useState<string>("")
  const [sessionAbsoluteTimeout, setSessionAbsoluteTimeout] = useState<string>("")

  // Most of this form lives outside React Hook Form (OAuth toggles, URI lists,
  // metadata, …), so RHF's isDirty alone under-reports unsaved changes. Every
  // user-facing handler below marks local dirtiness; hydration effects use the
  // raw setters so loading a client never counts as an edit.
  const [isLocalDirty, setIsLocalDirty] = useState(false)
  const markDirty = () => setIsLocalDirty(true)

  // Custom metadata via shared hook (client rules: snake_case keys allowed,
  // standard config keys reserved).
  const {
    customFields,
    metadataError,
    addCustomField,
    removeCustomField,
    updateCustomField,
    buildPayload,
    resetFields,
  } = useMetadataFields(METADATA_OPTIONS)

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setError,
    formState: { errors, isSubmitting, isDirty }
  } = useForm<ClientFormData>({
    resolver: yupResolver(clientSchema) as Resolver<ClientFormData>,
    defaultValues: {
      name: "",
      displayName: "",
      clientType: "spa",
      domain: "",
      status: "active",
    },
    mode: 'onTouched',
    reValidateMode: 'onChange',
  })

  // The selected client type drives which OAuth flows, credential model, and
  // application URIs are relevant. A single capability object replaces scattered
  // per-type conditionals throughout the form.
  const clientType = (watch("clientType") || "spa") as ClientType
  const capability = getClientTypeCapability(clientType)
  const pkceForced = capability.pkce === "required"

  // When the operator switches client type, apply that type's OAuth defaults.
  // Guarded so it never clobbers values hydrated from an existing client (edit
  // mode seeds prevTypeRef with the loaded type below).
  const prevTypeRef = useRef<ClientType>(clientType)
  useEffect(() => {
    if (prevTypeRef.current === clientType) return
    prevTypeRef.current = clientType

    const cap = getClientTypeCapability(clientType)
    setGrantTypes(cap.defaultGrantTypes)
    setResponseTypes(cap.defaultResponseTypes)
    setTokenEndpointAuthMethod(cap.defaultAuthMethod)
    setPkceRequired(cap.pkce === "required")
  }, [clientType])

  // Load existing client data if editing
  useEffect(() => {
    if (isEditing && clientData) {
      reset({
        name: clientData.name,
        displayName: clientData.display_name,
        clientType: clientData.client_type,
        domain: clientData.domain ?? "",
        status: clientData.status,
      })
      setAllowRegistration(clientData.allow_registration ?? true)
      setBrandingId(clientData.branding_id || NO_BRANDING)
      // Mark the hydrated type as current so the defaults effect doesn't
      // overwrite the loaded OAuth configuration below.
      prevTypeRef.current = clientData.client_type
    }
  }, [isEditing, clientData, reset])

  // Load URIs from client data when editing (URIs are now included in client response)
  useEffect(() => {
    if (isEditing && clientData?.uris) {
      const uris = clientData.uris

      const loginUriData = uris.find(u => u.type === 'login_uri')
      if (loginUriData) {
        setLoginUri({ uri: loginUriData.uri, id: loginUriData.uri_id })
      }

      const redirectUrisData = uris.filter(u => u.type === 'redirect_uri')
      if (redirectUrisData.length > 0) {
        setRedirectUris(redirectUrisData.map(u => ({ uri: u.uri, id: u.uri_id })))
      }

      const allowedOriginsData = uris.filter(u => u.type === 'origin_uri')
      if (allowedOriginsData.length > 0) {
        setAllowedOrigins(allowedOriginsData.map(u => ({ uri: u.uri, id: u.uri_id })))
      }

      const allowedLogoutUrlsData = uris.filter(u => u.type === 'logout_uri')
      if (allowedLogoutUrlsData.length > 0) {
        setAllowedLogoutUrls(allowedLogoutUrlsData.map(u => ({ uri: u.uri, id: u.uri_id })))
      }

      const corsAllowedOriginsData = uris.filter(u => u.type === 'cors_origin_uri')
      if (corsAllowedOriginsData.length > 0) {
        setCorsAllowedOrigins(corsAllowedOriginsData.map(u => ({ uri: u.uri, id: u.uri_id })))
      }
    }
  }, [isEditing, clientData])

  // Load config fields when editing
  useEffect(() => {
    if (isEditing && clientConfigData) {
      const config = clientConfigData

      setGrantTypes(parseStringArrayConfigValue(config.grant_types, ["authorization_code", "refresh_token"]))
      setResponseTypes(parseStringArrayConfigValue(config.response_types, ["code"]))
      setTokenEndpointAuthMethod(parseStringConfigValue(config.token_endpoint_auth_method, "none"))
      setAllowedScopes(parseStringArrayConfigValue(config.allowed_scopes).join(", "))
      setRequireConsent(parseBooleanConfigValue(config.require_consent ?? config.consent_required, true))
      setPkceRequired(parseBooleanConfigValue(config.pkce_required, false))

      if (config.cors_enabled !== undefined) {
        setCorsEnabled(parseBooleanConfigValue(config.cors_enabled))
      }

      if (config.access_token_lifetime) {
        setAccessTokenLifetime(parseNumberConfigValue(config.access_token_lifetime, 3600))
      }
      if (config.refresh_token_lifetime) {
        setRefreshTokenLifetime(parseNumberConfigValue(config.refresh_token_lifetime, 604800))
      }
      if (config.refresh_token_rotation !== undefined) {
        setRefreshTokenRotation(parseBooleanConfigValue(config.refresh_token_rotation))
      }
      if (config.multi_resource_refresh_token !== undefined) {
        setMultiResourceRefreshToken(parseBooleanConfigValue(config.multi_resource_refresh_token))
      }

      // Security overrides — absent keys fall back to the inherit sentinel / blank.
      const loadedAcr = parseStringConfigValue(config.required_acr, "")
      setRequiredAcr(loadedAcr === "1" || loadedAcr === "2" ? loadedAcr : REQUIRED_ACR_INHERIT)
      setSessionIdleTimeout(
        config.session_idle_timeout != null ? String(parseNumberConfigValue(config.session_idle_timeout, 0) || "") : ""
      )
      setSessionAbsoluteTimeout(
        config.session_absolute_timeout != null ? String(parseNumberConfigValue(config.session_absolute_timeout, 0) || "") : ""
      )

      resetFields(getClientMetadata(config))
    }
  }, [isEditing, clientConfigData, resetFields])

  const toggleConfigValue = (
    value: string,
    selectedValues: string[],
    setSelectedValues: (values: string[]) => void
  ) => {
    markDirty()
    if (selectedValues.includes(value)) {
      setSelectedValues(selectedValues.filter((item) => item !== value))
      return
    }
    setSelectedValues([...selectedValues, value])
  }

  // Generic helpers for the repeatable URI lists.
  const makeUriListHandlers = (
    items: UriEntry[],
    setItems: (items: UriEntry[]) => void
  ) => ({
    onAdd: () => {
      markDirty()
      setItems([...items, { uri: "" }])
    },
    onRemove: (index: number) => {
      markDirty()
      setItems(items.filter((_, i) => i !== index))
    },
    onChange: (index: number, value: string) => {
      markDirty()
      setItems(items.map((item, i) => (i === index ? { ...item, uri: value } : item)))
    },
  })

  const redirectUriHandlers = makeUriListHandlers(redirectUris, setRedirectUris)
  const allowedOriginHandlers = makeUriListHandlers(allowedOrigins, setAllowedOrigins)
  const allowedLogoutHandlers = makeUriListHandlers(allowedLogoutUrls, setAllowedLogoutUrls)
  const corsOriginHandlers = makeUriListHandlers(corsAllowedOrigins, setCorsAllowedOrigins)

  const isLoading = createClientMutation.isPending || updateClientMutation.isPending || isSubmitting

  // Warn before discarding unsaved edits (browser close/refresh + guarded exits).
  const { guard, isPromptOpen, confirmLeave, cancelLeave } = useUnsavedChangesGuard(isDirty || isLocalDirty)

  const onSubmit = async (formData: ClientFormData) => {
    if (!currentTenant) {
      showError("Tenant information not available")
      return
    }

    if (metadataError) {
      showError(metadataError)
      return
    }

    if (grantTypes.length === 0) {
      showError("Select at least one grant type")
      return
    }

    if (capability.showResponseTypes && responseTypes.length === 0) {
      showError("Select at least one response type")
      return
    }

    // Validate the optional session-timeout overrides before building config.
    const idleTimeout = sessionIdleTimeout.trim() === "" ? null : Number(sessionIdleTimeout)
    const absoluteTimeout = sessionAbsoluteTimeout.trim() === "" ? null : Number(sessionAbsoluteTimeout)
    if (idleTimeout !== null && (!Number.isFinite(idleTimeout) || idleTimeout <= 0)) {
      showError("Session idle timeout must be a positive number of seconds")
      return
    }
    if (absoluteTimeout !== null && (!Number.isFinite(absoluteTimeout) || absoluteTimeout <= 0)) {
      showError("Session absolute timeout must be a positive number of seconds")
      return
    }
    if (idleTimeout !== null && absoluteTimeout !== null && absoluteTimeout < idleTimeout) {
      showError("Session absolute timeout must be greater than or equal to the idle timeout")
      return
    }

    try {
      const normalizedScopes = allowedScopes
        .split(",")
        .map((scope) => scope.trim())
        .filter(Boolean)

      // Build config object. URIs are managed separately via the client URI API.
      const config: Record<string, string | number | boolean | string[] | Record<string, string>> = {}

      config.grant_types = grantTypes
      config.response_types = capability.showResponseTypes ? responseTypes : []
      config.token_endpoint_auth_method = tokenEndpointAuthMethod
      config.require_consent = requireConsent
      config.pkce_required = pkceForced ? true : pkceRequired
      if (normalizedScopes.length > 0) {
        config.allowed_scopes = normalizedScopes
      }

      config.cors_enabled = capability.showCors ? corsEnabled : false

      config.access_token_lifetime = accessTokenLifetime
      config.refresh_token_lifetime = refreshTokenLifetime
      config.refresh_token_rotation = refreshTokenRotation
      config.multi_resource_refresh_token = multiResourceRefreshToken

      // Security overrides — only persisted when set; absent = inherit tenant policy.
      if (requiredAcr !== REQUIRED_ACR_INHERIT) {
        config.required_acr = requiredAcr
      }
      if (idleTimeout !== null) {
        config.session_idle_timeout = idleTimeout
      }
      if (absoluteTimeout !== null) {
        config.session_absolute_timeout = absoluteTimeout
      }

      const customConfig = buildPayload()
      if (customConfig) {
        config.custom = customConfig
      }

      let targetClientId = clientId

      if (isEditing && clientId) {
        const updatePayload: UpdateClientRequest = {
          name: formData.name,
          display_name: formData.displayName,
          client_type: formData.clientType as ClientType,
          domain: formData.domain,
          status: formData.status as ClientStatus,
          branding_id: brandingId !== NO_BRANDING ? brandingId : undefined,
          allow_registration: allowRegistration,
          config,
        }

        await updateClientMutation.mutateAsync({ clientId, data: updatePayload })
      } else {
        const createPayload: CreateClientRequest = {
          name: formData.name,
          display_name: formData.displayName,
          client_type: formData.clientType as ClientType,
          domain: formData.domain,
          status: formData.status as ClientStatus,
          branding_id: brandingId !== NO_BRANDING ? brandingId : undefined,
          allow_registration: allowRegistration,
          config,
        }

        const createdClient = await createClientMutation.mutateAsync(createPayload)
        targetClientId = createdClient.client.client_id
      }

      // Persist URIs via the URIs API — only the lists relevant to this client type.
      if (targetClientId) {
        const manageUris = async (uris: UriEntry[], type: ClientUriType) => {
          for (const item of uris) {
            if (!item.uri.trim()) continue
            if (item.id) {
              await updateClientUriMutation.mutateAsync({
                clientId: targetClientId!,
                clientUriId: item.id,
                data: { uri: item.uri.trim(), type }
              })
            } else {
              await createClientUriMutation.mutateAsync({
                clientId: targetClientId!,
                data: { uri: item.uri.trim(), type }
              })
            }
          }
        }

        if (capability.showLoginUri) {
          await manageUris([loginUri], 'login_uri')
        }
        if (capability.showRedirectUris) {
          await manageUris(redirectUris, 'redirect_uri')
        }
        if (capability.showAllowedOrigins) {
          await manageUris(allowedOrigins, 'origin_uri')
        }
        if (capability.showLogoutUrls) {
          await manageUris(allowedLogoutUrls, 'logout_uri')
        }
        if (capability.showCors && corsEnabled) {
          await manageUris(corsAllowedOrigins, 'cors_origin_uri')
        }
      }

      showSuccess(isEditing ? "Client updated successfully" : "Client created successfully")
      navigate(backTo)
    } catch (error: unknown) {
      // Route backend errors onto the offending field where we can: structured
      // field errors first, otherwise keyword-match the message. Anything
      // unmapped still shows via the toast.
      const parsed = parseError(error)
      let mappedToField = false
      if (parsed.fieldErrors) {
        for (const [field, message] of Object.entries(parsed.fieldErrors)) {
          const formField = BACKEND_FIELD_MAP[field]
          if (formField) {
            setError(formField, { type: "server", message })
            mappedToField = true
          }
        }
      }
      if (!mappedToField) {
        const lower = parsed.message.toLowerCase()
        // Most specific first, so "display name" doesn't land on "name".
        const keywordOrder: Array<[string, keyof ClientFormData]> = [
          ["display name", "displayName"],
          ["display_name", "displayName"],
          ["client type", "clientType"],
          ["client_type", "clientType"],
          ["domain", "domain"],
          ["status", "status"],
          ["name", "name"],
        ]
        const hit = keywordOrder.find(([keyword]) => lower.includes(keyword))
        if (hit) {
          setError(hit[1], { type: "server", message: parsed.message })
        }
      }
      showError(error)
    }
  }

  const pageTitle = isEditing ? `Edit ${clientData?.display_name || clientData?.name}` : "Create Client"
  const pageDescription = isEditing
    ? "Update client configuration and settings"
    : "Configure a new OAuth client for your application"

  const showUriCard = hasApplicationUris(capability)
  const isSystemClient = Boolean(clientData?.is_system)

  // Loading state while fetching the client to edit
  if (isEditing && isFetchingClient) {
    return (
      <DetailsContainer>
        <div className="flex flex-col gap-6">
          <FormPageHeader
            backUrl={backTo}
            backLabel={backLabel}
            title="Edit Client"
            description={pageDescription}
          />
          <Card>
            <CardContent className="space-y-4 pt-6">
              <Skeleton className="h-5 w-40" />
              <div className="grid gap-4 md:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DetailsContainer>
    )
  }

  // Not-found state
  if (isEditing && !isFetchingClient && !clientData) {
    return (
      <DetailsContainer>
        <div className="flex flex-col gap-6">
          <FormPageHeader
            backUrl={backTo}
            backLabel={backLabel}
            title="Edit Client"
            description={pageDescription}
          />
          <Card>
            <CardContent className="flex flex-col items-center justify-center gap-4 py-12 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <AlertCircle className="size-6" />
              </div>
              <div className="space-y-1">
                <h2 className="text-lg font-semibold">Client not found</h2>
                <p className="text-sm text-muted-foreground">
                  The client you're trying to edit doesn't exist or may have been removed.
                </p>
              </div>
              <Button variant="outline" onClick={() => guard(() => navigate(backTo))}>
                <ArrowLeft className="mr-2 size-4" />
                {backLabel}
              </Button>
            </CardContent>
          </Card>
        </div>
      </DetailsContainer>
    )
  }

  return (
    <DetailsContainer>
      <div className="flex flex-col gap-6">
        <FormPageHeader
          backUrl={backTo}
          backLabel={backLabel}
          onBack={() => guard(() => navigate(backTo))}
          title={pageTitle}
          description={pageDescription}
          showSystemBadge={isSystemClient}
          showWarning={isSystemClient}
          warningMessage="This is a system client. Some settings may be restricted and cannot be modified."
        />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" key={clientId || 'create'}>
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Basic Information</CardTitle>
              <p className="text-sm text-muted-foreground">
                Name, application type, domain, and status for this client.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormInputField
                label="Name"
                placeholder="e.g., medlexer-public"
                description="Lowercase letters, numbers, and hyphens only"
                disabled={isSystemClient || isLoading}
                error={errors.name?.message}
                required
                {...register("name")}
              />

              <FormInputField
                label="Display Name"
                placeholder="e.g., Medlexer Public"
                description="This will be the display name shown to users"
                disabled={isSystemClient || isLoading}
                error={errors.displayName?.message}
                required
                {...register("displayName")}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <Controller
                  name="clientType"
                  control={control}
                  render={({ field }) => (
                    <FormSelectField
                      key={`clientType-${field.value || 'empty'}`}
                      label="Client Type"
                      placeholder="Select client type"
                      options={CLIENT_TYPE_OPTIONS}
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isSystemClient || isLoading}
                      error={errors.clientType?.message}
                      description="Determines the OAuth flow, credentials, and URIs below"
                      required
                    />
                  )}
                />

                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <FormSelectField
                      key={`status-${field.value || 'empty'}`}
                      label="Status"
                      placeholder="Select status"
                      options={STATUS_OPTIONS}
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isLoading}
                      error={errors.status?.message}
                      required
                    />
                  )}
                />
              </div>

              <p className="rounded-md bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
                {capability.summary}
              </p>

              <FormInputField
                label="Domain"
                placeholder="e.g., au102931.api.maintainerd.auth"
                description="The domain for this client"
                disabled={isLoading}
                error={errors.domain?.message}
                required
                {...register("domain")}
              />

            </CardContent>
          </Card>

          {/* OAuth Flow Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">OAuth Flow Configuration</CardTitle>
              <p className="text-sm text-muted-foreground">
                Configure the standard OAuth and OIDC behavior for this client.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div>
                  <Label>Grant Types</Label>
                  <p className="text-xs text-muted-foreground">
                    Select the OAuth grant types this client can use.
                  </p>
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  {capability.grantTypeOptions.map((option) => (
                    <FormCheckboxField
                      key={option.value}
                      id={`grant-${option.value}`}
                      label={option.label}
                      checked={grantTypes.includes(option.value)}
                      onCheckedChange={() => toggleConfigValue(option.value, grantTypes, setGrantTypes)}
                      disabled={isSystemClient || isLoading}
                    />
                  ))}
                </div>
              </div>

              {capability.showResponseTypes && (
                <div className="space-y-3">
                  <div>
                    <Label>Response Types</Label>
                    <p className="text-xs text-muted-foreground">
                      Select the authorization response types this client supports.
                    </p>
                  </div>
                  <div className="grid gap-3 md:grid-cols-3">
                    <FormCheckboxField
                      id="response-code"
                      label="Code"
                      checked={responseTypes.includes("code")}
                      onCheckedChange={() => toggleConfigValue("code", responseTypes, setResponseTypes)}
                      disabled={isSystemClient || isLoading}
                    />
                  </div>
                </div>
              )}

              <FormSelectField
                label="Token Endpoint Auth Method"
                placeholder="Select auth method"
                options={capability.authMethodOptions}
                value={tokenEndpointAuthMethod}
                onValueChange={(value) => { markDirty(); setTokenEndpointAuthMethod(value) }}
                disabled={isSystemClient || isLoading || capability.isPublic}
                description={capability.isPublic
                  ? "Public clients do not authenticate with a secret at the token endpoint"
                  : "How this client authenticates when calling the token endpoint"}
                required
              />

              <FormInputField
                label="Allowed Scopes"
                placeholder="openid, profile, email"
                value={allowedScopes}
                onChange={(event) => { markDirty(); setAllowedScopes(event.target.value) }}
                disabled={isSystemClient || isLoading}
                description="Comma-separated scopes this client can request"
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormSwitchField
                  id="requireConsent"
                  label="Require Consent"
                  description="Require user consent before issuing tokens for this client"
                  checked={requireConsent}
                  onCheckedChange={(checked) => { markDirty(); setRequireConsent(checked) }}
                  disabled={isSystemClient || isLoading}
                />

                <FormSelectField
                  label="Branding template"
                  placeholder="Select branding"
                  options={brandingOptions}
                  value={brandingId}
                  onValueChange={(value) => { markDirty(); setBrandingId(value) }}
                  disabled={isLoading}
                  description="Optional — the branding applied to this client's login and registration pages. Defaults to the tenant's active branding."
                />

                <FormSwitchField
                  id="allow-registration"
                  label="Allow registration"
                  description="Allow self-service registration for this client. Does not affect login for existing users or invite acceptance."
                  checked={allowRegistration}
                  onCheckedChange={(checked) => { markDirty(); setAllowRegistration(checked) }}
                  disabled={isLoading}
                  containerClassName="rounded-md border p-4"
                />

                {capability.pkce !== "none" && (
                  <FormSwitchField
                    id="pkceRequired"
                    label="Require PKCE"
                    description={pkceForced
                      ? "Required for this client type and cannot be disabled"
                      : "Require proof key verification for authorization code flows"}
                    checked={pkceForced ? true : pkceRequired}
                    onCheckedChange={(checked) => { markDirty(); setPkceRequired(checked) }}
                    disabled={pkceForced || isSystemClient || isLoading}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Token Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Token Configuration</CardTitle>
              <p className="text-sm text-muted-foreground">
                Configure token lifetimes and security settings.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <FormInputField
                  label="Access Token Lifetime (seconds)"
                  type="number"
                  min={300}
                  max={86400}
                  value={accessTokenLifetime}
                  onChange={(e) => { markDirty(); setAccessTokenLifetime(parseInt(e.target.value) || 3600) }}
                  disabled={isLoading}
                  description={`Current: ${accessTokenLifetime / 3600} hours (300-86400 seconds)`}
                />

                <FormInputField
                  label="Refresh Token Lifetime (seconds)"
                  type="number"
                  min={3600}
                  value={refreshTokenLifetime}
                  onChange={(e) => { markDirty(); setRefreshTokenLifetime(parseInt(e.target.value) || 604800) }}
                  disabled={isLoading}
                  description={`Current: ${refreshTokenLifetime / 86400} days`}
                />
              </div>

              <FormSwitchField
                id="refreshTokenRotation"
                label="Refresh Token Rotation"
                description="Issue a new refresh token with each access token refresh"
                checked={refreshTokenRotation}
                onCheckedChange={(checked) => { markDirty(); setRefreshTokenRotation(checked) }}
                disabled={isLoading}
              />

              <FormSwitchField
                id="multiResourceRefreshToken"
                label="Multi-Resource Refresh Token (MRRT)"
                description="Allow one refresh token to receive access tokens for multiple APIs"
                checked={multiResourceRefreshToken}
                onCheckedChange={(checked) => { markDirty(); setMultiResourceRefreshToken(checked) }}
                disabled={isLoading}
              />
            </CardContent>
          </Card>

          {/* Step-up & Session Security */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Step-up &amp; Session Security</CardTitle>
              <p className="text-sm text-muted-foreground">
                Per-client overrides for authentication assurance and session lifetimes.
                Leave blank to inherit the tenant security policy.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormSelectField
                label="Required Authentication Level (ACR)"
                placeholder="Inherit tenant default"
                options={REQUIRED_ACR_OPTIONS}
                value={requiredAcr}
                onValueChange={(value) => { markDirty(); setRequiredAcr(value) }}
                disabled={isSystemClient || isLoading}
                description="Minimum assurance required to access this client. Step-up forces MFA at sign-in even when the tenant default does not."
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormInputField
                  label="Session Idle Timeout (seconds)"
                  type="number"
                  min={1}
                  value={sessionIdleTimeout}
                  onChange={(e) => { markDirty(); setSessionIdleTimeout(e.target.value) }}
                  placeholder="Inherit tenant default"
                  disabled={isSystemClient || isLoading}
                  description="Sliding window of inactivity before the session expires."
                />

                <FormInputField
                  label="Session Absolute Timeout (seconds)"
                  type="number"
                  min={1}
                  value={sessionAbsoluteTimeout}
                  onChange={(e) => { markDirty(); setSessionAbsoluteTimeout(e.target.value) }}
                  placeholder="Inherit tenant default"
                  disabled={isSystemClient || isLoading}
                  description="Hard cap on total session lifetime regardless of activity."
                />
              </div>
            </CardContent>
          </Card>

          {/* Application URIs — only the lists relevant to this client type */}
          {showUriCard && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Application URIs</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Configure application URLs and endpoints.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {capability.showLoginUri && (
                  <FormUrlField
                    label="Login URI"
                    placeholder="https://your-app.com/login"
                    description="The URL where users will be directed to log in"
                    value={loginUri.uri}
                    onChange={(e) => { markDirty(); setLoginUri({ ...loginUri, uri: e.target.value }) }}
                    disabled={isLoading}
                  />
                )}

                {capability.showRedirectUris && (
                  <UriListField
                    label="Redirect URIs"
                    description="URLs where users will be redirected after authentication"
                    placeholder="https://your-app.com/callback"
                    addLabel="Add Redirect URI"
                    items={redirectUris}
                    disabled={isLoading}
                    {...redirectUriHandlers}
                  />
                )}

                {capability.showAllowedOrigins && (
                  <UriListField
                    label="Allowed Origins"
                    description="Origins allowed to make requests to this client"
                    placeholder="https://your-app.com"
                    addLabel="Add Origin"
                    items={allowedOrigins}
                    disabled={isLoading}
                    {...allowedOriginHandlers}
                  />
                )}

                {capability.showLogoutUrls && (
                  <UriListField
                    label="Allowed Logout URLs"
                    description="URLs where users can be redirected after logout"
                    placeholder="https://your-app.com/logout"
                    addLabel="Add Logout URL"
                    items={allowedLogoutUrls}
                    disabled={isLoading}
                    {...allowedLogoutHandlers}
                  />
                )}
              </CardContent>
            </Card>
          )}

          {/* Cross Origin Authentication */}
          {capability.showCors && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Cross Origin Authentication</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Configure CORS settings for cross-origin authentication.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormSwitchField
                  id="corsEnabled"
                  label="Enable Cross-Origin Authentication"
                  description="Allow browser-based authentication calls from configured origins"
                  checked={corsEnabled}
                  onCheckedChange={(checked) => { markDirty(); setCorsEnabled(checked) }}
                  disabled={isLoading}
                />

                {corsEnabled && (
                  <UriListField
                    label="Allowed Origins (CORS)"
                    description="Origins allowed for cross-origin authentication requests"
                    placeholder="https://your-app.com"
                    addLabel="Add CORS Origin"
                    items={corsAllowedOrigins}
                    disabled={isLoading}
                    {...corsOriginHandlers}
                  />
                )}
              </CardContent>
            </Card>
          )}

          {/* Metadata */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-base">Metadata</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1.5">
                    Add non-common provider or application fields that should be available to integrations.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => { markDirty(); addCustomField() }}
                  disabled={isSystemClient || isLoading}
                  className="h-9 shrink-0 gap-2"
                >
                  <Plus className="size-4" />
                  Add Field
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <MetadataFieldEditor
                fields={customFields}
                error={metadataError}
                disabled={isSystemClient || isLoading}
                onAdd={() => { markDirty(); addCustomField() }}
                onUpdate={(id, key, value) => { markDirty(); updateCustomField(id, key, value) }}
                onRemove={(id) => { markDirty(); removeCustomField(id) }}
              />
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => guard(() => navigate(backTo))}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <FormSubmitButton
              isSubmitting={isLoading}
              disabled={isSystemClient}
              submittingText="Saving..."
              submitText={isEditing ? "Update Client" : "Create Client"}
            />
          </div>
        </form>

        <ConfirmationDialog
          open={isPromptOpen}
          onOpenChange={(open) => { if (!open) cancelLeave() }}
          onConfirm={confirmLeave}
          title="Discard changes?"
          description="You have unsaved changes. If you leave now, they will be lost."
          confirmText="Discard changes"
          cancelText="Keep editing"
          variant="destructive"
        />
      </div>
    </DetailsContainer>
  )
}
