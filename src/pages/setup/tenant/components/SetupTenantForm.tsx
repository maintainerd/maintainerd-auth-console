import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { FieldGroup } from "@/components/ui/field"
import { FormInputField, FormSubmitButton } from "@/components/form"
import { setupTenantSchema, type SetupTenantFormData } from "@/lib/validations"
import { useSetupTenant } from "@/hooks/useSetup"

const SetupTenantForm = () => {
  const { isLoading, createTenantWithDefaults } = useSetupTenant()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SetupTenantFormData>({
    resolver: yupResolver(setupTenantSchema),
    mode: 'onChange',
    defaultValues: {
      name: "",
      display_name: "",
    }
  })

  const onSubmit = async (data: SetupTenantFormData) => {
    await createTenantWithDefaults(data.name, data.display_name, "")
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Create your tenant</h1>
        <p className="text-sm text-muted-foreground">
          Set up your organization to get started.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="[&_input]:h-11 [&_input]:rounded-lg [&_input]:bg-white [&_input:focus-visible]:border-blue-500 [&_input:focus-visible]:ring-blue-500/25"
      >
        <FieldGroup>
          <FormInputField
            label="Tenant Name"
            placeholder="e.g. my-org-1"
            disabled={isLoading}
            error={errors.name?.message}
            required
            {...register("name")}
          />
          <FormInputField
            label="Display Name"
            placeholder="e.g. My Organization"
            disabled={isLoading}
            error={errors.display_name?.message}
            required
            {...register("display_name")}
          />
          <FormSubmitButton
            isSubmitting={isLoading}
            submitText="Create Tenant"
            submittingText="Creating Tenant..."
            className="mt-1 h-11 w-full font-medium shadow-sm"
          />
        </FieldGroup>
      </form>
    </div>
  )
}

export default SetupTenantForm
