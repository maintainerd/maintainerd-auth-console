import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useNavigate } from "react-router-dom"
import { FormLoginCard, FormSubmitButton, FormInputField, FormPasswordField } from "@/components/form"
import {
  Field,
  FieldDescription,
  FieldGroup,
} from "@/components/ui/field"
import { Link } from "react-router-dom"
import { registerSchema, type RegisterFormData } from "@/lib/validations"
import { useAuth } from "@/hooks/useAuth"

const RegisterForm = () => {
  const navigate = useNavigate()
  const { register: registerUser, isLoading } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const result = await registerUser(
        data.fullname,
        data.email,
        data.password
      )

      if (result.success) {
        // Success is handled by useAuth (shows toast)
        // Navigate to register profile page (dedicated for register flow)
        navigate('/register/profile', { replace: true })
      } else {
        // Set form-level error if registration fails
        setError("root", {
          type: "manual",
          message: result.message || "Registration failed"
        })
      }
    } catch (error: any) {
      setError("root", {
        type: "manual",
        message: error?.message || "An unexpected error occurred"
      })
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <FormLoginCard
        title="Create your account"
        description="Enter your email below to create your account"
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
              label="Email"
              type="email"
              placeholder="johndoe@example.com"
              disabled={isLoading}
              error={errors.email?.message}
              description="We'll use this to contact you. We will not share your email with anyone else."
              required
              {...register("email")}
            />
            <FormPasswordField
              label="Password"
              placeholder="Enter a strong password"
              disabled={isLoading}
              error={errors.password?.message}
              description="Must be at least 8 characters long."
              required
              {...register("password")}
            />
            <FormPasswordField
              label="Confirm Password"
              placeholder="Confirm your password"
              disabled={isLoading}
              error={errors.confirmPassword?.message}
              description="Please confirm your password."
              required
              {...register("confirmPassword")}
            />
            {errors.root && (
              <div className="text-sm text-red-600 text-center">
                {errors.root.message}
              </div>
            )}
            <FormSubmitButton
              isSubmitting={isLoading}
              submitText="Create Account"
              submittingText="Creating Account..."
            />
            <Field>
              <FieldDescription className="text-center">
                Already have an account? <Link to="/login">Sign in</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </FormLoginCard>
    </div>
  )
}

export default RegisterForm;
