
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { FieldGroup } from "@/components/ui/field"
import { FormInputField, FormTextareaField, FormSubmitButton, FormLoginCard } from "@/components/form"
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
    defaultValues: {
      name: "",
      display_name: "",
      description: ""
    }
  })

  const onSubmit = async (data: SetupTenantFormData) => {
    await createTenantWithDefaults(data.name, data.display_name, data.description)
  }

  return (
    <div className="flex flex-col gap-6">
      <FormLoginCard
        title="Setup Tenant"
        description="Enter your tenant details below to create your tenant"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <FormInputField
              label="Tenant Name"
              placeholder="e.g. org-1"
              disabled={isLoading}
              error={errors.name?.message}
              required
              {...register("name")}
            />
            <FormInputField
              label="Display Name"
              placeholder="e.g. Organization 1"
              disabled={isLoading}
              error={errors.display_name?.message}
              required
              {...register("display_name")}
            />
            <FormTextareaField
              label="Description"
              placeholder="Brief description of your tenant"
              rows={2}
              disabled={isLoading}
              error={errors.description?.message}
              required
              {...register("description")}
            />
            <FormSubmitButton
              isSubmitting={isLoading}
              submitText="Create Tenant"
              submittingText="Creating Tenant..."
            />
          </FieldGroup>
        </form>
      </FormLoginCard>
    </div>
  )
}

export default SetupTenantForm;
