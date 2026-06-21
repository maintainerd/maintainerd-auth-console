import { useEffect, useState, useRef } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { Loader2, CheckCircle2, XCircle, Link2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { verifyMagicLink, fetchAccount } from "@/services/api/auth"
import { useTenant } from "@/hooks/useTenant"
import LoginLayout from "@/components/layout/LoginLayout"

export default function MagicLinkPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { fetchDefault, currentTenant } = useTenant()
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying")
  const [errorMessage, setErrorMessage] = useState("")
  const verifiedRef = useRef(false)

  useEffect(() => {
    if (!currentTenant) fetchDefault()
  }, [currentTenant, fetchDefault])

  useEffect(() => {
    if (verifiedRef.current) return
    const token = searchParams.get("token")
    const clientId = searchParams.get("client_id")

    if (!token || !clientId) {
      setStatus("error")
      setErrorMessage("Invalid magic link — missing required parameters.")
      return
    }

    const providerId = searchParams.get("provider_id") || undefined
    verifiedRef.current = true

    async function verify() {
      try {
        await verifyMagicLink(token!, clientId!, providerId)
        const account = await fetchAccount()
        const tenantIdentifier = account.tenant?.identifier || "default"
        setStatus("success")
        setTimeout(() => {
          window.location.href = `/${tenantIdentifier}/dashboard`
        }, 800)
      } catch (err) {
        setStatus("error")
        setErrorMessage(
          err instanceof Error ? err.message : "The magic link is invalid or has expired. Please request a new one."
        )
      }
    }

    verify()
  }, [searchParams])

  return (
    <LoginLayout branding={currentTenant?.branding}>
      <div className="mx-auto w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Magic Link</h1>
          <p className="text-sm text-muted-foreground">Signing you in securely</p>
        </div>

        <Card className="shadow-xs">
          <CardContent className="flex flex-col items-center justify-center gap-4 py-10 text-center">
            {status === "verifying" && (
              <>
                <Loader2 className="size-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Verifying your magic link...</p>
              </>
            )}

            {status === "success" && (
              <>
                <div className="flex size-10 items-center justify-center rounded-full bg-emerald-500/10">
                  <CheckCircle2 className="size-5 text-emerald-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Signed in successfully</p>
                  <p className="text-xs text-muted-foreground">Redirecting...</p>
                </div>
              </>
            )}

            {status === "error" && (
              <>
                <div className="flex size-10 items-center justify-center rounded-full bg-destructive/10">
                  <XCircle className="size-5 text-destructive" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Verification failed</p>
                  <p className="text-xs text-muted-foreground">{errorMessage}</p>
                </div>
                <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate("/login", { replace: true })}>
                  <Link2 className="size-4" />
                  Go to Login
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </LoginLayout>
  )
}
