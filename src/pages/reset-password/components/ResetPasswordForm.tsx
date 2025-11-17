import { useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useNavigate, useSearchParams } from "react-router-dom"
import { FormLoginCard, FormSubmitButton, FormPasswordField } from "@/components/form"
import { FieldGroup } from "@/components/ui/field"
import { resetPasswordSchema, type ResetPasswordFormData } from "@/lib/validations"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/hooks/useToast"
import { CheckCircle2 } from "lucide-react"

const ResetPasswordForm = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { resetPassword } = useAuth()
  const { showSuccess, showError, parseError } = useToast()
  const [resetPasswordError, setResetPasswordError] = useState<string | null>(null)
  const [passwordReset, setPasswordReset] = useState(false)

  // Get query params
  const clientId = searchParams.get('client_id')
  const expires = searchParams.get('expires')
  const providerId = searchParams.get('provider_id')
  const sig = searchParams.get('sig')
  const token = searchParams.get('token')

  // Check if all required query params are present
  const hasValidParams = clientId && expires && providerId && sig && token

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ResetPasswordFormData>({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: ""
    },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit'
  })

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!hasValidParams) {
      setResetPasswordError("Invalid or expired reset link")
      return
    }

    setResetPasswordError(null)
    try {
      await resetPassword({
        password: { new_password: data.password },
        queryParams: {
          client_id: clientId!,
          expires: expires!,
          provider_id: providerId!,
          sig: sig!,
          token: token!
        }
      })
      setPasswordReset(true)
      showSuccess("Password has been reset successfully")
    } catch (error: any) {
      const parsedError = parseError(error)
      const errorMessage = parsedError.message || "Failed to reset password. Please try again."
      setResetPasswordError(errorMessage)
      showError(errorMessage)
    }
  }

  if (!hasValidParams) {
    return (
      <div className="flex flex-col gap-6">
        <FormLoginCard
          title="Invalid Reset Link"
          description="This password reset link is invalid or has expired"
        >
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                The password reset link you followed is invalid or has expired.
              </p>
              <p className="text-sm text-muted-foreground">
                Please request a new password reset link.
              </p>
            </div>
            <div className="pt-4 w-full space-y-2">
              <button
                onClick={() => navigate('/forgot-password')}
                className="flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Request New Reset Link
              </button>
              <button
                onClick={() => navigate('/login')}
                className="flex w-full items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
              >
                Back to Login
              </button>
            </div>
          </div>
        </FormLoginCard>
      </div>
    )
  }

  if (passwordReset) {
    return (
      <div className="flex flex-col gap-6">
        <FormLoginCard
          title="Password Reset Successful"
          description="Your password has been reset successfully"
        >
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="rounded-full bg-green-50 p-3">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                You can now log in with your new password.
              </p>
            </div>
            <div className="pt-4 w-full">
              <button
                onClick={() => navigate('/login')}
                className="flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Go to Login
              </button>
            </div>
          </div>
        </FormLoginCard>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <FormLoginCard
        title="Reset your password"
        description="Enter your new password below"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            {resetPasswordError && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {resetPasswordError}
              </div>
            )}
            <FormPasswordField
              label="New Password"
              placeholder="Enter your new password"
              disabled={isSubmitting}
              error={errors.password?.message}
              required
              {...register("password")}
            />
            <FormPasswordField
              label="Confirm Password"
              placeholder="Confirm your new password"
              disabled={isSubmitting}
              error={errors.confirmPassword?.message}
              required
              {...register("confirmPassword")}
            />
            <FormSubmitButton
              isSubmitting={isSubmitting}
              submitText="Reset Password"
              submittingText="Resetting..."
            />
          </FieldGroup>
        </form>
      </FormLoginCard>
    </div>
  )
}

export default ResetPasswordForm

