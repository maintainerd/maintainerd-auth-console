import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { FormInputField, FormPasswordField, FormSubmitButton, FormLoginCard } from "@/components/form"
import { loginSchema, type LoginFormData } from "@/lib/validations"
import { useToast } from "@/hooks/useToast"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { useTenant } from "@/hooks/useTenant"

const LoginForm = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { getCurrentTenant } = useTenant()
  const { showError, showSuccess } = useToast()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await login(data.email, data.password)
      if (response.success) {
        if (response.requiresProfileSetup) {
          showSuccess("Login successful! Please complete your profile setup.")
          navigate('/register/profile', { replace: true })
        } else {
          showSuccess("Login successful!")
          const currentTenant = getCurrentTenant()
          const tenantIdentifier = currentTenant?.identifier || 'def4ult'
          const redirectPath = `/${tenantIdentifier}/dashboard`
          navigate(redirectPath, { replace: true })
        }
      } else {
        const errorMessage = response.message || "Invalid email or password"
        setError("root", {
          type: "manual",
          message: errorMessage
        })
        showError(errorMessage, "Login failed")
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || "An unexpected error occurred"
      setError("root", {
        type: "manual",
        message: errorMessage
      })
      showError(err, "Login failed")
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <FormLoginCard
        title="Login to your account"
        description="Enter your email below to login to your account"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            {errors.root && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {errors.root.message}
              </div>
            )}
            <FormInputField
              label="Email"
              type="email"
              placeholder="johndoe@example.com"
              disabled={isSubmitting}
              error={errors.email?.message}
              required
              {...register("email")}
            />
            <Field>
              <div className="flex items-center">
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Link
                  to="/forgot-password"
                  className="ml-auto text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <FormPasswordField
                id="password"
                label=""
                placeholder="Enter your password"
                disabled={isSubmitting}
                error={errors.password?.message}
                containerClassName="space-y-0"
                labelClassName="sr-only"
                required
                {...register("password")}
              />
            </Field>
            <FormSubmitButton
              isSubmitting={isSubmitting}
              submitText="Login"
              submittingText="Logging in..."
            />
            <div className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="underline-offset-4 hover:underline">
                Sign up
              </Link>
            </div>
          </FieldGroup>
        </form>
      </FormLoginCard>
    </div>
  )
}

export default LoginForm