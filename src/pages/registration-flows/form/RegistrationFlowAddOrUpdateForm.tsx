import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { ArrowLeft, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { DetailsContainer } from "@/components/container"
import { FormPageHeader } from "@/components/header"
import {
  FormTextareaField,
  FormSelectField,
  FormSwitchField,
  FormSubmitButton,
  type SelectOption
} from "@/components/form"
import { FormSlugField } from "@/components/inputs"
import { registrationFlowSchema, type RegistrationFlowFormData } from "@/lib/validations"
import {
  useRegistrationFlow,
  useCreateRegistrationFlow,
  useUpdateRegistrationFlow,
  useRegistrationFlowRoles,
} from "@/hooks/useRegistrationFlows"
import { useClients, useClient } from "@/hooks/useClients"
import { useRoles } from "@/hooks/useRoles"
import { useToast } from "@/hooks/useToast"
import { useUnsavedChangesGuard } from "@/hooks/useUnsavedChangesGuard"
import { ConfirmationDialog } from "@/components/dialog"
import { SelectableOptionRow } from "../components/SelectableOptionRow"

const STATUS_OPTIONS: SelectOption[] = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
]

const REGISTRATION_FIELDS = [
  { value: "email", label: "Email" },
  { value: "fullname", label: "Full name" },
  { value: "phone", label: "Phone" },
]

