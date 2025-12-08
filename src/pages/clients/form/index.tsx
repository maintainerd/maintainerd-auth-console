import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Plus, X, Trash2 } from "lucide-react"
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
  FormSelectField,
  FormSubmitButton,
  type SelectOption
} from "@/components/form"
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
import { useIdentityProviders, useIdentityProvider } from "@/hooks/useIdentityProviders"
import { useToast } from "@/hooks/useToast"
import type {
  CreateClientRequestInterface,
  UpdateClientRequestInterface,
  ClientTypeEnum,
  ClientStatusType,
  ClientUriTypeEnum
} from "@/services/api/auth-client/types"

const CLIENT_TYPE_OPTIONS: SelectOption[] = [
  { value: "spa", label: "Single Page Application" },
  { value: "traditional", label: "Traditional Web Application" },
  { value: "mobile", label: "Native Mobile Application" },
  { value: "m2m", label: "Machine to Machine" },
]

const STATUS_OPTIONS: SelectOption[] = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
]



export default function ClientAddOrUpdateForm() {
  const { tenantId, clientId } = useParams<{ tenantId: string; clientId?: string }>()
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()
  const currentTenant = useAppSelector((state) => state.tenant.currentTenant)

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

  // Fetch identity providers with search and pagination (only identity providers, not social)
  const { data: identityProvidersData } = useIdentityProviders({
    display_name: providerSearchValue || undefined,
    limit: 10,
    page: 1,
    sort_by: 'name',
    sort_order: 'asc',
    provider_type: 'identity',
  })

  // Application URIs state (with IDs for tracking existing URIs)
  const [loginUri, setLoginUri] = useState<{ uri: string; id?: string }>({ uri: "" })
  const [redirectUris, setRedirectUris] = useState<Array<{ uri: string; id?: string }>>([{ uri: "" }])
  const [allowedOrigins, setAllowedOrigins] = useState<Array<{ uri: string; id?: string }>>([{ uri: "" }])
  const [allowedLogoutUrls, setAllowedLogoutUrls] = useState<Array<{ uri: string; id?: string }>>([{ uri: "" }])

  // Cross Origin Authentication state (with IDs for tracking existing URIs)
  const [corsEnabled, setCorsEnabled] = useState<boolean>(false)
  const [corsAllowedOrigins, setCorsAllowedOrigins] = useState<Array<{ uri: string; id?: string }>>([{ uri: "" }])

  // Token Configuration state
  const [accessTokenLifetime, setAccessTokenLifetime] = useState<number>(3600)
  const [refreshTokenLifetime, setRefreshTokenLifetime] = useState<number>(604800)
  const [refreshTokenRotation, setRefreshTokenRotation] = useState<boolean>(false)
  const [multiResourceRefreshToken, setMultiResourceRefreshToken] = useState<boolean>(false)

  // Custom config fields state
  const [customFields, setCustomFields] = useState<Array<{ key: string; value: string; id: string }>>([])
  const [configError, setConfigError] = useState<string>("")

  // Track if config has been loaded to prevent premature sync
  const [configLoaded, setConfigLoaded] = useState(false)

  // Sync config to custom fields in real-time (URIs are now managed separately via API)
  useEffect(() => {
    // Only sync after config has been loaded (or immediately in create mode)
    if (!configLoaded) return

    // Build config object (only Token configuration now, URIs are managed separately)
    const configFields: Record<string, string> = {}

    // Add Cross Origin Authentication enabled flag
    configFields.cors_enabled = String(corsEnabled)

    // Add Token configuration
    configFields.access_token_lifetime = String(accessTokenLifetime)
    configFields.refresh_token_lifetime = String(refreshTokenLifetime)
    configFields.refresh_token_rotation = String(refreshTokenRotation)
    configFields.multi_resource_refresh_token = String(multiResourceRefreshToken)

    // Get existing custom fields (non-config fields)
    const configKeys = [
      'cors_enabled',
      'access_token_lifetime',
      'refresh_token_lifetime',
      'refresh_token_rotation',
      'multi_resource_refresh_token'
    ]

    const existingCustomFields = customFields.filter(
      field => !configKeys.includes(field.key)
    )

    // Add config fields to custom fields
    const configFieldsArray = Object.entries(configFields).map(([key, value]) => ({
      id: `config-${key}`,
      key,
      value: String(value)
    }))

    // Combine config fields with existing custom fields
    const allFields = [...configFieldsArray, ...existingCustomFields]

    // Only update if there's a change to avoid infinite loop
    const currentFieldsStr = JSON.stringify(customFields.map(f => ({ key: f.key, value: f.value })))
    const newFieldsStr = JSON.stringify(allFields.map(f => ({ key: f.key, value: f.value })))

    if (currentFieldsStr !== newFieldsStr) {
      setCustomFields(allFields)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    corsEnabled,
    accessTokenLifetime,
    refreshTokenLifetime,
    refreshTokenRotation,
    multiResourceRefreshToken,
    configLoaded
  ])

  // Check for duplicate keys whenever custom fields change
  useEffect(() => {
    const keys = customFields.map(field => field.key.trim()).filter(key => key !== '')
    const duplicateKeys = keys.filter((key, index) => keys.indexOf(key) !== index)

    if (duplicateKeys.length > 0) {
      const uniqueDuplicates = [...new Set(duplicateKeys)]
      setConfigError(`Duplicate configuration keys: ${uniqueDuplicates.join(', ')}`)
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

  // Fetch selected provider when editing (to display the name)
  const selectedProviderId = control._formValues.identityProviderId
  const { data: selectedProviderData } = useIdentityProvider(selectedProviderId || '')

  // Load existing client data if editing
  useEffect(() => {
    if (isEditing && clientData) {
      reset({
        name: clientData.name,
        displayName: clientData.display_name,
        clientType: clientData.client_type,
        domain: clientData.domain,
        identityProviderId: clientData.identity_provider.identity_provider_id,
        status: clientData.status,
      })
    }
  }, [isEditing, clientData, reset])

  // Load URIs from client data when editing (URIs are now included in client response)
  useEffect(() => {
    if (isEditing && clientData?.uris) {
      const uris = clientData.uris

      // Load login URI
      const loginUriData = uris.find(u => u.type === 'login-uri')
      if (loginUriData) {
        setLoginUri({ uri: loginUriData.uri, id: loginUriData.uri_id })
      }

      // Load redirect URIs
      const redirectUrisData = uris.filter(u => u.type === 'redirect-uri')
      if (redirectUrisData.length > 0) {
        setRedirectUris(redirectUrisData.map(u => ({ uri: u.uri, id: u.uri_id })))
      }

      // Load allowed origins
      const allowedOriginsData = uris.filter(u => u.type === 'origin-uri')
      if (allowedOriginsData.length > 0) {
        setAllowedOrigins(allowedOriginsData.map(u => ({ uri: u.uri, id: u.uri_id })))
      }

      // Load allowed logout URLs
      const allowedLogoutUrlsData = uris.filter(u => u.type === 'logout-uri')
      if (allowedLogoutUrlsData.length > 0) {
        setAllowedLogoutUrls(allowedLogoutUrlsData.map(u => ({ uri: u.uri, id: u.uri_id })))
      }

      // Load CORS allowed origins
      const corsAllowedOriginsData = uris.filter(u => u.type === 'cors-origin-uri')
      if (corsAllowedOriginsData.length > 0) {
        setCorsAllowedOrigins(corsAllowedOriginsData.map(u => ({ uri: u.uri, id: u.uri_id })))
      }
    }
  }, [isEditing, clientData])

  // Load config fields when editing
  useEffect(() => {
    if (isEditing && clientConfigData?.config) {
      const config = clientConfigData.config

      // Load Cross Origin Authentication
      if (config.cors_enabled !== undefined) {
        setCorsEnabled(config.cors_enabled === 'true' || config.cors_enabled === true)
      }

      // Load Token Configuration
      if (config.access_token_lifetime) {
        setAccessTokenLifetime(Number(config.access_token_lifetime))
      }
      if (config.refresh_token_lifetime) {
        setRefreshTokenLifetime(Number(config.refresh_token_lifetime))
      }
      if (config.refresh_token_rotation !== undefined) {
        setRefreshTokenRotation(config.refresh_token_rotation === 'true' || config.refresh_token_rotation === true)
      }
      if (config.multi_resource_refresh_token !== undefined) {
        setMultiResourceRefreshToken(config.multi_resource_refresh_token === 'true' || config.multi_resource_refresh_token === true)
      }

      // Load Custom Configuration from "custom" key
      if (config.custom && typeof config.custom === 'object') {
        const customConfigEntries = Object.entries(config.custom).map(([key, value], index) => ({
          id: `custom-${Date.now()}-${index}`,
          key,
          value: String(value)
        }))

        // Store custom fields separately to be merged with config fields in sync effect
        setCustomFields(customConfigEntries)
      }

      // Mark config as loaded to trigger sync
      setConfigLoaded(true)
    } else if (!isEditing) {
      // For create mode, mark as loaded immediately
      setConfigLoaded(true)
    }
  }, [isEditing, clientConfigData])

  // Custom config field management functions
  const addCustomField = () => {
    const newField = {
      id: Date.now().toString(),
      key: "",
      value: ""
    }
    setCustomFields([...customFields, newField])
  }

  const removeCustomField = (id: string) => {
    setCustomFields(customFields.filter(field => field.id !== id))
  }

  const updateCustomField = (id: string, key: string, value: string) => {
    setCustomFields(customFields.map(field =>
      field.id === id ? { ...field, key, value } : field
    ))
  }

  // Application URIs helper functions
  const addRedirectUri = () => {
    setRedirectUris([...redirectUris, { uri: "" }])
  }

  const removeRedirectUri = (index: number) => {
    setRedirectUris(redirectUris.filter((_, i) => i !== index))
  }

  const updateRedirectUri = (index: number, value: string) => {
    setRedirectUris(redirectUris.map((item, i) => i === index ? { ...item, uri: value } : item))
  }

  const addAllowedOrigin = () => {
    setAllowedOrigins([...allowedOrigins, { uri: "" }])
  }

  const removeAllowedOrigin = (index: number) => {
    setAllowedOrigins(allowedOrigins.filter((_, i) => i !== index))
  }

  const updateAllowedOrigin = (index: number, value: string) => {
    setAllowedOrigins(allowedOrigins.map((item, i) => i === index ? { ...item, uri: value } : item))
  }

  const addAllowedLogoutUrl = () => {
    setAllowedLogoutUrls([...allowedLogoutUrls, { uri: "" }])
  }

  const removeAllowedLogoutUrl = (index: number) => {
    setAllowedLogoutUrls(allowedLogoutUrls.filter((_, i) => i !== index))
  }

  const updateAllowedLogoutUrl = (index: number, value: string) => {
    setAllowedLogoutUrls(allowedLogoutUrls.map((item, i) => i === index ? { ...item, uri: value } : item))
  }

  // Cross Origin Authentication helper functions
  const addCorsAllowedOrigin = () => {
    setCorsAllowedOrigins([...corsAllowedOrigins, { uri: "" }])
  }

  const removeCorsAllowedOrigin = (index: number) => {
    setCorsAllowedOrigins(corsAllowedOrigins.filter((_, i) => i !== index))
  }

  const updateCorsAllowedOrigin = (index: number, value: string) => {
    setCorsAllowedOrigins(corsAllowedOrigins.map((item, i) => i === index ? { ...item, uri: value } : item))
  }

  const onSubmit = async (formData: ClientFormData) => {
    if (!currentTenant) {
      showError("Tenant information not available")
      return
    }

    // Check for duplicate keys in custom fields
    if (configError) {
      showError(configError)
      return
    }

    try {
      // Build config object (only Token configuration and custom fields, URIs are managed separately)
      const config: Record<string, string | number | boolean | Record<string, string>> = {}

      // Add Cross Origin Authentication enabled flag
      config.cors_enabled = corsEnabled

      // Add Token configuration
      config.access_token_lifetime = accessTokenLifetime
      config.refresh_token_lifetime = refreshTokenLifetime
      config.refresh_token_rotation = refreshTokenRotation
      config.multi_resource_refresh_token = multiResourceRefreshToken

      // Add custom configuration fields under "custom" key
      const configKeys = [
        'cors_enabled',
        'access_token_lifetime',
        'refresh_token_lifetime',
        'refresh_token_rotation',
        'multi_resource_refresh_token'
      ]

      const customConfig: Record<string, string> = {}
      customFields.forEach(field => {
        if (field.key.trim() && !configKeys.includes(field.key)) {
          customConfig[field.key] = field.value
        }
      })

      if (Object.keys(customConfig).length > 0) {
        config.custom = customConfig
      }

      let targetClientId = clientId

      if (isEditing && clientId) {
        // Update payload (no identity_provider_id)
        const updatePayload: UpdateClientRequestInterface = {
          name: formData.name,
          display_name: formData.displayName,
          client_type: formData.clientType as ClientTypeEnum,
          domain: formData.domain,
          status: formData.status as ClientStatusType,
          config: Object.keys(config).length > 0 ? config : undefined,
        }

        await updateClientMutation.mutateAsync({ clientId, data: updatePayload })
      } else {
        // Create payload (includes identity_provider_id)
        const createPayload: CreateClientRequestInterface = {
          name: formData.name,
          display_name: formData.displayName,
          client_type: formData.clientType as ClientTypeEnum,
          domain: formData.domain,
          identity_provider_id: formData.identityProviderId,
          status: formData.status as ClientStatusType,
          config: Object.keys(config).length > 0 ? config : undefined,
        }

        const createdClient = await createClientMutation.mutateAsync(createPayload)
        targetClientId = createdClient.client_id
      }

      // Now handle URIs using the URIs API
      if (targetClientId) {
        // Helper function to manage URIs
        const manageUris = async (
          uris: Array<{ uri: string; id?: string }>,
          type: ClientUriTypeEnum
        ) => {
          for (const item of uris) {
            if (!item.uri.trim()) continue

            if (item.id) {
              // Update existing URI
              await updateClientUriMutation.mutateAsync({
                clientId: targetClientId!,
                clientUriId: item.id,
                data: { uri: item.uri.trim(), type }
              })
            } else {
              // Create new URI
              await createClientUriMutation.mutateAsync({
                clientId: targetClientId!,
                data: { uri: item.uri.trim(), type }
              })
            }
          }
        }

        // Manage login URI
        if (loginUri.uri.trim()) {
          if (loginUri.id) {
            await updateClientUriMutation.mutateAsync({
              clientId: targetClientId,
              clientUriId: loginUri.id,
              data: { uri: loginUri.uri.trim(), type: 'login-uri' }
            })
          } else {
            await createClientUriMutation.mutateAsync({
              clientId: targetClientId,
              data: { uri: loginUri.uri.trim(), type: 'login-uri' }
            })
          }
        }

        // Manage redirect URIs
        await manageUris(redirectUris, 'redirect-uri')

        // Manage allowed origins
        await manageUris(allowedOrigins, 'origin-uri')

        // Manage allowed logout URLs
        await manageUris(allowedLogoutUrls, 'logout-uri')

        // Manage CORS allowed origins
        if (corsEnabled) {
          await manageUris(corsAllowedOrigins, 'cors-origin-uri')
        }
      }

      showSuccess(isEditing ? "Client updated successfully" : "Client created successfully")
      navigate(isEditing ? `/${tenantId}/clients/${clientId}` : `/${tenantId}/clients`)
    } catch (error: unknown) {
      showError(error)
    }
  }

  const handleCancel = () => {
    if (isEditing && clientId) {
      navigate(`/${tenantId}/clients/${clientId}`)
    } else {
      navigate(`/${tenantId}/clients`)
    }
  }

  const isLoading = isFetchingClient || createClientMutation.isPending || updateClientMutation.isPending

  // Get selected provider display name (from search results or from fetched provider)
  const selectedProvider = identityProvidersData?.rows?.find(
    provider => provider.identity_provider_id === control._formValues.identityProviderId
  ) || selectedProviderData

  return (
    <DetailsContainer>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <FormPageHeader
          backUrl={isEditing ? `/${tenantId}/clients/${clientId}` : `/${tenantId}/clients`}
          backLabel="Back to Clients"
          title={isEditing ? "Edit Client" : "Create New Client"}
          description={isEditing
            ? "Update client configuration and settings"
            : "Configure a new OAuth client for your application"
          }
        />

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
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
                          <Plus className="h-4 w-4 opacity-50" />
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

          {/* Application URIs */}
          <Card>
            <CardHeader>
              <CardTitle>Application URIs</CardTitle>
              <p className="text-sm text-muted-foreground">
                Configure application URLs and endpoints
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Login URI */}
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

              {/* Redirect URIs */}
              <div className="space-y-2">
                <Label>Redirect URIs</Label>
                <p className="text-xs text-muted-foreground">
                  URLs where users will be redirected after authentication
                </p>
                {redirectUris.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={item.uri}
                      onChange={(e) => updateRedirectUri(index, e.target.value)}
                      placeholder="https://your-app.com/callback"
                      disabled={isLoading}
                    />
                    {redirectUris.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeRedirectUri(index)}
                        disabled={isLoading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addRedirectUri}
                  disabled={isLoading}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Redirect URI
                </Button>
              </div>

              {/* Allowed Origins */}
              <div className="space-y-2">
                <Label>Allowed Origins</Label>
                <p className="text-xs text-muted-foreground">
                  Origins allowed to make requests to this client
                </p>
                {allowedOrigins.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={item.uri}
                      onChange={(e) => updateAllowedOrigin(index, e.target.value)}
                      placeholder="https://your-app.com"
                      disabled={isLoading}
                    />
                    {allowedOrigins.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeAllowedOrigin(index)}
                        disabled={isLoading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addAllowedOrigin}
                  disabled={isLoading}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Origin
                </Button>
              </div>

              {/* Allowed Logout URLs */}
              <div className="space-y-2">
                <Label>Allowed Logout URLs</Label>
                <p className="text-xs text-muted-foreground">
                  URLs where users can be redirected after logout
                </p>
                {allowedLogoutUrls.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={item.uri}
                      onChange={(e) => updateAllowedLogoutUrl(index, e.target.value)}
                      placeholder="https://your-app.com/logout"
                      disabled={isLoading}
                    />
                    {allowedLogoutUrls.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeAllowedLogoutUrl(index)}
                        disabled={isLoading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addAllowedLogoutUrl}
                  disabled={isLoading}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Logout URL
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Cross Origin Authentication */}
          <Card>
            <CardHeader>
              <CardTitle>Cross Origin Authentication</CardTitle>
              <p className="text-sm text-muted-foreground">
                Configure CORS settings for cross-origin authentication
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Enable CORS */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="corsEnabled"
                  checked={corsEnabled}
                  onChange={(e) => setCorsEnabled(e.target.checked)}
                  disabled={isLoading}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="corsEnabled" className="cursor-pointer">
                  Enable Cross Origin Authentication
                </Label>
              </div>

              {/* CORS Allowed Origins */}
              {corsEnabled && (
                <div className="space-y-2">
                  <Label>Allowed Origins (CORS)</Label>
                  <p className="text-xs text-muted-foreground">
                    Origins allowed for cross-origin authentication requests
                  </p>
                  {corsAllowedOrigins.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={item.uri}
                        onChange={(e) => updateCorsAllowedOrigin(index, e.target.value)}
                        placeholder="https://your-app.com"
                        disabled={isLoading}
                      />
                      {corsAllowedOrigins.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeCorsAllowedOrigin(index)}
                          disabled={isLoading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addCorsAllowedOrigin}
                    disabled={isLoading}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add CORS Origin
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Token Configuration */}
          <Card>
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

              {/* Refresh Token Rotation */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="refreshTokenRotation"
                  checked={refreshTokenRotation}
                  onChange={(e) => setRefreshTokenRotation(e.target.checked)}
                  disabled={isLoading}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <div className="flex flex-col">
                  <Label htmlFor="refreshTokenRotation" className="cursor-pointer">
                    Refresh Token Rotation
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Issue a new refresh token with each access token refresh
                  </p>
                </div>
              </div>

              {/* Multi-Resource Refresh Token */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="multiResourceRefreshToken"
                  checked={multiResourceRefreshToken}
                  onChange={(e) => setMultiResourceRefreshToken(e.target.checked)}
                  disabled={isLoading}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <div className="flex flex-col">
                  <Label htmlFor="multiResourceRefreshToken" className="cursor-pointer">
                    Multi-Resource Refresh Token (MRRT)
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Allow a single refresh token to receive access tokens for multiple APIs, each with their own scopes and permissions
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Custom Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Custom Configuration</CardTitle>
              <p className="text-sm text-muted-foreground">
                Add additional custom configuration fields
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Error Message for Duplicate Keys */}
              {configError && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  {configError}
                </div>
              )}

              {/* Existing Custom Fields */}
              {customFields.length > 0 && (
                <div className="space-y-3">
                  {customFields.map((field) => {
                    // Check if this is a config field (read-only)
                    const configKeys = [
                      'login_uri',
                      'redirect_uris',
                      'allowed_origins',
                      'allowed_logout_urls',
                      'cors_enabled',
                      'cors_allowed_origins',
                      'access_token_lifetime',
                      'refresh_token_lifetime',
                      'refresh_token_rotation',
                      'multi_resource_refresh_token'
                    ]
                    const isConfigField = configKeys.includes(field.key)

                    return (
                      <div key={field.id} className="flex gap-3 items-start">
                        <div className="flex-1 grid gap-3 md:grid-cols-2">
                          <Input
                            value={field.key}
                            onChange={(e) => updateCustomField(field.id, e.target.value, field.value)}
                            placeholder="Field name (e.g., pkce, response_type)"
                            disabled={isConfigField || clientData?.is_system || isLoading}
                            className={isConfigField ? "bg-muted" : ""}
                          />
                          <Input
                            value={field.value}
                            onChange={(e) => updateCustomField(field.id, field.key, e.target.value)}
                            placeholder="Field value"
                            disabled={isConfigField || clientData?.is_system || isLoading}
                            className={isConfigField ? "bg-muted" : ""}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCustomField(field.id)}
                          disabled={isConfigField || clientData?.is_system || isLoading}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Add Field Button */}
              <Button
                type="button"
                variant="outline"
                onClick={addCustomField}
                disabled={clientData?.is_system || isLoading}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Custom Field
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


