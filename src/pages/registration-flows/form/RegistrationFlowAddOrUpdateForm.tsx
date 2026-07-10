import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { useForm, Controller, type Resolver } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { DetailsContainer } from "@/components/container"
import { FormPageHeader } from "@/components/header"
import {
  FormInputField,
  FormSwitchField,
  FormTextareaField,
  FormSelectField,
  FormSubmitButton,
  type SelectOption
} from "@/components/form"
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
import { SelectableOptionRow } from "../components/SelectableOptionRow"

// Backend only accepts active/inactive (DB CHECK enforces it) — no "draft".
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
  const { showSuccess, showError } = useToast()

  const isEditing = Boolean(registrationFlowId)

  const location = useLocation()
  const navState = (location.state || {}) as {
    from?: string
    backLabel?: string
  }

  // Fetch existing registration flow if editing
  const { isLoading: isFetchingRegistrationFlow } = useRegistrationFlow(registrationFlowId || '')
  const createRegistrationFlowMutation = useCreateRegistrationFlow()
  const updateRegistrationFlowMutation = useUpdateRegistrationFlow()

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
  const [verificationRequired, setVerificationRequired] = useState<boolean>(false)
  const [requiredFields, setRequiredFields] = useState<string[]>([])

  // Roles to auto-assign + callback URIs to attach (sent with create/update).
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([])

  const { data: rolesData, isLoading: isLoadingRoles } = useRoles({
    page: 1,
    limit: 100,
    sort_by: "name",
    sort_order: "asc",
  })
  const roleOptions = rolesData?.rows ?? []

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting }
  } = useForm<RegistrationFlowFormData>({
    resolver: yupResolver(registrationFlowSchema) as Resolver<RegistrationFlowFormData>,
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

  // Existing roles when editing (to diff on save).
  const { data: existingRolesData } = useRegistrationFlowRoles(registrationFlowId || "", { limit: 100 })

  // Initialize the selections from the existing data exactly once.
  const rolesInitialized = useRef(false)

  useEffect(() => {
    if (isEditing && existingRolesData && !rolesInitialized.current) {
      rolesInitialized.current = true
      setSelectedRoleIds(existingRolesData.rows.map((r) => r.role_id))
    }
  }, [isEditing, existingRolesData])

  const toggleRole = (id: string) =>
    setSelectedRoleIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

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
      showError(error)
    }
  }

  const handleCancel = () => {
    if (isEditing && registrationFlowId) {
      navigate(`/registration-flows/${registrationFlowId}`)
    } else {
      navigate(navState.from ?? `/registration-flows`)
    }
  }

  const isLoading = isFetchingRegistrationFlow || createRegistrationFlowMutation.isPending || updateRegistrationFlowMutation.isPending

  // Get selected client display name
  const selectedClient = clientsData?.rows?.find(
    client => client.client_id === control._formValues.clientId
  ) || selectedClientData

  // Show loading state while fetching
  if (isEditing && isFetchingRegistrationFlow) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Loading...</h2>
          <p className="text-muted-foreground mt-2">
            Fetching registration flow details
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
          backUrl={isEditing ? `/registration-flows/${registrationFlowId}` : navState.from ?? `/registration-flows`}
          backLabel={isEditing ? "Back to Registration" : navState.backLabel ?? "Back to Registration"}
          title={isEditing ? "Edit Registration Flow" : "Create New Registration Flow"}
          description={isEditing
            ? "Update registration flow configuration and settings"
            : "Configure a new registration flow for user registration"
          }
        />

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormInputField
                label="Name"
                placeholder="e.g., seller-signup"
                description="A descriptive name for this registration flow"
                disabled={isLoading}
                error={errors.name?.message}
                required
                {...register("name")}
              />

              <FormInputField
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
                    The client that provides branding, context, and validated callback URIs for this flow. Selecting a client does not automatically activate this flow.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configuration */}
          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
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

          {/* Roles */}
          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle>Roles</CardTitle>
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
              submitText={isEditing ? "Update Registration Flow" : "Create Registration Flow"}
            />
          </div>
        </form>
      </div>
    </DetailsContainer>
  )
}
