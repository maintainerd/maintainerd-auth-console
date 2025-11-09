import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { FieldGroup } from "@/components/ui/field"
import { FormInputField, FormPasswordField, FormSubmitButton, FormLoginCard } from "@/components/form"
import { useNavigate } from "react-router-dom"
import { setupService } from "@/services"
import { setupAdminSchema, type SetupAdminFormData } from "@/lib/validations"
import { useToast } from "@/hooks/useToast"

const SetupAdminForm = () => {
  const navigate = useNavigate()
  const { showError, showSuccess } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
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
    try {
      await setupService.createAdmin({
        username: data.email,
        fullname: data.fullname,
        password: data.password,
        email: data.email
      })
      showSuccess("Admin account created successfully!")
      navigate("/setup/profile")
    } catch (err) {
      showError(err, "Failed to create admin account")
    }
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
              disabled={isSubmitting}
              error={errors.fullname?.message}
              required
              {...register("fullname")}
            />
            <FormInputField
              label="Email Address"
              type="email"
              placeholder="admin@acme.com"
              disabled={isSubmitting}
              error={errors.email?.message}
              description="This will be used as your username"
              required
              {...register("email")}
            />
            <FormPasswordField
              label="Password"
              placeholder="Enter a strong password"
              disabled={isSubmitting}
              error={errors.password?.message}
              description="Must contain uppercase, lowercase, number, and special character"
              required
              {...register("password")}
            />
            <FormPasswordField
              label="Confirm Password"
              placeholder="Confirm your password"
              disabled={isSubmitting}
              error={errors.confirmPassword?.message}
              description="Please confirm your password"
              required
              {...register("confirmPassword")}
            />
            <FormSubmitButton
              isSubmitting={isSubmitting}
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