export default function RegistrationFlowAddOrUpdateForm() {
  const { registrationFlowId } = useParams<{ registrationFlowId?: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { showSuccess, showError, parseError } = useToast()

  const isEditing = Boolean(registrationFlowId)
  const isCreating = !isEditing

  const navState = location.state as { from?: string; backLabel?: string } | null
  const listingUrl = `/registration-flows`

  const { data: registrationFlow, isLoading: isFetchingRegistrationFlow } = useRegistrationFlow(registrationFlowId || "")
  const createRegistrationFlowMutation = useCreateRegistrationFlow()
  const updateRegistrationFlowMutation = useUpdateRegistrationFlow()

  const [clientSearchValue, setClientSearchValue] = useState("")
  const [clientSearchOpen, setClientSearchOpen] = useState(false)

  const { data: clientsData } = useClients({
    name: clientSearchValue || undefined,
    limit: 10,
    page: 1,
    sort_by: 'name',
    sort_order: 'asc',
  })

  const [verificationRequired, setVerificationRequired] = useState<boolean>(false)
  const [requiredFields, setRequiredFields] = useState<string[]>([])
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([])

  const { data: rolesData, isLoading: isLoadingRoles } = useRoles({
    page: 1,
    limit: 100,
    sort_by: "name",
    sort_order: "asc",
  })
  const roleOptions = rolesData?.rows ?? []

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<RegistrationFlowFormData>({
    resolver: yupResolver(registrationFlowSchema),
    defaultValues: {
      name: "",
      description: "",
      status: "active",
      clientId: "",
    },
    mode: "onTouched",
    reValidateMode: "onChange",
  })

  const selectedClientId = watch("clientId")
  const { data: selectedClientData } = useClient(selectedClientId || "")

  const { data: existingRolesData } = useRegistrationFlowRoles(registrationFlowId || "", { limit: 100 })

  const rolesInitialized = useRef(false)

  useEffect(() => {
    if (isEditing && registrationFlow) {
      reset({
        name: registrationFlow.name,
        description: registrationFlow.description,
        identifier: registrationFlow.identifier,
        status: registrationFlow.status,
        clientId: registrationFlow.client_id,
      })
    }
  }, [isEditing, registrationFlow, reset])

  useEffect(() => {
    if (isEditing && existingRolesData && !rolesInitialized.current) {
      rolesInitialized.current = true
      setSelectedRoleIds(existingRolesData.rows.map((r) => r.role_id))
      setVerificationRequired(registrationFlow?.verification_required ?? false)
    }
  }, [isEditing, existingRolesData, registrationFlow?.verification_required])

  const toggleRole = (id: string) =>
    setSelectedRoleIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  const isLoading =
    isFetchingRegistrationFlow ||
    createRegistrationFlowMutation.isPending ||
    updateRegistrationFlowMutation.isPending ||
    isSubmitting

  const existingFlow = registrationFlow
  const pageTitle = isCreating ? "Create Registration Flow" : `Edit ${existingFlow?.name || "Registration Flow"}`
  const submitButtonText = isCreating ? "Create Registration Flow" : "Update Registration Flow"

  const { guard, isPromptOpen, confirmLeave, cancelLeave } = useUnsavedChangesGuard(isDirty)

  const onSubmit = async (data: RegistrationFlowFormData) => {
    try {
      const requestData = {
        name: data.name,
        description: data.description,
        identifier: data.identifier || undefined,
        status: data.status,
        client_id: data.clientId,
        verification_required: verificationRequired,
        required_fields: requiredFields,
        role_ids: selectedRoleIds,
      }

      let flowId: string
      if (isEditing) {
        await updateRegistrationFlowMutation.mutateAsync({ registrationFlowId: registrationFlowId!, data: requestData })
        flowId = registrationFlowId!
      } else {
        const createdFlow = await createRegistrationFlowMutation.mutateAsync(requestData)
        flowId = createdFlow.registration_flow_id
      }

      showSuccess(isEditing ? "Registration flow updated successfully" : "Registration flow created successfully")
      navigate(`/registration-flows/${flowId}`)
    } catch (error) {
      const parsed = parseError(error)
      const known = ["name", "identifier", "description", "status", "clientId", "client_id"] as const
      let mappedToField = false
      if (parsed.fieldErrors) {
        for (const [field, message] of Object.entries(parsed.fieldErrors)) {
          if ((known as readonly string[]).includes(field)) {
            setError(field as (typeof known)[number], { type: "server", message })
            mappedToField = true
          }
        }
      }
      if (!mappedToField) {
        const lower = parsed.message.toLowerCase()
        const field = known.find((f) => lower.includes(f))
        if (field) {
          setError(field, { type: "server", message: parsed.message })
        }
      }
      showError(error)
    }
  }

  const selectedClient = clientsData?.rows?.find(
    client => client.client_id === selectedClientId
  ) || selectedClientData

  if (isEditing && isFetchingRegistrationFlow) {
    return (
      <DetailsContainer>
        <div className="flex flex-col gap-6">
          <FormPageHeader
            backUrl={`/registration-flows/${registrationFlowId}`}
            backLabel="Back to Registration"
            title="Edit Registration Flow"
            description="Update registration flow configuration and settings"
          />
          <Card>
            <CardContent className="space-y-4 pt-6">
              <Skeleton className="h-5 w-40" />
              <div className="grid gap-4 md:grid-cols-2">
                {Array.from({ length: 2 }).map((_, i) => (
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

  if (isEditing && !isFetchingRegistrationFlow && !registrationFlow) {
    return (
      <DetailsContainer>
        <div className="flex flex-col gap-6">
          <FormPageHeader
            backUrl={`/registration-flows/${registrationFlowId}`}
            backLabel="Back to Registration"
            title="Edit Registration Flow"
            description="Update registration flow configuration and settings"
          />
          <Card>
            <CardContent className="flex flex-col items-center justify-center gap-4 py-12 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <AlertCircle className="size-6" />
              </div>
              <div className="space-y-1">
                <h2 className="text-lg font-semibold">Registration flow not found</h2>
                <p className="text-sm text-muted-foreground">
                  The registration flow you're looking for doesn't exist or may have been removed.
                </p>
              </div>
              <Button variant="outline" onClick={() => guard(() => navigate(`/registration-flows`))}>
                <ArrowLeft className="mr-2 size-4" />
                Back to Registration
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
          backUrl={listingUrl}
          backLabel="Back to Registration"
          onBack={() => guard(() => navigate(listingUrl))}
          title={pageTitle}
          description={
            isCreating
              ? "Configure a new registration flow for user registration"
              : "Update registration flow configuration and settings"
          }
          showSystemBadge={existingFlow?.is_system}
          showWarning={existingFlow?.is_system}
          warningMessage="This is a system registration flow. Some settings may be restricted to prevent system instability."
        />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" key={registrationFlowId || "create"}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Basic Information</CardTitle>
              <p className="text-sm text-muted-foreground">
                The name, identifier, description, status, and associated client.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <FormSlugField
                  label="Name"
                  placeholder="e.g., seller-signup"
                  description="A descriptive name for this registration flow"
                  disabled={isLoading || existingFlow?.is_system}
                  error={errors.name?.message}
                  required
                  {...register("name")}
                />

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
              </div>

              <FormSlugField
                label="Identifier"
                placeholder="e.g., seller-flow (optional)"
                description="A stable, unique identifier for this flow. Auto-generated if left empty. Once set, it cannot be changed."
                disabled={isLoading || isEditing}
                error={errors.identifier?.message}
                {...register("identifier")}
              />

              <FormTextareaField
                label="Description"
                placeholder="Provide a detailed description of the registration flow"
                rows={4}
                disabled={isLoading}
                error={errors.description?.message}
                required
                {...register("description")}
              />

              <div className="grid gap-4 md:grid-cols-2">
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
                    The client that provides branding, context, and validated callback URIs for this flow. Selecting a client does not automatically activate this flow.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Configuration</CardTitle>
              <p className="text-sm text-muted-foreground">
                Configure registration flow behavior and settings
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormSwitchField
                id="verification-required"
                label="Require email verification"
                description="Require users to verify their email before completing onboarding, even when the tenant-wide policy is less strict."
                checked={verificationRequired}
                onCheckedChange={setVerificationRequired}
                disabled={isLoading}
                containerClassName="rounded-md border p-4"
              />

              <div className="space-y-3 rounded-md border p-4">
                <div>
                  <Label>Required registration fields</Label>
                  <p className="text-xs text-muted-foreground">
                    Username and password are always required. Select any additional fields this flow must collect.
                  </p>
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  {REGISTRATION_FIELDS.map((field) => (
                    <div key={field.value} className="flex items-center gap-2">
                      <Checkbox
                        id={`required-${field.value}`}
                        checked={requiredFields.includes(field.value)}
                        onCheckedChange={(checked) => {
                          setRequiredFields((current) => checked === true
                            ? [...new Set([...current, field.value])]
                            : current.filter((value) => value !== field.value))
                        }}
                        disabled={isLoading}
                      />
                      <Label htmlFor={`required-${field.value}`} className="cursor-pointer font-normal">
                        {field.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Roles</CardTitle>
              <p className="text-sm text-muted-foreground">
                Optional — roles automatically assigned to users who complete this registration flow.
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

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => guard(() => navigate(listingUrl))}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <FormSubmitButton
              isSubmitting={isLoading}
              submittingText="Saving..."
              submitText={submitButtonText}
              disabled={existingFlow?.is_system && isEditing}
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
