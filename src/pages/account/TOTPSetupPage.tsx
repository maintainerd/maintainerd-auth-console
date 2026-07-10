import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Smartphone, ShieldCheck, RefreshCw, Copy, Download, EyeOff, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { ConfirmationDialog } from "@/components/dialog"
import { useToast } from "@/hooks/useToast"
import { beginTOTPEnrollment, finishTOTPEnrollment, disableTOTP, getBackupCodesCount, regenerateBackupCodes, fetchMFAStatus } from "@/services/api/mfa"
import QRCode from "qrcode"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

function QRCodeImage({ url }: { url: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, url, { width: 200, margin: 2 }, (err) => { if (err) console.warn("QR failed:", err) })
    }
  }, [url])
  return <canvas ref={canvasRef} />
}

export default function TOTPSetupPage() {
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({ queryKey: ["mfa", "status"], queryFn: fetchMFAStatus, retry: false })
  const enabled = data?.is_totp_enabled ?? false

  const [step, setStep] = useState<"idle" | "scan" | "verify">("idle")
  const [secret, setSecret] = useState("")
  const [qrUrl, setQrUrl] = useState("")
  const [code, setCode] = useState("")
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [showCodesModal, setShowCodesModal] = useState(false)
  const [codesRevealed, setCodesRevealed] = useState(false)
  const [returnToHubOnClose, setReturnToHubOnClose] = useState(false)
  const [showDisable, setShowDisable] = useState(false)

  const hub = `/account/mfa`

  const { data: codesData } = useQuery({
    queryKey: ["mfa", "backup-codes"],
    queryFn: getBackupCodesCount,
    retry: false,
    enabled,
  })
  const backupCount = codesData?.remaining ?? data?.backup_codes_count ?? 0

  const enrollMutation = useMutation({
    mutationFn: beginTOTPEnrollment,
    onSuccess: (res) => { setSecret(res.secret); setQrUrl(res.qr_code_url); setStep("scan") },
    onError: (e) => showError(e),
  })

  const verifyMutation = useMutation({
    mutationFn: (vars: { code: string }) => finishTOTPEnrollment(vars),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["mfa", "status"] })
      if (res.codes?.length) {
        setBackupCodes(res.codes)
        setCodesRevealed(false)
        setReturnToHubOnClose(true)
        setShowCodesModal(true)
      } else {
        showSuccess("Authenticator app enabled")
        navigate(hub)
      }
    },
    onError: (e) => showError(e),
  })

  const disableMutation = useMutation({
    mutationFn: disableTOTP,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mfa", "status"] })
      showSuccess("Authenticator app removed")
      navigate(hub)
    },
    onError: (e) => showError(e),
  })

  const regenerateMutation = useMutation({
    mutationFn: regenerateBackupCodes,
    onSuccess: (res) => {
      setBackupCodes(res.codes)
      setCodesRevealed(false)
      setReturnToHubOnClose(false)
      setShowCodesModal(true)
      queryClient.invalidateQueries({ queryKey: ["mfa", "backup-codes"] })
    },
    onError: (e) => showError(e),
  })

  const copyCodes = async () => {
    try {
      await navigator.clipboard.writeText(backupCodes.join("\n"))
      showSuccess("Codes copied to clipboard")
    } catch {
      showError("Couldn't copy codes to clipboard")
    }
  }

  const downloadCodes = () => {
    const blob = new Blob([backupCodes.join("\n")], { type: "text/plain" })
    const a = document.createElement("a")
    a.href = URL.createObjectURL(blob)
    a.download = "backup-codes.txt"
    a.click()
  }

  const handleCodesModalChange = (open: boolean) => {
    setShowCodesModal(open)
    if (!open && returnToHubOnClose) {
      showSuccess("Authenticator app enabled")
      navigate(hub)
    }
  }

  const backupCodesDialog = (
    <Dialog open={showCodesModal} onOpenChange={handleCodesModalChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Save your backup codes</DialogTitle>
          <DialogDescription>Store these somewhere safe. Each code works once, and you won't be able to see them again.</DialogDescription>
        </DialogHeader>

        {!codesRevealed ? (
          <div className="flex flex-col items-center gap-4 py-6">
            <EyeOff className="size-12 text-muted-foreground" />
            <p className="text-sm text-muted-foreground text-center">Backup codes are hidden for security. Reveal them only when you're ready to save them.</p>
            <Button onClick={() => setCodesRevealed(true)}>Reveal codes</Button>
          </div>
        ) : (
          <div className="font-mono text-sm bg-muted rounded-lg p-4 grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
            {backupCodes.map((c, i) => <span key={i}>{c}</span>)}
          </div>
        )}

        {codesRevealed && (
          <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-between">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={copyCodes}><Copy className="size-4 mr-2" />Copy</Button>
              <Button variant="outline" size="sm" onClick={downloadCodes}><Download className="size-4 mr-2" />Download</Button>
            </div>
            <Button size="sm" onClick={() => handleCodesModalChange(false)}>Done</Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )

  if (isLoading) return <Skeleton className="h-64 w-full rounded-xl" />

  // ── Manage (already enabled) ───────────────────────────────────
  if (enabled) {
    return (
      <div className="space-y-6">
        <Card className="shadow-xs">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-emerald-600">
                <ShieldCheck className="size-5" />
              </div>
              <div>
                <CardTitle className="text-base">Authenticator app is active</CardTitle>
                <CardDescription>Your authenticator app generates sign-in codes for this account.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="text-destructive hover:text-destructive" onClick={() => setShowDisable(true)} disabled={disableMutation.isPending}>
              <Trash2 className="size-4 mr-2" />
              Remove authenticator app
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted"><RefreshCw className="size-5 text-muted-foreground" /></div>
                <div>
                  <CardTitle className="text-base">Backup codes</CardTitle>
                  <CardDescription>{backupCount > 0 ? `${backupCount} unused code${backupCount !== 1 ? "s" : ""} remaining` : "No backup codes available"}</CardDescription>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => regenerateMutation.mutate()} disabled={regenerateMutation.isPending}>
                {regenerateMutation.isPending ? "Generating..." : "Regenerate"}
              </Button>
            </div>
          </CardHeader>
        </Card>

        <ConfirmationDialog
          open={showDisable}
          onOpenChange={setShowDisable}
          onConfirm={() => disableMutation.mutate()}
          title="Remove authenticator app"
          description="You'll no longer be asked for a code from your authenticator app. Your backup codes will also stop working."
          confirmText="Remove"
          variant="destructive"
          isLoading={disableMutation.isPending}
        />
        {backupCodesDialog}
      </div>
    )
  }

  // ── Setup wizard ───────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {step === "idle" && (
        <Card className="shadow-xs">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted"><Smartphone className="size-5 text-muted-foreground" /></div>
              <div>
                <CardTitle className="text-base">Set up authenticator app</CardTitle>
                <CardDescription>Works with Google Authenticator, Authy, 1Password, or any TOTP app.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="space-y-2 text-sm text-muted-foreground list-decimal pl-5">
              <li>Install an authenticator app on your phone if you don't have one.</li>
              <li>Scan the QR code we'll show you on the next step.</li>
              <li>Enter the 6-digit code from the app to confirm.</li>
            </ol>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => navigate(hub)}>Cancel</Button>
              <Button onClick={() => enrollMutation.mutate()} disabled={enrollMutation.isPending}>{enrollMutation.isPending ? "Preparing..." : "Begin setup"}</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === "scan" && (
        <Card className="shadow-xs">
          <CardHeader>
            <CardTitle className="text-base">Scan the QR code</CardTitle>
            <CardDescription>Open your authenticator app and scan this code, or enter the key manually.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center"><div className="rounded-lg border bg-white p-4"><QRCodeImage url={qrUrl} /></div></div>
            <div className="space-y-2">
              <Label>Manual entry key</Label>
              <div className="font-mono text-sm bg-muted rounded-md px-3 py-2 break-all select-all">{secret}</div>
            </div>
            <div className="flex justify-between gap-2">
              <Button variant="ghost" onClick={() => setStep("idle")}>Back</Button>
              <Button onClick={() => setStep("verify")}>I've scanned the code</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === "verify" && (
        <Card className="shadow-xs">
          <CardHeader>
            <CardTitle className="text-base">Enter verification code</CardTitle>
            <CardDescription>Enter the 6-digit code from your authenticator app.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="totp-code">Verification code</Label>
              <Input
                id="totp-code"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="000000"
                maxLength={6}
                className="font-mono tracking-[0.5em] text-center"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              />
            </div>
            <div className="flex justify-between gap-2">
              <Button variant="ghost" onClick={() => { setStep("scan"); setCode("") }}>Back</Button>
              <Button disabled={code.length !== 6 || verifyMutation.isPending} onClick={() => verifyMutation.mutate({ code })}>
                {verifyMutation.isPending ? "Verifying..." : "Verify & enable"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {backupCodesDialog}
    </div>
  )
}
