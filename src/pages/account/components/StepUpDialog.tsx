import { useEffect, useState } from "react"
import { ShieldCheck, Smartphone, MessageSquare, KeyRound } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/useToast"
import { issueStepUpChallenge, sendStepUpSMS, verifyStepUp } from "@/services/api/mfa"
import { useMutation } from "@tanstack/react-query"

const METHOD_META: Record<string, { label: string; icon: LucideIcon; numeric: boolean }> = {
  totp: { label: "Authenticator app", icon: Smartphone, numeric: true },
  sms: { label: "Text message", icon: MessageSquare, numeric: true },
  backup_code: { label: "Backup code", icon: KeyRound, numeric: false },
}

interface StepUpDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Called with an elevated (acr=2) access token once verification succeeds. */
  onVerified: (accessToken: string) => void
  title?: string
  description?: string
}

/**
 * Prompts the user to re-confirm their identity with a second factor and returns
 * an elevated access token. Used to gate sensitive actions (delete account,
 * revoke all sessions) that the backend protects with step-up (acr=2).
 */
export function StepUpDialog({ open, onOpenChange, onVerified, title, description }: StepUpDialogProps) {
  const { showError } = useToast()
  const [challengeToken, setChallengeToken] = useState("")
  const [methods, setMethods] = useState<string[]>([])
  const [method, setMethod] = useState("")
  const [code, setCode] = useState("")
  const [smsSent, setSmsSent] = useState(false)

  const challengeMutation = useMutation({
    mutationFn: issueStepUpChallenge,
    onSuccess: (res) => {
      const allowed = res.allowed_methods?.filter((m) => METHOD_META[m]) ?? []
      setChallengeToken(res.challenge_token)
      setMethods(allowed)
      setMethod(allowed[0] ?? "")
    },
    onError: (e) => { showError(e); onOpenChange(false) },
  })

  const smsMutation = useMutation({
    mutationFn: sendStepUpSMS,
    onSuccess: () => setSmsSent(true),
    onError: (e) => showError(e),
  })

  const verifyMutation = useMutation({
    mutationFn: () => verifyStepUp(challengeToken, method, code.trim()),
    onSuccess: (res) => { onVerified(res.access_token); onOpenChange(false) },
    onError: (e) => showError(e),
  })

  // Reset and request a fresh challenge each time the dialog opens.
  useEffect(() => {
    if (open) {
      setChallengeToken(""); setMethods([]); setMethod(""); setCode(""); setSmsSent(false)
      challengeMutation.mutate()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const meta = METHOD_META[method]
  const numeric = meta?.numeric ?? false

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="size-5 text-muted-foreground" />
            {title ?? "Confirm it's you"}
          </DialogTitle>
          <DialogDescription>
            {description ?? "This is a sensitive action. Verify with a second factor to continue."}
          </DialogDescription>
        </DialogHeader>

        {challengeMutation.isPending ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Preparing verification…</p>
        ) : methods.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No second factor is available on your account. Set up MFA first to perform this action.
          </p>
        ) : (
          <div className="space-y-4">
            {methods.length > 1 && (
              <div className="space-y-2">
                <Label>Verification method</Label>
                <div className="grid gap-2">
                  {methods.map((m) => {
                    const Icon = METHOD_META[m].icon
                    const selected = m === method
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => { setMethod(m); setCode(""); setSmsSent(false) }}
                        className={cn(
                          "flex items-center gap-3 rounded-lg border p-3 text-left text-sm transition-colors",
                          selected ? "border-primary bg-accent" : "hover:bg-accent/50",
                        )}
                      >
                        <Icon className="size-4 text-muted-foreground" />
                        <span className="font-medium">{METHOD_META[m].label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {method === "sms" && (
              <Button variant="outline" size="sm" onClick={() => smsMutation.mutate()} disabled={smsMutation.isPending}>
                {smsMutation.isPending ? "Sending…" : smsSent ? "Resend code" : "Send code to my phone"}
              </Button>
            )}

            <div className="space-y-2">
              <Label htmlFor="stepup-code">{meta?.label ? `${meta.label} code` : "Code"}</Label>
              <Input
                id="stepup-code"
                inputMode={numeric ? "numeric" : "text"}
                autoComplete="one-time-code"
                placeholder={numeric ? "000000" : "Enter your backup code"}
                className={numeric ? "font-mono tracking-[0.4em] text-center" : "font-mono"}
                value={code}
                onChange={(e) => setCode(numeric ? e.target.value.replace(/\D/g, "").slice(0, 6) : e.target.value)}
              />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            onClick={() => verifyMutation.mutate()}
            disabled={!method || !code.trim() || verifyMutation.isPending || (numeric && code.length !== 6)}
          >
            {verifyMutation.isPending ? "Verifying…" : "Verify"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
