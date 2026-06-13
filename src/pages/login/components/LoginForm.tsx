import { useState, useMemo } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { AlertCircle } from "lucide-react"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { FormInputField, FormPasswordField, FormSubmitButton } from "@/components/form"
import { buildLoginSchema, type LoginFormData } from "@/lib/validations"
import { useToast } from "@/hooks/useToast"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { useTenant } from "@/hooks/useTenant"
import { LoginMFAStep } from "./LoginMFAStep"

const LoginForm = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { getCurrentTenant } = useTenant()
  const { showSuccess } = useToast()
  const [loginError, setLoginError] = useState<string | null>(null)
  const [mfaChallenge, setMfaChallenge] = useState<{ token: string; methods: string[] } | null>(null)

  const currentTenant = getCurrentTenant()
  const loginSchema = useMemo(() => buildLoginSchema(currentTenant?.password_config), [currentTenant?.password_config])
  const showSignUp = currentTenant?.registration_config?.self_registration_enabled !== false

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

  // Shared post-login navigation for both password-only and MFA logins.
  const finishLogin = (requiresProfileSetup: boolean) => {
    if (requiresProfileSetup) {
      showSuccess("Login successful! Please complete your profile setup.")
      navigate('/register/profile', { replace: true })
      return
    }
    showSuccess("Login successful!")
    const currentTenant = getCurrentTenant()
    const tenantIdentifier = currentTenant?.identifier || 'default'
    navigate(`/${tenantIdentifier}/dashboard`, { replace: true })
  }

  const onSubmit = async (data: LoginFormData) => {
    setLoginError(null)
    try {
      const response = await login(data.email, data.password)
      // MFA enrolled — show the second step; the session is issued there.
      if (response.mfaRequired) {
        setMfaChallenge({ token: response.challengeToken ?? '', methods: response.allowedMethods ?? [] })
        return
      }
      finishLogin(response.requiresProfileSetup)
    } catch (err: unknown) {
      const errorMessage = (err instanceof Error ? err.message : (err as { message?: string })?.message) || "Invalid email or password"

      if (errorMessage === 'email is not verified') {
        localStorage.setItem('register_email', data.email)
        navigate('/email-verification', { replace: true })
        return
      }

      setLoginError(errorMessage)
    }
  }

  if (mfaChallenge) {
    return (
      <div className="flex flex-col gap-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Two-step verification</h1>
          <p className="text-sm text-muted-foreground">
            Confirm your second factor to finish signing in.
          </p>
        </div>
        <LoginMFAStep
          challengeToken={mfaChallenge.token}
          allowedMethods={mfaChallenge.methods}
          onVerified={(result) => finishLogin(result.requiresProfileSetup)}
          onCancel={() => setMfaChallenge(null)}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to your account to continue.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit(onSubmit)(e)
        }}
        // Scope the substantial input treatment to the login form so both the
        // email and password fields match without touching shared components.
        className="[&_input]:h-11 [&_input]:rounded-lg [&_input]:bg-white [&_input:focus-visible]:border-blue-500 [&_input:focus-visible]:ring-blue-500/25"
      >
        <FieldGroup>
          {loginError && (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
            >
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}
          <FormInputField
            label="Email"
            type="email"
            placeholder="you@company.com"
            autoComplete="email"
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
                className="ml-auto text-sm font-medium text-primary underline-offset-4 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <FormPasswordField
              id="password"
              label=""
              placeholder="Enter your password"
              autoComplete="current-password"
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
            submitText="Sign in"
            submittingText="Signing in..."
            className="mt-1 h-11 w-full font-medium shadow-sm"
          />
        </FieldGroup>
      </form>

      {showSignUp && (
      <div className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link to="/register" className="font-medium text-primary underline-offset-4 hover:underline">
          Sign up
        </Link>
      </div>
      )}
    </div>
  )
}

export default LoginForm