import { useEffect, useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { Loader2, CheckCircle2, XCircle, Link2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { verifyMagicLink } from "@/services/api/auth"
import { useTenant } from "@/hooks/useTenant"
import LoginLayout from "@/components/layout/LoginLayout"

export default function MagicLinkPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { fetchDefault, currentTenant } = useTenant()
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying")
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    if (!currentTenant) fetchDefault()
  }, [currentTenant, fetchDefault])

  useEffect(() => {
    const token = searchParams.get("token")
    const clientId = searchParams.get("client_id")
    const providerId = searchParams.get("provider_id")

    if (!token || !clientId || !providerId) {
      setStatus("error")
      setErrorMessage("Invalid magic link — missing required parameters.")
      return
    }

    let cancelled = false

    async function verify() {
      try {
        await verifyMagicLink(token!, clientId!, providerId!)
        if (cancelled) return
        setStatus("success")
        setTimeout(() => {
          window.location.href = "/"
        }, 1000)
      } catch (err) {
        if (cancelled) return
        setStatus("error")
        setErrorMessage(
          err instanceof Error ? err.message : "The magic link is invalid or has expired. Please request a new one."
        )
      }
    }

    verify()
    return () => { cancelled = true }
  }, [searchParams])

  return (
    <LoginLayout branding={currentTenant?.branding}>
      <Card className="w-full max-w-md mx-auto shadow-xs">
        <CardContent className="flex flex-col items-center justify-center gap-4 py-12 text-center">
          {status === "verifying" && (
            <>
              <Loader2 className="size-10 animate-spin text-primary" />
              <div className="space-y-1">
                <h2 className="text-lg font-semibold">Verifying your magic link</h2>
                <p className="text-sm text-muted-foreground">Please wait while we sign you in...</p>
              </div>
            </>
          )}

          {status === "success" && (
            <>
              <div className="flex size-12 items-center justify-center rounded-full bg-emerald-500/10">
                <CheckCircle2 className="size-6 text-emerald-600" />
              </div>
              <div className="space-y-1">
                <h2 className="text-lg font-semibold">Signed in successfully</h2>
                <p className="text-sm text-muted-foreground">Redirecting you now...</p>
              </div>
            </>
          )}

          {status === "error" && (
            <>
              <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
                <XCircle className="size-6 text-destructive" />
              </div>
              <div className="space-y-1">
                <h2 className="text-lg font-semibold">Magic link failed</h2>
                <p className="text-sm text-muted-foreground">{errorMessage}</p>
              </div>
              <Button variant="outline" className="gap-2" onClick={() => navigate("/login", { replace: true })}>
                <Link2 className="size-4" />
                Go to Login
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </LoginLayout>
  )
}
