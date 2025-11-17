import { useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { FormLoginCard, FormSubmitButton, FormInputField } from "@/components/form"
import { FieldGroup } from "@/components/ui/field"
import { Link } from "react-router-dom"
import { forgotPasswordSchema, type ForgotPasswordFormData } from "@/lib/validations"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/hooks/useToast"
import { CheckCircle2 } from "lucide-react"

const ForgotPasswordForm = () => {
  const { forgotPassword } = useAuth()
  const { showSuccess, showError, parseError } = useToast()
  const [forgotPasswordError, setForgotPasswordError] = useState<string | null>(null)
  const [emailSent, setEmailSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: {
      email: ""
    },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit'
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setForgotPasswordError(null)
    try {
      await forgotPassword(data.email)
      setEmailSent(true)
      showSuccess("Password reset instructions have been sent to your email")
    } catch (error: any) {
      const parsedError = parseError(error)
      const errorMessage = parsedError.message || "Failed to send reset email. Please try again."
      setForgotPasswordError(errorMessage)
      showError(errorMessage)
    }
  }

  if (emailSent) {
    return (
      <div className="flex flex-col gap-6">
        <FormLoginCard
          title="Check your email"
          description="We've sent password reset instructions to your email"
        >
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="rounded-full bg-green-50 p-3">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                If an account exists with this email, you will receive password reset instructions shortly.
              </p>
              <p className="text-sm text-muted-foreground">
                Please check your inbox and spam folder.
              </p>
            </div>
            <div className="pt-4 w-full">
              <Link
                to="/login"
                className="flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </FormLoginCard>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <FormLoginCard
        title="Forgot your password?"
        description="Enter your email address and we'll send you instructions to reset your password"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            {forgotPasswordError && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {forgotPasswordError}
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
            <FormSubmitButton
              isSubmitting={isSubmitting}
              submitText="Send Reset Instructions"
              submittingText="Sending..."
            />
            <div className="text-center text-sm text-muted-foreground">
              Remember your password?{" "}
              <Link to="/login" className="underline-offset-4 hover:underline">
                Back to Login
              </Link>
            </div>
          </FieldGroup>
        </form>
      </FormLoginCard>
    </div>
  )
}

export default ForgotPasswordForm

