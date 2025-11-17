import { useState } from "react"
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
import { useToast } from "@/hooks/useToast"

const RegisterForm = () => {
  const navigate = useNavigate()
  const { register: registerUser } = useAuth()
  const { showSuccess } = useToast()
  const [registerError, setRegisterError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      confirmPassword: ""
    },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit'
  })

  const onSubmit = async (data: RegisterFormData) => {
    setRegisterError(null)
    try {
      await registerUser(
        data.fullname,
        data.email,
        data.password
      )

      showSuccess('Account created successfully! Please complete your profile.')
      navigate('/register/profile', { replace: true })
    } catch (error: any) {
      const errorMessage = error?.message || "Registration failed. Please try again."
      setRegisterError(errorMessage)
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
            {registerError && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {registerError}
              </div>
            )}
            <FormInputField
              label="Full Name"
              placeholder="John Doe"
              disabled={isSubmitting}
              error={errors.fullname?.message}
              required
              {...register("fullname")}
            />
            <FormInputField
              label="Email"
              type="email"
              placeholder="johndoe@example.com"
              disabled={isSubmitting}
              error={errors.email?.message}
              description="We'll use this to contact you. We will not share your email with anyone else."
              required
              {...register("email")}
            />
            <FormPasswordField
              label="Password"
              placeholder="Enter a strong password"
              disabled={isSubmitting}
              error={errors.password?.message}
              description="Must be at least 8 characters long."
              required
              {...register("password")}
            />
            <FormPasswordField
              label="Confirm Password"
              placeholder="Confirm your password"
              disabled={isSubmitting}
              error={errors.confirmPassword?.message}
              description="Please confirm your password."
              required
              {...register("confirmPassword")}
            />
            <FormSubmitButton
              isSubmitting={isSubmitting}
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
