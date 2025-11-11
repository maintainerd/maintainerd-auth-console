import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { FieldGroup } from "@/components/ui/field"
import { FormInputField, FormPasswordField, FormSubmitButton, FormLoginCard } from "@/components/form"
import { setupAdminSchema, type SetupAdminFormData } from "@/lib/validations"
import { useSetupAdmin } from "@/hooks/useSetup"

const SetupAdminForm = () => {
  const { isLoading, createAdminAccount } = useSetupAdmin()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SetupAdminFormData>({
    resolver: yupResolver(setupAdminSchema),
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  })

  const onSubmit = async (data: SetupAdminFormData) => {
    await createAdminAccount({
      fullname: data.fullname,
      email: data.email,
      password: data.password
    })
  }
	
  return (
    <div className="flex flex-col gap-6">
      <FormLoginCard
        title="Create Admin Account"
        description="Create your administrator account to complete the setup"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <FormInputField
              label="Full Name"
              placeholder="John Doe"
              disabled={isLoading}
              error={errors.fullname?.message}
              required
              {...register("fullname")}
            />
            <FormInputField
              label="Email Address"
              type="email"
              placeholder="admin@acme.com"
              disabled={isLoading}
              error={errors.email?.message}
              description="This will be used as your username"
              required
              {...register("email")}
            />
            <FormPasswordField
              label="Password"
              placeholder="Enter a strong password"
              disabled={isLoading}
              error={errors.password?.message}
              description="Must contain uppercase, lowercase, number, and special character"
              required
              {...register("password")}
            />
            <FormPasswordField
              label="Confirm Password"
              placeholder="Confirm your password"
              disabled={isLoading}
              error={errors.confirmPassword?.message}
              description="Please confirm your password"
              required
              {...register("confirmPassword")}
            />
            <FormSubmitButton
              isSubmitting={isLoading}
              submitText="Complete Setup"
              submittingText="Creating Admin..."
            />
          </FieldGroup>
        </form>
      </FormLoginCard>
    </div>
  )
}

export default SetupAdminForm;
