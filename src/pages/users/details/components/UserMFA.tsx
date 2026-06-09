import { useState } from "react"
import { Shield, Key, Smartphone, RefreshCw, CheckCircle2, XCircle, MessageSquare, ShieldOff } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { InformationCard } from "@/components/card"
import { ListSkeleton } from "@/components/details"
import { ConfirmationDialog } from "@/components/dialog"
import { useUserMFA } from "@/hooks/useUsers"
import { useResetUserMfa } from "@/hooks/useUsers"
import { useToast } from "@/hooks/useToast"
import type { UserMFAWebAuthnKey } from "@/services/api/users/types"

interface UserMFAProps {
  userId: string
}

function formatDate(value?: string | null) {
  if (!value) return "—"
  try { return format(new Date(value), "PPp") } catch { return "—" }
}

interface MFAMethodProps {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  enabled: boolean
  onToggle: () => void
}

function MFAMethodCard({ icon: Icon, title, description, enabled, onToggle }: MFAMethodProps) {
  return (
    <button
      onClick={onToggle}
      className="rounded-lg border p-4 text-left hover:bg-accent/50 transition-colors w-full"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-3 min-w-0">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
            <Icon className="size-4 text-muted-foreground" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium">{title}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          </div>
        </div>
        {enabled ? (
          <CheckCircle2 className="size-5 text-emerald-500 shrink-0" />
        ) : (
          <XCircle className="size-5 text-muted-foreground/40 shrink-0" />
        )}
      </div>
    </button>
  )
}

export function UserMFA({ userId }: UserMFAProps) {
  const { data, isLoading, isError } = useUserMFA(userId)
  const { showSuccess, showError } = useToast()
  const resetMfaMutation = useResetUserMfa()
  const [showResetDialog, setShowResetDialog] = useState(false)

  const handleReset = async () => {
    try {
      await resetMfaMutation.mutateAsync(userId)
      showSuccess("MFA reset successfully")
    } catch (error) {
      showError(error)
    } finally {
      setShowResetDialog(false)
    }
  }

  return (
    <InformationCard
      title="Multi-Factor Authentication"
      description="Authentication methods configured for this user. Click a method to manage it."
      icon={Shield}
      action={
        data && (data.is_totp_enabled || data.is_webauthn_enabled || data.is_sms_enabled) ? (
          <Button variant="outline" size="sm" onClick={() => setShowResetDialog(true)}>
            <ShieldOff className="size-4 mr-2" />
            Reset MFA
          </Button>
        ) : undefined
      }
    >
      {isLoading && <ListSkeleton />}

      {isError && (
        <p className="py-8 text-center text-sm text-destructive">Failed to load MFA configuration</p>
      )}

      {data && (
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-3">
            <MFAMethodCard
              icon={Smartphone}
              title="TOTP"
              description="Google Authenticator, Authy, 1Password"
              enabled={data.is_totp_enabled}
              onToggle={() => setShowResetDialog(true)}
            />
            <MFAMethodCard
              icon={MessageSquare}
              title="SMS"
              description="Text message to verified phone"
              enabled={data.is_sms_enabled}
              onToggle={() => setShowResetDialog(true)}
            />
            <MFAMethodCard
              icon={Key}
              title="Passkeys"
              description="Face ID, Touch ID, YubiKey"
              enabled={data.is_webauthn_enabled}
              onToggle={() => setShowResetDialog(true)}
            />
          </div>

          <div className="rounded-lg border px-4 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                <RefreshCw className="size-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">Backup Codes</p>
                <p className="text-xs text-muted-foreground">
                  {data.backup_codes_count > 0
                    ? `${data.backup_codes_count} unused`
                    : "None available"}
                </p>
              </div>
            </div>
            {data.backup_codes_count > 0 ? (
              <CheckCircle2 className="size-5 text-emerald-500 shrink-0" />
            ) : (
              <XCircle className="size-5 text-muted-foreground/40 shrink-0" />
            )}
          </div>

          {/* WebAuthn keys list */}
          {data.webauthn_keys && data.webauthn_keys.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Registered Passkeys</p>
              {data.webauthn_keys.map((key: UserMFAWebAuthnKey) => (
                <div key={key.credential_uuid} className="rounded-lg border p-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                      <Key className="size-4" />
                    </div>
                    <div className="min-w-0 space-y-1">
                      <p className="text-sm font-medium">{key.name}</p>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        {key.transport && (
                          <span className="capitalize">{key.transport}</span>
                        )}
                        <span className="inline-flex items-center gap-1">
                          Last used {formatDate(key.last_used_at)}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          Added {formatDate(key.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {data.mfa_enabled_at && (
            <div className="text-xs text-muted-foreground border-t pt-3">
              MFA enabled on {formatDate(data.mfa_enabled_at)}
            </div>
          )}
        </div>
      )}

      <ConfirmationDialog
        open={showResetDialog}
        onOpenChange={setShowResetDialog}
        onConfirm={handleReset}
        title="Reset MFA"
        description="This removes all multi-factor authentication methods for this user. They will be prompted to set up MFA again on their next sign-in."
        confirmText="Reset MFA"
        variant="destructive"
        isLoading={resetMfaMutation.isPending}
      />
    </InformationCard>
  )
}
