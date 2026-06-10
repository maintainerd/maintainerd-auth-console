import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { DetailsContainer } from "@/components/container"
import { FormPageHeader } from "@/components/header"
import {
  FormInputField,
  FormTextareaField,
  FormSelectField,
  FormSubmitButton,
  type SelectOption
} from "@/components/form"
import { signupFlowSchema, type SignupFlowFormData } from "@/lib/validations"
import {
  useSignupFlow,
  useCreateSignupFlow,
  useUpdateSignupFlow,
  useSignupFlowRoles,
  useSignupFlowCallbackURIs,
} from "@/hooks/useSignupFlows"
import { useClients, useClient, useClientUris } from "@/hooks/useClients"
import { useRoles } from "@/hooks/useRoles"
import { useBrandings } from "@/hooks/useBranding"
import { useToast } from "@/hooks/useToast"
import { SelectableOptionRow } from "../components/SelectableOptionRow"

// Backend only accepts active/inactive (DB CHECK enforces it) — no "draft".
const STATUS_OPTIONS: SelectOption[] = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
]

// Sentinel for "no specific branding" — the flow uses the tenant's active branding.
const NO_BRANDING = "__none__"

export default function SignupFlowAddOrUpdateForm() {
  const { tenantId, signupFlowId } = useParams<{ tenantId: string; signupFlowId?: string }>()
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()

  const isEditing = Boolean(signupFlowId)

  // Fetch existing auth flow if editing
  const { data: signupFlowData, isLoading: isFetchingSignupFlow } = useSignupFlow(signupFlowId || '')
  const createSignupFlowMutation = useCreateSignupFlow()
  const updateSignupFlowMutation = useUpdateSignupFlow()

  // Client search state
  const [clientSearchValue, setClientSearchValue] = useState("")
  const [clientSearchOpen, setClientSearchOpen] = useState(false)

  // Fetch clients with search
  const { data: clientsData } = useClients({
    name: clientSearchValue || undefined,
    limit: 10,
    page: 1,
    sort_by: 'name',
    sort_order: 'asc',
  })

  // Auto approved state
  const [autoApproved, setAutoApproved] = useState<boolean>(true)

  // Optional branding template applied to this flow (UUID, or the sentinel).
  const [brandingId, setBrandingId] = useState<string>(NO_BRANDING)
  const { data: brandings } = useBrandings()
  const brandingOptions: SelectOption[] = [
    { value: NO_BRANDING, label: "Use tenant's active branding" },
    ...(brandings ?? []).map((b) => ({
      value: b.branding_id,
      label: b.is_active ? `${b.name} (active)` : b.name,
    })),
  ]

  // Roles to auto-assign + callback URIs to attach (sent with create/update).
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([])
  const [selectedCallbackUriIds, setSelectedCallbackUriIds] = useState<string[]>([])

  const { data: rolesData, isLoading: isLoadingRoles } = useRoles({
    page: 1,
    limit: 100,
    sort_by: "name",
    sort_order: "asc",
  })
  const roleOptions = rolesData?.rows ?? []

  // Custom config fields state
  const [customFields, setCustomFields] = useState<Array<{ key: string; value: string; id: string }>>([])
  const [configError, setConfigError] = useState<string>("")

  // Track if config has been loaded to prevent premature sync
  const [configLoaded, setConfigLoaded] = useState(false)

  // Sync config to custom fields in real-time
  useEffect(() => {
    if (!configLoaded) return

    // For auth flows, we don't sync auto_approved to custom fields
    // It's managed separately via checkbox
    // Custom fields are user-added only
    
  }, [configLoaded])

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
    watch,
    formState: { errors, isSubmitting }
  } = useForm<SignupFlowFormData>({
    resolver: yupResolver(signupFlowSchema),
    defaultValues: {
      name: "",
      description: "",
      status: "active",
      clientId: "",
    },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit'
  })

  // Fetch selected client when editing (to display the name)
  const selectedClientId = control._formValues.clientId
  const { data: selectedClientData } = useClient(selectedClientId || '')

  // The chosen client's registered redirect URIs — the eligible callback URIs.
  const clientId = watch("clientId")
  const { data: clientUrisData, isLoading: isLoadingUris } = useClientUris(clientId || "")
  const redirectUris = (clientUrisData?.uris ?? []).filter((u) => u.type === "redirect-uri")

  // Existing roles / callback URIs when editing (to diff on save).
  const { data: existingRolesData } = useSignupFlowRoles(signupFlowId || "", { limit: 100 })
  const { data: existingCallbacksData } = useSignupFlowCallbackURIs(signupFlowId || "", { limit: 100 })

  // Initialize the selections from the existing data exactly once — depending on
  // the query-result object directly would re-run on every reference change and
  // can loop. We only need the initial population; further edits are user-driven.
  const rolesInitialized = useRef(false)
  const callbacksInitialized = useRef(false)

  useEffect(() => {
    if (isEditing && existingRolesData && !rolesInitialized.current) {
      rolesInitialized.current = true
      setSelectedRoleIds(existingRolesData.rows.map((r) => r.role_id))
    }
  }, [isEditing, existingRolesData])

  useEffect(() => {
    if (isEditing && existingCallbacksData && !callbacksInitialized.current) {
      callbacksInitialized.current = true
      setSelectedCallbackUriIds(existingCallbacksData.rows.map((r) => r.client_uri_id))
    }
  }, [isEditing, existingCallbacksData])

  const toggleRole = (id: string) =>
    setSelectedRoleIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  const toggleCallback = (id: string) =>
    setSelectedCallbackUriIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )

  // Load existing auth flow data if editing — once. Initializing on every
  // signupFlowData reference change can loop (reset() re-renders).
  const flowInitialized = useRef(false)
  useEffect(() => {
    if (isEditing && signupFlowData && !flowInitialized.current) {
      flowInitialized.current = true
      reset({
        name: signupFlowData.name,
        description: signupFlowData.description,
        // Backend only stores active/inactive; coerce any legacy value.
        status: signupFlowData.status === "active" ? "active" : "inactive",
        clientId: signupFlowData.client_id,
      })

      // Load config
      const config = signupFlowData.config || {}
      
      // Set auto_approved
      setAutoApproved(config.auto_approved ?? true)

      // Load optional branding
      setBrandingId(signupFlowData.branding_id || NO_BRANDING)

      // Load custom fields from config
      const knownKeys = ['auto_approved']
      const customConfigFields: Array<{ key: string; value: string; id: string }> = []

      Object.entries(config).forEach(([key, value]) => {
        if (!knownKeys.includes(key)) {
          customConfigFields.push({
            id: `custom-${key}-${Date.now()}`,
            key,
            value: typeof value === 'object' ? JSON.stringify(value) : String(value)
          })
        }
      })

      // Replace custom fields instead of appending
      setCustomFields(customConfigFields)

      // Mark config as loaded
      setConfigLoaded(true)
    } else if (!isEditing) {
      // Mark config as loaded for create mode
      setConfigLoaded(true)
    }
  }, [isEditing, signupFlowData, reset])

  // Custom field helpers
  const addCustomField = () => {
    setCustomFields(prev => [...prev, { id: `new-${Date.now()}`, key: "", value: "" }])
  }

  const updateCustomField = (id: string, key: string, value: string) => {
    setCustomFields(prev => prev.map(field => 
      field.id === id ? { ...field, key, value } : field
    ))
  }

  const removeCustomField = (id: string) => {
    setCustomFields(prev => prev.filter(field => field.id !== id))
  }

  const onSubmit = async (data: SignupFlowFormData) => {
    if (configError) {
      showError("Please fix configuration errors before submitting")
      return
    }

    try {
      // Build config object from custom fields
      const config: Record<string, unknown> = {}

      // Add auto_approved from checkbox state
      config.auto_approved = autoApproved

      customFields.forEach(field => {
        if (field.key.trim() && field.value.trim()) {
          // Try to parse as JSON for complex values
          try {
            config[field.key.trim()] = JSON.parse(field.value.trim())
          } catch {
            // If not JSON, use as string, or convert to boolean
            if (field.value.trim() === 'true') {
              config[field.key.trim()] = true
            } else if (field.value.trim() === 'false') {
              config[field.key.trim()] = false
            } else if (!isNaN(Number(field.value.trim()))) {
              config[field.key.trim()] = Number(field.value.trim())
            } else {
              config[field.key.trim()] = field.value.trim()
            }
          }
        }
      })

      // Only callback URIs belonging to the selected client are valid.
      const availableUriIds = redirectUris.map((u) => u.uri_id)
      const effectiveCallbacks = selectedCallbackUriIds.filter((id) => availableUriIds.includes(id))

      const requestData = {
        name: data.name,
        description: data.description,
        status: data.status,
        client_id: data.clientId,
        config,
        // Optional — omit when using the tenant's active branding.
        branding_id: brandingId !== NO_BRANDING ? brandingId : undefined,
        // Roles + callback URIs are created/replaced in the same request.
        role_ids: selectedRoleIds,
        client_uri_ids: effectiveCallbacks,
      }

      let flowId: string
      if (isEditing) {
        await updateSignupFlowMutation.mutateAsync({ signupFlowId: signupFlowId!, data: requestData })
        flowId = signupFlowId!
      } else {
        const createdFlow = await createSignupFlowMutation.mutateAsync(requestData)
        flowId = createdFlow.signup_flow_id
      }

      showSuccess(isEditing ? "Auth flow updated successfully" : "Auth flow created successfully")
      navigate(`/${tenantId}/auth-flows/${flowId}`)
    } catch (error) {
      showError(error)
    }
  }

  const handleCancel = () => {
    if (isEditing && signupFlowId) {
      navigate(`/${tenantId}/auth-flows/${signupFlowId}`)
    } else {
      navigate(`/${tenantId}/auth-flows`)
    }
  }

  const isLoading = isFetchingSignupFlow || createSignupFlowMutation.isPending || updateSignupFlowMutation.isPending

  // Get selected client display name
  const selectedClient = clientsData?.rows?.find(
    client => client.client_id === control._formValues.clientId
  ) || selectedClientData

  // Show loading state while fetching
  if (isEditing && isFetchingSignupFlow) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Loading...</h2>
          <p className="text-muted-foreground mt-2">
            Fetching auth flow details
          </p>
        </div>
      </div>
    )
  }

  return (
    <DetailsContainer>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <FormPageHeader
          backUrl={isEditing ? `/${tenantId}/auth-flows/${signupFlowId}` : `/${tenantId}/auth-flows`}
          backLabel="Back to Auth Flows"
          title={isEditing ? "Edit Auth Flow" : "Create New Auth Flow"}
          description={isEditing
            ? "Update auth flow configuration and settings"
            : "Configure a new auth flow for user registration"
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
                placeholder="e.g., seller-signup"
                description="A descriptive name for this auth flow"
                disabled={isLoading}
                error={errors.name?.message}
                required
                {...register("name")}
              />

              <FormTextareaField
                label="Description"
                placeholder="Provide a detailed description of the auth flow"
                rows={4}
                disabled={isLoading}
                error={errors.description?.message}
                required
                {...register("description")}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <FormSelectField
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

                {/* Client Selection */}
                <div className="space-y-2">
                  <Label>
                    Client <span className="text-destructive">*</span>
                  </Label>
                  <Controller
                    name="clientId"
                    control={control}
                    render={({ field }) => (
                      <Popover open={clientSearchOpen} onOpenChange={setClientSearchOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={clientSearchOpen}
                            className="w-full justify-between"
                            disabled={isLoading}
                          >
                            {selectedClient?.name || "Select client..."}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search clients..."
                              value={clientSearchValue}
                              onValueChange={setClientSearchValue}
                            />
                            <CommandList>
                              <CommandEmpty>No client found.</CommandEmpty>
                              <CommandGroup>
                                {clientsData?.rows?.map((client) => (
                                  <CommandItem
                                    key={client.client_id}
                                    value={client.client_id}
                                    onSelect={() => {
                                      field.onChange(client.client_id)
                                      setClientSearchOpen(false)
                                    }}
                                  >
                                    {client.name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                  {errors.clientId && (
                    <p className="text-sm text-destructive">{errors.clientId.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    The client that this auth flow belongs to
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
              <p className="text-sm text-muted-foreground">
                Configure auth flow behavior and settings
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Branding (optional) */}
              <FormSelectField
                label="Branding template"
                placeholder="Select branding"
                options={brandingOptions}
                value={brandingId}
                onValueChange={setBrandingId}
                disabled={isLoading}
                description="Optional — the branding applied to this flow's auth experience. Defaults to the tenant's active branding."
              />

              {/* Auto Approved */}
              <div className="flex items-start gap-3">
                <Checkbox
                  id="autoApproved"
                  checked={autoApproved}
                  onCheckedChange={(checked) => setAutoApproved(checked === true)}
                  disabled={isLoading}
                  className="mt-0.5"
                />
                <div className="flex flex-col">
                  <Label htmlFor="autoApproved" className="cursor-pointer">
                    Auto Approved
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically approve users after they complete this auth flow
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Roles */}
          <Card>
            <CardHeader>
              <CardTitle>Roles</CardTitle>
              <p className="text-sm text-muted-foreground">
                Optional — roles automatically assigned to users who complete this auth flow.
              </p>
            </CardHeader>
            <CardContent>
              {isLoadingRoles ? (
                <div className="py-6 text-center text-sm text-muted-foreground">Loading roles...</div>
              ) : roleOptions.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">No roles available</div>
              ) : (
                <div className="border rounded-md divide-y max-h-64 overflow-y-auto">
                  {roleOptions.map((role) => (
                    <SelectableOptionRow
                      key={role.role_id}
                      selected={selectedRoleIds.includes(role.role_id)}
                      onToggle={() => toggleRole(role.role_id)}
                      disabled={isLoading}
                      title={role.name}
                      description={role.description}
                    />
                  ))}
                </div>
              )}
              {selectedRoleIds.length > 0 && (
                <p className="mt-2 text-xs text-muted-foreground">
                  {selectedRoleIds.length} role{selectedRoleIds.length !== 1 ? "s" : ""} selected
                </p>
              )}
            </CardContent>
          </Card>

          {/* Callback URIs */}
          <Card>
            <CardHeader>
              <CardTitle>Callback URIs</CardTitle>
              <p className="text-sm text-muted-foreground">
                Optional — redirect URIs this flow may return to, chosen from the selected client's
                registered redirect URIs.
              </p>
            </CardHeader>
            <CardContent>
              {!clientId ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  Select a client first to choose its callback URIs.
                </div>
              ) : isLoadingUris ? (
                <div className="py-6 text-center text-sm text-muted-foreground">Loading URIs...</div>
              ) : redirectUris.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  This client has no registered redirect URIs.
                </div>
              ) : (
                <div className="border rounded-md divide-y max-h-64 overflow-y-auto">
                  {redirectUris.map((u) => (
                    <SelectableOptionRow
                      key={u.uri_id}
                      selected={selectedCallbackUriIds.includes(u.uri_id)}
                      onToggle={() => toggleCallback(u.uri_id)}
                      disabled={isLoading}
                      title={u.uri}
                      mono
                    />
                  ))}
                </div>
              )}
              {selectedCallbackUriIds.length > 0 && (
                <p className="mt-2 text-xs text-muted-foreground">
                  {selectedCallbackUriIds.length} URI
                  {selectedCallbackUriIds.length !== 1 ? "s" : ""} selected
                </p>
              )}
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
                    return (
                      <div key={field.id} className="flex gap-3 items-start">
                        <div className="flex-1 grid gap-3 md:grid-cols-2">
                          <Input
                            value={field.key}
                            onChange={(e) => updateCustomField(field.id, e.target.value, field.value)}
                            placeholder="Field name (e.g., require_email_verification)"
                            disabled={isLoading}
                          />
                          <Input
                            value={field.value}
                            onChange={(e) => updateCustomField(field.id, field.key, e.target.value)}
                            placeholder="Field value (e.g., true, false, or JSON)"
                            disabled={isLoading}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCustomField(field.id)}
                          disabled={isLoading}
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
                disabled={isLoading}
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
              submittingText="Saving..."
              submitText={isEditing ? "Update Auth Flow" : "Create Auth Flow"}
            />
          </div>
        </form>
      </div>
    </DetailsContainer>
  )
}
