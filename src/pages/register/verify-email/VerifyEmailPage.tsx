import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import * as yup from 'yup'
import { yupResolver } from "@hookform/resolvers/yup"
import { AlertCircle, Mail, Loader2, CheckCircle } from "lucide-react"
import { FieldGroup } from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { FormInputField, FormSubmitButton } from "@/components/form"
import { post } from "@/services/api/client"
import LoginLayout from "@/components/layout/LoginLayout"
import { useTenant } from "@/hooks/useTenant"

const schema = yup.object({
  code: yup.string().required('Code is required').min(6).max(6),
})

type FormData = yup.InferType<typeof schema>

export default function VerifyEmailPage() {
  const navigate = useNavigate()
  const { currentTenant, fetchDefault } = useTenant()
  const [error, setError] = useState<string | null>(null)
  const [resending, setResending] = useState(false)
  const [verified, setVerified] = useState(false)

  const email = localStorage.getItem('register_email') || ''

  useEffect(() => {
    if (!currentTenant) fetchDefault()
  }, [currentTenant, fetchDefault])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: { code: "" },
  })

  const onSubmit = async (data: FormData) => {
    setError(null)
    try {
      await post('/email-verification/verify', { email, otp: data.code })
      setVerified(true)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Verification failed'
      setError(msg)
    }
  }

  const handleResend = async () => {
    setResending(true)
    try {
      await post('/email-verification/send', { email })
    } catch { /* fail silently */ }
    finally { setResending(false) }
  }

  if (verified) {
    return (
      <LoginLayout branding={currentTenant?.branding}>
        <div className="flex flex-col gap-8 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="flex size-14 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="size-7 text-green-600" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">Email verified</h1>
            <p className="text-sm text-muted-foreground max-w-xs">
              Your email has been confirmed. You can now sign in to your account.
            </p>
          </div>
          <Button className="h-11 w-full font-medium shadow-sm" onClick={() => navigate('/login', { replace: true })}>
            Sign in
          </Button>
        </div>
      </LoginLayout>
    )
  }

  return (
    <LoginLayout branding={currentTenant?.branding}>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-blue-100">
            <Mail className="size-7 text-blue-600" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Verify your email</h1>
          <p className="text-sm text-muted-foreground">
            Enter the code sent to <strong>{email || 'your email'}</strong>.
          </p>
        </div>

        {error && (
          <div role="alert" className="flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="[&_input]:h-11 [&_input]:rounded-lg [&_input]:bg-white [&_input:focus-visible]:border-blue-500 [&_input:focus-visible]:ring-blue-500/25"
        >
          <FieldGroup>
            <FormInputField
              label="Verification code"
              placeholder="000000"
              inputMode="numeric"
              autoComplete="one-time-code"
              disabled={isSubmitting}
              error={errors.code?.message}
              required
              className="font-mono tracking-[0.4em] text-center"
              {...register("code")}
            />
            <FormSubmitButton
              isSubmitting={isSubmitting}
              submitText="Verify email"
              submittingText="Verifying..."
              className="h-11 w-full font-medium shadow-sm"
            />
          </FieldGroup>
        </form>

        <div className="flex flex-col items-center gap-1">
          <Button variant="link" size="sm" onClick={handleResend} disabled={resending} className="text-muted-foreground">
            {resending ? <Loader2 className="mr-1 size-3 animate-spin" /> : null}
            Didn't receive a code? Resend
          </Button>
          <button type="button" onClick={() => navigate('/login')} className="text-sm text-muted-foreground underline-offset-4 hover:underline">
            Back to login
          </button>
        </div>
      </div>
    </LoginLayout>
  )
}
