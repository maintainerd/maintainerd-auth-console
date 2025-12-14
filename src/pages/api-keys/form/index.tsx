import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Plus, X, ArrowLeft, Copy, Check, AlertTriangle, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DetailsContainer } from "@/components/container"
import { FormPageHeader } from "@/components/header"
import {
  FormInputField,
  FormTextareaField,
  FormSelectField,
  FormSubmitButton,
  type SelectOption
} from "@/components/form"
import { apiKeySchema, type ApiKeyFormData } from "@/lib/validations"
import { useApiKey, useCreateApiKey, useUpdateApiKey, useApiKeyConfig } from "@/hooks/useApiKeys"
import { useToast } from "@/hooks/useToast"
import type {
  CreateApiKeyRequestInterface,
  UpdateApiKeyRequestInterface,
  ApiKeyStatusType
} from "@/services/api/api-key/types"

const STATUS_OPTIONS: SelectOption[] = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
]

export default function ApiKeyAddOrUpdateForm() {
  const { tenantId, id } = useParams<{ tenantId: string; id?: string }>()
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()

  const isEditing = Boolean(id)

  // Fetch existing API key if editing
  const { data: apiKeyData, isLoading: isFetchingApiKey } = useApiKey(id || '')
  const createApiKeyMutation = useCreateApiKey()
  const updateApiKeyMutation = useUpdateApiKey()

  // Fetch API key config if editing
  const { data: apiKeyConfigData } = useApiKeyConfig(id || '')

  // Custom config fields state
  const [customFields, setCustomFields] = useState<Array<{ key: string; value: string; id: string }>>([])
  const [configError, setConfigError] = useState<string>("")

  // API key display state (only shown after creation)
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false)
  const [createdApiKey, setCreatedApiKey] = useState<string>("")
  const [isCopied, setIsCopied] = useState(false)

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ApiKeyFormData>({
    // @ts-expect-error - Yup resolver type inference issue with optional nullable fields
    resolver: yupResolver(apiKeySchema),
    defaultValues: {
      name: "",
      description: "",
      expiresAt: null,
      rateLimit: 1000,
      status: "active",
    },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit'
  })

  // Load existing API key data if editing
  useEffect(() => {
    if (isEditing && apiKeyData) {
      // Convert ISO date to YYYY-MM-DD format for date input
      let expiresAtDate: string | null = null
      if (apiKeyData.expires_at) {
        const date = new Date(apiKeyData.expires_at)
        expiresAtDate = date.toISOString().split('T')[0]
      }

      reset({
        name: apiKeyData.name,
        description: apiKeyData.description,
        expiresAt: expiresAtDate,
        rateLimit: apiKeyData.rate_limit,
        status: apiKeyData.status,
      })
    }
  }, [isEditing, apiKeyData, reset])

  // Load config fields when editing
  useEffect(() => {
    if (isEditing && apiKeyConfigData) {
      // API returns config directly, not wrapped in a config property
      const config = apiKeyConfigData

      // Load custom configuration fields
      const customConfigEntries = Object.entries(config).map(([key, value], index) => ({
        id: `custom-${Date.now()}-${index}`,
        key,
        value: String(value)
      }))

      setCustomFields(customConfigEntries)
    }
  }, [isEditing, apiKeyConfigData])

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

  const onSubmit = async (formData: ApiKeyFormData) => {
    // Check for duplicate keys in custom fields
    if (configError) {
      showError(configError)
      return
    }

    try {
      // Build config object from custom fields
      const config: Record<string, string> = {}
      customFields.forEach(field => {
        if (field.key.trim()) {
          config[field.key] = field.value
        }
      })

      // Convert date to ISO 8601 format with time if provided
      let expiresAt: string | null = null
      if (formData.expiresAt) {
        // Convert YYYY-MM-DD to YYYY-MM-DDTHH:mm:ssZ (end of day UTC)
        const date = new Date(formData.expiresAt)
        date.setUTCHours(23, 59, 59, 999)
        expiresAt = date.toISOString()
      }

      if (isEditing && id) {
        // Update payload
        const updatePayload: UpdateApiKeyRequestInterface = {
          name: formData.name,
          description: formData.description,
          expires_at: expiresAt,
          rate_limit: formData.rateLimit,
          status: formData.status as ApiKeyStatusType,
          config: Object.keys(config).length > 0 ? config : undefined,
        }

        await updateApiKeyMutation.mutateAsync({ apiKeyId: id, data: updatePayload })
        showSuccess("API key updated successfully")
        navigate(`/${tenantId}/api-keys/${id}`)
      } else {
        // Create payload
        const createPayload: CreateApiKeyRequestInterface = {
          name: formData.name,
          description: formData.description,
          expires_at: expiresAt,
          rate_limit: formData.rateLimit,
          status: formData.status as ApiKeyStatusType,
          config: Object.keys(config).length > 0 ? config : undefined,
        }

        const response = await createApiKeyMutation.mutateAsync(createPayload)

        // Show the API key in a dialog (only shown once on creation)
        if (response.key) {
          setCreatedApiKey(response.key)
          setShowApiKeyDialog(true)
        } else {
          // Fallback if key is not in response
          showSuccess("API key created successfully")
          navigate(`/${tenantId}/api-keys`)
        }
      }
    } catch (error: unknown) {
      showError(error)
    }
  }

  const handleCancel = () => {
    if (isEditing && id) {
      navigate(`/${tenantId}/api-keys/${id}`)
    } else {
      navigate(`/${tenantId}/api-keys`)
    }
  }

  const handleCopyApiKey = async () => {
    try {
      await navigator.clipboard.writeText(createdApiKey)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch {
      showError("Failed to copy API key to clipboard")
    }
  }

  const handleDownloadApiKey = () => {
    try {
      const blob = new Blob([createdApiKey], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `api-key-${Date.now()}.txt`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      showSuccess("API key downloaded successfully")
    } catch {
      showError("Failed to download API key")
    }
  }

  const handleCloseApiKeyDialog = () => {
    setShowApiKeyDialog(false)
    navigate(`/${tenantId}/api-keys`)
  }

  const isLoading = isFetchingApiKey || createApiKeyMutation.isPending || updateApiKeyMutation.isPending

  // Show loading state while fetching API key data
  if (isEditing && isFetchingApiKey) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Loading...</h2>
          <p className="text-muted-foreground mt-2">
            Fetching API key details
          </p>
        </div>
      </div>
    )
  }

  // Show error if API key not found
  if (isEditing && !isFetchingApiKey && !apiKeyData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">API Key Not Found</h2>
          <p className="text-muted-foreground mt-2">
            The API key you're looking for doesn't exist or has been removed.
          </p>
        </div>
        <Button onClick={() => navigate(`/${tenantId}/api-keys`)} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to API Keys
        </Button>
      </div>
    )
  }

  return (
    <DetailsContainer>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <FormPageHeader
          backUrl={isEditing ? `/${tenantId}/api-keys/${id}` : `/${tenantId}/api-keys`}
          backLabel="Back to API Keys"
          title={isEditing ? "Edit API Key" : "Create New API Key"}
          description={isEditing
            ? "Update API key configuration and settings"
            : "Create a new API key for programmatic access to your authentication system"
          }
        />

        {/* Form */}
        {/* @ts-expect-error - Form type inference issue */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormInputField
                label="Name"
                placeholder="e.g., api-key1, production-key"
                description="Lowercase letters, numbers, and hyphens only"
                disabled={isLoading}
                error={errors.name?.message}
                required
                {...register("name")}
              />

              <FormTextareaField
                label="Description"
                placeholder="Enter API key description"
                rows={3}
                disabled={isLoading}
                error={errors.description?.message}
                required
                {...register("description")}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormInputField
                  label="Rate Limit (requests/hour)"
                  type="number"
                  placeholder="e.g., 1000"
                  description="Maximum number of requests per hour"
                  disabled={isLoading}
                  error={errors.rateLimit?.message}
                  required
                  {...register("rateLimit")}
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
                label="Expiration Date"
                type="date"
                placeholder="Select expiration date"
                description="Leave empty for no expiration"
                disabled={isLoading}
                error={errors.expiresAt?.message}
                {...register("expiresAt")}
              />
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
                  {customFields.map((field) => (
                    <div key={field.id} className="flex gap-3 items-start">
                      <div className="flex-1 grid gap-3 md:grid-cols-2">
                        <Input
                          value={field.key}
                          onChange={(e) => updateCustomField(field.id, e.target.value, field.value)}
                          placeholder="Field name (e.g., environment, application)"
                          disabled={isLoading}
                        />
                        <Input
                          value={field.value}
                          onChange={(e) => updateCustomField(field.id, field.key, e.target.value)}
                          placeholder="Field value"
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
                  ))}
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
              submitText={isEditing ? "Update API Key" : "Create API Key"}
            />
          </div>
        </form>

        {/* API Key Display Dialog - Only shown after creation */}
        <Dialog open={showApiKeyDialog} onOpenChange={setShowApiKeyDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>API Key Created Successfully</DialogTitle>
              <DialogDescription>
                Your API key has been created. Make sure to copy it now as you won't be able to see it again.
              </DialogDescription>
            </DialogHeader>

            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This is the only time you will see the full API key. Make sure to copy and store it securely.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">API Key</label>
                <div className="flex gap-2">
                  <Input
                    value={createdApiKey}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCopyApiKey}
                    className="shrink-0"
                  >
                    {isCopied ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadApiKey}
                    className="shrink-0"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleCloseApiKeyDialog}>
                I've Saved My API Key
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DetailsContainer>
  )
}
