import { useState } from "react"
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
  const { showSuccess } = useToast()
  const [loginError, setLoginError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit'
  })

  const onSubmit = async (data: LoginFormData) => {
    setLoginError(null)
    try {
      const response = await login(data.email, data.password)
      if (response.requiresProfileSetup) {
				showSuccess("Login successful! Please complete your profile setup.")
				navigate('/register/profile', { replace: true })
			} else {
				showSuccess("Login successful!")
				const currentTenant = getCurrentTenant()
				const tenantIdentifier = currentTenant?.identifier || 'default'
				const redirectPath = `/${tenantIdentifier}/dashboard`
				navigate(redirectPath, { replace: true })
			}
    } catch (err: any) {
      const errorMessage = err?.message || "Invalid email or password"
      setLoginError(errorMessage)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <FormLoginCard
        title="Login to your account"
        description="Enter your email below to login to your account"
      >
        <form onSubmit={(e) => {
          e.preventDefault()
          handleSubmit(onSubmit)(e)
        }}>
          <FieldGroup>
            {loginError && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {loginError}
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
                <FieldLabel htmlFor="password">
                  Password
                  <span className="text-red-500 ml-1">*</span>
                </FieldLabel>
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