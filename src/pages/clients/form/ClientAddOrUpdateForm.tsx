import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Check, ChevronsUpDown, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
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
import { clientSchema, type ClientFormData } from "@/lib/validations"
import { cn } from "@/lib/utils"
import { useAppSelector } from "@/store/hooks"
import {
  useClient,
  useCreateClient,
  useUpdateClient,
  useClientConfig,
  useCreateClientUri,
  useUpdateClientUri
} from "@/hooks/useClients"
import { useIdentityProviders, useIdentityProvider } from "@/hooks/useIdentityProviders"
import { useToast } from "@/hooks/useToast"
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

export default function ClientAddOrUpdateForm() {
  const { tenantId, clientId } = useParams<{ tenantId: string; clientId?: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { showSuccess, showError } = useToast()
  const currentTenant = useAppSelector((state) => state.tenant.currentTenant)

  // When launched from an identity provider's Clients tab, the provider is
  // preselected and the back navigation returns to that provider.
  const navState = (location.state || {}) as {
    identityProviderId?: string
    from?: string
    backLabel?: string
  }

  const isEditing = Boolean(clientId)

  // Fetch existing client if editing
  const { data: clientData, isLoading: isFetchingClient } = useClient(clientId || '')
  const createClientMutation = useCreateClient()
  const updateClientMutation = useUpdateClient()

  // Fetch client config if editing
  const { data: clientConfigData } = useClientConfig(clientId || '')

  // URI mutations (URIs are now included in client response, no need to fetch separately)
  const createClientUriMutation = useCreateClientUri()
  const updateClientUriMutation = useUpdateClientUri()

  // Identity provider search state
  const [providerSearchValue, setProviderSearchValue] = useState("")
  const [providerSearchOpen, setProviderSearchOpen] = useState(false)

  // Fetch identity providers with search and pagination. Social connectors are
  // identity providers too, so the picker covers every provider_type.
  const { data: identityProvidersData } = useIdentityProviders({
    display_name: providerSearchValue || undefined,
    limit: 10,
    page: 1,
    sort_by: 'name',
    sort_order: 'asc',
  })

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
  const [refreshTokenRotation, setRefreshTokenRotation] = useState<boolean>(false)
  const [multiResourceRefreshToken, setMultiResourceRefreshToken] = useState<boolean>(false)

  // Custom config fields state
  const [customFields, setCustomFields] = useState<Array<{ key: string; value: string; id: string }>>([])
  const [configError, setConfigError] = useState<string>("")

  // Check for duplicate keys whenever custom fields change
  useEffect(() => {
    const keys = customFields.map(field => field.key.trim()).filter(key => key !== '')
    const duplicateKeys = keys.filter((key, index) => keys.indexOf(key) !== index)
    const reservedKeys = keys.filter(key => COMMON_CLIENT_CONFIG_KEYS.has(key))

    if (reservedKeys.length > 0) {
      const uniqueReserved = [...new Set(reservedKeys)]
      setConfigError(`Move standard client configuration to its own controls: ${uniqueReserved.join(', ')}`)
    } else if (duplicateKeys.length > 0) {
      const uniqueDuplicates = [...new Set(duplicateKeys)]
      setConfigError(`Duplicate metadata keys: ${uniqueDuplicates.join(', ')}`)
    } else {
      setConfigError("")
    }
  }, [customFields])

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<ClientFormData>({
    resolver: yupResolver(clientSchema),
    defaultValues: {
      name: "",
      displayName: "",
      clientType: "spa",
      domain: "",
      identityProviderId: "",
      status: "active",
    },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit'
  })

  // The selected client type drives which OAuth flows, credential model, and
  // application URIs are relevant. A single capability object replaces scattered
  // per-type conditionals throughout the form.
  const clientType = (watch("clientType") || "spa") as ClientType
  const capability = getClientTypeCapability(clientType)
  const pkceForced = capability.pkce === "required"

  // Fetch selected provider when editing (to display the name)
  const selectedProviderId = control._formValues.identityProviderId
  const { data: selectedProviderData } = useIdentityProvider(selectedProviderId || '')

  // Preselect the identity provider when creating from a provider's Clients tab
  useEffect(() => {
    if (!isEditing && navState.identityProviderId) {
      setValue("identityProviderId", navState.identityProviderId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing, navState.identityProviderId])

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
        identityProviderId: clientData.identity_provider?.identity_provider_id ?? "",
        status: clientData.status,
      })
      // Mark the hydrated type as current so the defaults effect doesn't
      // overwrite the loaded OAuth configuration below.
      prevTypeRef.current = clientData.client_type
    }
  }, [isEditing, clientData, reset])

  // Load URIs from client data when editing (URIs are now included in client response)
  useEffect(() => {
    if (isEditing && clientData?.uris) {
      const uris = clientData.uris

      const loginUriData = uris.find(u => u.type === 'login-uri')
      if (loginUriData) {
        setLoginUri({ uri: loginUriData.uri, id: loginUriData.uri_id })
      }

      const redirectUrisData = uris.filter(u => u.type === 'redirect-uri')
      if (redirectUrisData.length > 0) {
        setRedirectUris(redirectUrisData.map(u => ({ uri: u.uri, id: u.uri_id })))
      }

      const allowedOriginsData = uris.filter(u => u.type === 'origin-uri')
      if (allowedOriginsData.length > 0) {
        setAllowedOrigins(allowedOriginsData.map(u => ({ uri: u.uri, id: u.uri_id })))
      }

      const allowedLogoutUrlsData = uris.filter(u => u.type === 'logout-uri')
      if (allowedLogoutUrlsData.length > 0) {
        setAllowedLogoutUrls(allowedLogoutUrlsData.map(u => ({ uri: u.uri, id: u.uri_id })))
      }

      const corsAllowedOriginsData = uris.filter(u => u.type === 'cors-origin-uri')
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

      const metadataEntries = Object.entries(getClientMetadata(config)).map(([key, value], index) => ({
        id: `custom-${Date.now()}-${index}`,
        key,
        value: typeof value === "object" && value !== null ? JSON.stringify(value) : String(value)
      }))
      setCustomFields(metadataEntries)
    }
  }, [isEditing, clientConfigData])

  // Custom config field management functions
  const addCustomField = () => {
    setCustomFields([...customFields, { id: Date.now().toString(), key: "", value: "" }])
  }

  const removeCustomField = (id: string) => {
    setCustomFields(customFields.filter(field => field.id !== id))
  }

  const updateCustomField = (id: string, key: string, value: string) => {
    setCustomFields(customFields.map(field =>
      field.id === id ? { ...field, key, value } : field
    ))
  }

  const toggleConfigValue = (
    value: string,
    selectedValues: string[],
    setSelectedValues: (values: string[]) => void
  ) => {
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
    onAdd: () => setItems([...items, { uri: "" }]),
    onRemove: (index: number) => setItems(items.filter((_, i) => i !== index)),
    onChange: (index: number, value: string) =>
      setItems(items.map((item, i) => (i === index ? { ...item, uri: value } : item))),
  })

  const redirectUriHandlers = makeUriListHandlers(redirectUris, setRedirectUris)
  const allowedOriginHandlers = makeUriListHandlers(allowedOrigins, setAllowedOrigins)
  const allowedLogoutHandlers = makeUriListHandlers(allowedLogoutUrls, setAllowedLogoutUrls)
  const corsOriginHandlers = makeUriListHandlers(corsAllowedOrigins, setCorsAllowedOrigins)

  const onSubmit = async (formData: ClientFormData) => {
    if (!currentTenant) {
      showError("Tenant information not available")
      return
    }

    if (configError) {
      showError(configError)
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

      const customConfig: Record<string, string> = {}
      customFields.forEach(field => {
        const key = field.key.trim()
        if (key && !COMMON_CLIENT_CONFIG_KEYS.has(key)) {
          customConfig[key] = field.value
        }
      })

      if (Object.keys(customConfig).length > 0) {
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
          config,
        }

        await updateClientMutation.mutateAsync({ clientId, data: updatePayload })
      } else {
        const createPayload: CreateClientRequest = {
          name: formData.name,
          display_name: formData.displayName,
          client_type: formData.clientType as ClientType,
          domain: formData.domain,
          identity_provider_id: formData.identityProviderId,
          status: formData.status as ClientStatus,
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
          await manageUris([loginUri], 'login-uri')
        }
        if (capability.showRedirectUris) {
          await manageUris(redirectUris, 'redirect-uri')
        }
        if (capability.showAllowedOrigins) {
          await manageUris(allowedOrigins, 'origin-uri')
        }
        if (capability.showLogoutUrls) {
          await manageUris(allowedLogoutUrls, 'logout-uri')
        }
        if (capability.showCors && corsEnabled) {
          await manageUris(corsAllowedOrigins, 'cors-origin-uri')
        }
      }

      showSuccess(isEditing ? "Client updated successfully" : "Client created successfully")
      navigate(isEditing ? `/${tenantId}/clients/${clientId}` : navState.from ?? `/${tenantId}/clients`)
    } catch (error: unknown) {
      showError(error)
    }
  }

  const handleCancel = () => {
    if (isEditing && clientId) {
      navigate(`/${tenantId}/clients/${clientId}`)
    } else {
      navigate(navState.from ?? `/${tenantId}/clients`)
    }
  }

  const isLoading = isFetchingClient || createClientMutation.isPending || updateClientMutation.isPending
  const showUriCard = hasApplicationUris(capability)

  // Get selected provider display name (from search results or from fetched provider)
  const selectedProvider = identityProvidersData?.rows?.find(
    provider => provider.identity_provider_id === control._formValues.identityProviderId
  ) || selectedProviderData

  return (
    <DetailsContainer>
      <div className="flex flex-col gap-6">
        <FormPageHeader
          backUrl={isEditing ? `/${tenantId}/clients/${clientId}` : navState.from ?? `/${tenantId}/clients`}
          backLabel={isEditing ? "Back to Clients" : navState.backLabel ?? "Back to Clients"}
          title={isEditing ? "Edit Client" : "Create New Client"}
          description={isEditing
            ? "Update client configuration and settings"
            : "Configure a new OAuth client for your application"
          }
        />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormInputField
                label="Name"
                placeholder="e.g., medlexer-public"
                description="Lowercase letters, numbers, and hyphens only"
                disabled={clientData?.is_system || isLoading}
                error={errors.name?.message}
                required
                {...register("name")}
              />

              <FormInputField
                label="Display Name"
                placeholder="e.g., Medlexer Public"
                description="This will be the display name shown to users"
                disabled={clientData?.is_system || isLoading}
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
                      disabled={clientData?.is_system || isLoading}
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

              <Controller
                name="identityProviderId"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label>
                      Identity Provider <span className="text-destructive">*</span>
                    </Label>
                    <Popover open={providerSearchOpen} onOpenChange={setProviderSearchOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={providerSearchOpen}
                          className="w-full justify-between"
                          disabled={isLoading}
                        >
                          <span className={field.value ? "" : "text-muted-foreground"}>
                            {field.value
                              ? selectedProvider?.display_name || "Select identity provider"
                              : "Select identity provider"}
                          </span>
                          <ChevronsUpDown className="h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" align="start">
                        <Command>
                          <CommandInput
                            placeholder="Search identity providers..."
                            value={providerSearchValue}
                            onValueChange={setProviderSearchValue}
                          />
                          <CommandList>
                            <CommandEmpty>No identity providers found.</CommandEmpty>
                            <CommandGroup>
                              {identityProvidersData?.rows?.map((provider) => (
                                <CommandItem
                                  key={provider.identity_provider_id}
                                  value={provider.identity_provider_id}
                                  onSelect={() => {
                                    field.onChange(provider.identity_provider_id)
                                    setProviderSearchOpen(false)
                                    setProviderSearchValue("")
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value === provider.identity_provider_id ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  <div className="flex flex-col">
                                    <span className="font-medium">{provider.display_name}</span>
                                    <span className="text-xs text-muted-foreground">{provider.name}</span>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    {errors.identityProviderId?.message && (
                      <p className="text-sm text-destructive">{errors.identityProviderId.message}</p>
                    )}
                  </div>
                )}
              />
            </CardContent>
          </Card>

          {/* OAuth Flow Configuration */}
          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle>OAuth Flow Configuration</CardTitle>
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
                      disabled={clientData?.is_system || isLoading}
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
                      disabled={clientData?.is_system || isLoading}
                    />
                  </div>
                </div>
              )}

              <FormSelectField
                label="Token Endpoint Auth Method"
                placeholder="Select auth method"
                options={capability.authMethodOptions}
                value={tokenEndpointAuthMethod}
                onValueChange={setTokenEndpointAuthMethod}
                disabled={clientData?.is_system || isLoading || capability.isPublic}
                description={capability.isPublic
                  ? "Public clients do not authenticate with a secret at the token endpoint"
                  : "How this client authenticates when calling the token endpoint"}
                required
              />

              <FormInputField
                label="Allowed Scopes"
                placeholder="openid, profile, email"
                value={allowedScopes}
                onChange={(event) => setAllowedScopes(event.target.value)}
                disabled={clientData?.is_system || isLoading}
                description="Comma-separated scopes this client can request"
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormSwitchField
                  id="requireConsent"
                  label="Require Consent"
                  description="Require user consent before issuing tokens for this client"
                  checked={requireConsent}
                  onCheckedChange={setRequireConsent}
                  disabled={clientData?.is_system || isLoading}
                />
                {capability.pkce !== "none" && (
                  <FormSwitchField
                    id="pkceRequired"
                    label="Require PKCE"
                    description={pkceForced
                      ? "Required for this client type and cannot be disabled"
                      : "Require proof key verification for authorization code flows"}
                    checked={pkceForced ? true : pkceRequired}
                    onCheckedChange={setPkceRequired}
                    disabled={pkceForced || clientData?.is_system || isLoading}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Token Configuration */}
          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle>Token Configuration</CardTitle>
              <p className="text-sm text-muted-foreground">
                Configure token lifetimes and security settings
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="accessTokenLifetime">Access Token Lifetime (seconds)</Label>
                  <Input
                    id="accessTokenLifetime"
                    type="number"
                    value={accessTokenLifetime}
                    onChange={(e) => setAccessTokenLifetime(parseInt(e.target.value) || 3600)}
                    min="300"
                    max="86400"
                    disabled={isLoading}
                  />
                  <p className="text-xs text-muted-foreground">
                    Current: {accessTokenLifetime / 3600} hours (300-86400 seconds)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="refreshTokenLifetime">Refresh Token Lifetime (seconds)</Label>
                  <Input
                    id="refreshTokenLifetime"
                    type="number"
                    value={refreshTokenLifetime}
                    onChange={(e) => setRefreshTokenLifetime(parseInt(e.target.value) || 604800)}
                    min="3600"
                    disabled={isLoading}
                  />
                  <p className="text-xs text-muted-foreground">
                    Current: {refreshTokenLifetime / 86400} days
                  </p>
                </div>
              </div>

              <FormSwitchField
                id="refreshTokenRotation"
                label="Refresh Token Rotation"
                description="Issue a new refresh token with each access token refresh"
                checked={refreshTokenRotation}
                onCheckedChange={setRefreshTokenRotation}
                disabled={isLoading}
              />

              <FormSwitchField
                id="multiResourceRefreshToken"
                label="Multi-Resource Refresh Token (MRRT)"
                description="Allow one refresh token to receive access tokens for multiple APIs"
                checked={multiResourceRefreshToken}
                onCheckedChange={setMultiResourceRefreshToken}
                disabled={isLoading}
              />
            </CardContent>
          </Card>

          {/* Application URIs — only the lists relevant to this client type */}
          {showUriCard && (
            <Card className="shadow-xs">
              <CardHeader>
                <CardTitle>Application URIs</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Configure application URLs and endpoints
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {capability.showLoginUri && (
                  <div className="space-y-2">
                    <Label htmlFor="loginUri">Login URI</Label>
                    <Input
                      id="loginUri"
                      value={loginUri.uri}
                      onChange={(e) => setLoginUri({ ...loginUri, uri: e.target.value })}
                      placeholder="https://your-app.com/login"
                      disabled={isLoading}
                    />
                    <p className="text-xs text-muted-foreground">
                      The URL where users will be directed to log in
                    </p>
                  </div>
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
            <Card className="shadow-xs">
              <CardHeader>
                <CardTitle>Cross Origin Authentication</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Configure CORS settings for cross-origin authentication
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormSwitchField
                  id="corsEnabled"
                  label="Enable Cross-Origin Authentication"
                  description="Allow browser-based authentication calls from configured origins"
                  checked={corsEnabled}
                  onCheckedChange={setCorsEnabled}
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
          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
              <p className="text-sm text-muted-foreground">
                Add non-common provider or application fields that should be available to integrations.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {configError && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  {configError}
                </div>
              )}

              {customFields.length > 0 && (
                <div className="space-y-3">
                  {customFields.map((field) => (
                    <div key={field.id} className="flex gap-3 items-start">
                      <div className="flex-1 grid gap-3 md:grid-cols-2">
                        <Input
                          value={field.key}
                          onChange={(e) => updateCustomField(field.id, e.target.value, field.value)}
                          placeholder="Field name (e.g., cognito_region)"
                          disabled={clientData?.is_system || isLoading}
                        />
                        <Input
                          value={field.value}
                          onChange={(e) => updateCustomField(field.id, field.key, e.target.value)}
                          placeholder="Field value"
                          disabled={clientData?.is_system || isLoading}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCustomField(field.id)}
                        disabled={clientData?.is_system || isLoading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <Button
                type="button"
                variant="outline"
                onClick={addCustomField}
                disabled={clientData?.is_system || isLoading}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Metadata Field
              </Button>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <FormSubmitButton
              isSubmitting={isSubmitting || isLoading}
              disabled={clientData?.is_system}
              submittingText="Saving..."
              submitText={isEditing ? "Update Client" : "Create Client"}
            />
          </div>
        </form>
      </div>
    </DetailsContainer>
  )
}
