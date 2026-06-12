import { useState, useEffect } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { useForm, Controller, type Resolver, type SubmitHandler } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Plus, X, ArrowLeft, Copy, Check, AlertTriangle, Download, AlertCircle, KeyRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
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
import { useMetadataFields } from "@/hooks/useMetadataFields"
import type {
  CreateApiKeyRequest,
  UpdateApiKeyRequest,
  ApiKeyStatus
} from "@/services/api/api-keys/types"

const STATUS_OPTIONS: SelectOption[] = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "expired", label: "Expired", disabled: true },
]

export default function ApiKeyAddOrUpdateForm() {
  const { tenantId, id } = useParams<{ tenantId: string; id?: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { showSuccess, showError } = useToast()

  const isEditing = Boolean(id)
  const isCreating = !isEditing

  const navState = location.state as { from?: string; backLabel?: string } | null
  const backTo = navState?.from ?? (isEditing && id ? `/${tenantId}/api-keys/${id}` : `/${tenantId}/api-keys`)
  const backLabel = navState?.backLabel ?? (backTo === `/${tenantId}/api-keys` ? "Back to API Keys" : "Back")

  const {
    customFields,
    metadataError,
    addCustomField,
    removeCustomField,
    updateCustomField,
    buildPayload,
    resetFields,
  } = useMetadataFields()

  // Fetch existing API key if editing
  const { data: apiKeyData, isLoading: isFetchingApiKey } = useApiKey(id || '')
  const createApiKeyMutation = useCreateApiKey()
  const updateApiKeyMutation = useUpdateApiKey()

  // Fetch API key config if editing
  const { data: apiKeyConfigData } = useApiKeyConfig(id || '')

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
    resolver: yupResolver(apiKeySchema) as Resolver<ApiKeyFormData>,
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

  useEffect(() => {
    if (isEditing) {
      resetFields(apiKeyConfigData)
    }
  }, [isEditing, apiKeyConfigData, resetFields])

  const configError = metadataError.replace("metadata", "configuration")

  const onSubmit: SubmitHandler<ApiKeyFormData> = async (formData) => {
    // Check for duplicate keys in custom fields
    if (metadataError) {
      showError(configError)
      return
    }

    try {
      const config = buildPayload()

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
        const updatePayload: UpdateApiKeyRequest = {
          name: formData.name,
          description: formData.description,
          expires_at: expiresAt,
          rate_limit: formData.rateLimit,
          status: formData.status as ApiKeyStatus,
          config,
        }

        await updateApiKeyMutation.mutateAsync({ apiKeyId: id, data: updatePayload })
        showSuccess("API key updated successfully")
        navigate(backTo)
      } else {
        // Create payload
        const createPayload: CreateApiKeyRequest = {
          name: formData.name,
          description: formData.description,
          expires_at: expiresAt,
          rate_limit: formData.rateLimit,
          status: formData.status as ApiKeyStatus,
          config,
        }

        const response = await createApiKeyMutation.mutateAsync(createPayload)

        // Show the API key in a dialog (only shown once on creation)
        if (response.key) {
          setCreatedApiKey(response.key)
          setShowApiKeyDialog(true)
        } else {
          // Fallback if key is not in response
          showSuccess("API key created successfully")
          navigate(backTo)
        }
      }
    } catch (error: unknown) {
      showError(error)
    }
  }

  const handleCancel = () => {
    navigate(backTo)
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
    navigate(backTo)
  }

  const isLoading = isFetchingApiKey || createApiKeyMutation.isPending || updateApiKeyMutation.isPending

  const pageTitle = isCreating ? "Create API Key" : `Edit ${apiKeyData?.name || "API Key"}`
  const submitButtonText = isCreating ? "Create API Key" : "Update API Key"

  // Show loading state while fetching API key data
  if (isEditing && isFetchingApiKey) {
    return (
      <DetailsContainer>
        <div className="flex flex-col gap-6">
          <FormPageHeader
            backUrl={backTo}
            backLabel={backLabel}
            title="Edit API Key"
            description="Update API key access settings and configuration"
          />
          <Card className="shadow-xs">
            <CardContent className="space-y-4 pt-6">
              <Skeleton className="h-5 w-40" />
              <div className="grid gap-4 md:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        </div>
      </DetailsContainer>
    )
  }

  // Show error if API key not found
  if (isEditing && !isFetchingApiKey && !apiKeyData) {
    return (
      <DetailsContainer>
        <div className="flex flex-col gap-6">
          <FormPageHeader
            backUrl={backTo}
            backLabel={backLabel}
            title="Edit API Key"
            description="Update API key access settings and configuration"
          />
          <Card className="shadow-xs">
            <CardContent className="flex flex-col items-center justify-center gap-4 py-12 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <AlertCircle className="size-6" />
              </div>
              <div className="space-y-1">
                <h2 className="text-lg font-semibold">API key not found</h2>
                <p className="text-sm text-muted-foreground">
                  The API key you're looking for doesn't exist or may have been removed.
                </p>
              </div>
              <Button variant="outline" onClick={() => navigate(`/${tenantId}/api-keys`)}>
                <ArrowLeft className="mr-2 size-4" />
                Back to API Keys
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
          title={pageTitle}
          description={isEditing
            ? "Update API key access settings and configuration"
            : "Create a scoped API key for programmatic access"
          }
        />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" key={id || "create"}>
          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle className="text-base">Basic Information</CardTitle>
              <p className="text-sm text-muted-foreground">
                Name, status, expiration, and request limits for this key.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <FormInputField
                  label="Name"
                  placeholder="e.g., production-webhook"
                  description="Lowercase letters, numbers, and hyphens only"
                  disabled={isLoading}
                  error={errors.name?.message}
                  required
                  {...register("name")}
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
                      disabled={isLoading || apiKeyData?.status === "expired"}
                      error={errors.status?.message}
                      description={apiKeyData?.status === "expired" ? "Expired keys cannot be reactivated from this form" : undefined}
                      required
                    />
                  )}
                />
              </div>

              <FormTextareaField
                label="Description"
                placeholder="Describe where this key is used and who owns it"
                rows={4}
                disabled={isLoading}
                error={errors.description?.message}
                required
                {...register("description")}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormInputField
                  label="Rate Limit"
                  type="number"
                  min={1}
                  max={1000000}
                  placeholder="e.g., 1000"
                  description="Maximum requests per hour"
                  disabled={isLoading}
                  error={errors.rateLimit?.message}
                  required
                  {...register("rateLimit", { valueAsNumber: true })}
                />

                <FormInputField
                  label="Expiration Date"
                  type="date"
                  placeholder="Select expiration date"
                  description="Leave empty when the key should not expire"
                  disabled={isLoading}
                  error={errors.expiresAt?.message}
                  {...register("expiresAt")}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xs">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-base">Custom Configuration</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1.5">
                    Optional key-value pairs stored with this API key.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addCustomField}
                  disabled={isLoading}
                  className="h-9 shrink-0 gap-2"
                >
                  <Plus className="size-4" />
                  Add Field
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {configError && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  {configError}
                </div>
              )}

              {customFields.length === 0 ? (
                <div className="rounded-lg border border-dashed py-10 text-center">
                  <p className="text-sm text-muted-foreground">No custom configuration yet.</p>
                  <Button
                    type="button"
                    variant="link"
                    onClick={addCustomField}
                    disabled={isLoading}
                    className="h-auto p-0 text-sm"
                  >
                    Add your first field
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {customFields.map((field) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <Input
                        aria-label="Configuration key"
                        value={field.key}
                        onChange={(e) => updateCustomField(field.id, e.target.value, field.value)}
                        placeholder="Key (e.g., environment)"
                        disabled={isLoading}
                      />
                      <Input
                        aria-label="Configuration value"
                        value={field.value}
                        onChange={(e) => updateCustomField(field.id, field.key, e.target.value)}
                        placeholder="Value (e.g., production)"
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCustomField(field.id)}
                        disabled={isLoading}
                        className="size-9 shrink-0 p-0 text-muted-foreground"
                      >
                        <span className="sr-only">Remove field</span>
                        <X className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
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
              submitText={submitButtonText}
            />
          </div>
        </form>

        <Dialog
          open={showApiKeyDialog}
          onOpenChange={(open) => {
            if (open) setShowApiKeyDialog(true)
            else handleCloseApiKeyDialog()
          }}
        >
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <KeyRound className="size-5" />
                API Key Created
              </DialogTitle>
              <DialogDescription>
                Store this secret now. The full key is only returned once.
              </DialogDescription>
            </DialogHeader>

            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Secret value visible once</AlertTitle>
              <AlertDescription>
                Copy or download the key before leaving this dialog.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">API Key</label>
                <div className="grid gap-2 sm:grid-cols-[1fr_auto_auto]">
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
