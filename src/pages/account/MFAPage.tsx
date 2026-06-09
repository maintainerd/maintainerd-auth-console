import { useParams, useNavigate, useLocation, useSearchParams, Outlet } from "react-router-dom"
import { Key, Smartphone, MessageSquare, ShieldCheck, ShieldAlert, ChevronRight, KeyRound } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { StatusBadge } from "@/components/details"
import { DetailsContainer } from "@/components/container"
import { FormPageHeader } from "@/components/header"
import { fetchMFAStatus } from "@/services/api/mfa"
import { useQuery } from "@tanstack/react-query"

// Where the user can arrive from, by `?from=` key. Determines where the hub's
// "Back" returns to. Defaults to the dashboard when absent/unknown.
const MFA_ORIGINS: Record<string, { path: string; label: string }> = {
  dashboard: { path: "/dashboard", label: "Back to Get Started" },
  settings: { path: "/account/settings?tab=security", label: "Back to Settings" },
}

export default function MFAPage() {
  const { tenantId } = useParams<{ tenantId: string }>()
  const { pathname } = useLocation()
  const [searchParams] = useSearchParams()

  const from = searchParams.get("from") ?? ""
  const origin = MFA_ORIGINS[from] ?? { path: "/dashboard", label: "Back" }
  const fromQuery = from ? `?from=${from}` : ""

  // The header wraps both the hub and the per-method sub-pages. From a sub-page
  // "Back" returns to the hub (preserving the origin); from the hub it returns to
  // wherever the user came from (Get Started or Settings).
  const onHub = pathname.replace(/\/$/, "").endsWith("/account/mfa")
  const backUrl = onHub ? `/${tenantId}${origin.path}` : `/${tenantId}/account/mfa${fromQuery}`
  const backLabel = onHub ? origin.label : "Back"

  return (
    <DetailsContainer>
      <div className="flex flex-col gap-6">
        <FormPageHeader
          backUrl={backUrl}
          backLabel={backLabel}
          title="Multi-Factor Authentication"
          description="Add an extra layer of security to your account by requiring a second step at sign-in."
        />
        <Outlet />
      </div>
    </DetailsContainer>
  )
}

export function MFAIndex() {
  const { tenantId } = useParams<{ tenantId: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const fromQuery = searchParams.get("from") ? `?from=${searchParams.get("from")}` : ""

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["mfa", "status"],
    queryFn: fetchMFAStatus,
    retry: false,
  })

  if (isLoading) return <MFAIndexSkeleton />
  if (isError)
    return (
      <Card className="shadow-xs">
        <CardContent className="py-12 text-center text-sm text-destructive">
          Failed to load MFA settings. {error instanceof Error ? error.message : ""}
        </CardContent>
      </Card>
    )
  if (!data) return null

  const totpOn = data.is_totp_enabled ?? false
  const smsOn = data.is_sms_available ?? false
  const passkeyCount = data.webauthn_keys?.length ?? 0
  const passkeyOn = passkeyCount > 0
  const activeCount = [totpOn, smsOn, passkeyOn].filter(Boolean).length
  const protected_ = activeCount > 0
  const base = `/${tenantId}/account/mfa`

  return (
    <div className="space-y-6">
      {/* ── Security status ─────────────────────────────────────── */}
      <Card className="shadow-xs">
        <CardContent className="flex items-center gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-muted">
            {protected_ ? <ShieldCheck className="size-6 text-emerald-600" /> : <ShieldAlert className="size-6 text-amber-600" />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">
              {protected_ ? "Your account is protected" : "Your account is not protected"}
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">
              {protected_
                ? `${activeCount} authentication ${activeCount === 1 ? "method is" : "methods are"} active.`
                : "Enable at least one authentication method to secure your account."}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ── Authentication methods ──────────────────────────────── */}
      <div>
        <h2 className="text-sm font-medium text-muted-foreground px-1 mb-2">Authentication methods</h2>
        <Card className="shadow-xs py-0 overflow-hidden">
          <CardContent className="p-0">
            <MethodRow
              icon={Smartphone}
              title="Authenticator app"
              description="Use Google Authenticator, Authy, or 1Password to generate codes."
              active={totpOn}
              onClick={() => navigate(`${base}/totp${fromQuery}`)}
            />
            <Separator />
            <MethodRow
              icon={MessageSquare}
              title="Text message (SMS)"
              description="Receive one-time codes on your verified phone number."
              active={smsOn}
              onClick={() => navigate(`${base}/sms${fromQuery}`)}
            />
            <Separator />
            <MethodRow
              icon={Key}
              title="Passkeys"
              description="Sign in with Face ID, Touch ID, Windows Hello, or a security key."
              active={passkeyOn}
              activeLabel={passkeyOn ? `${passkeyCount} registered` : undefined}
              onClick={() => navigate(`${base}/passkeys${fromQuery}`)}
            />
          </CardContent>
        </Card>
      </div>

      {/* ── Recovery ────────────────────────────────────────────── */}
      {totpOn && (
        <div>
          <h2 className="text-sm font-medium text-muted-foreground px-1 mb-2">Recovery</h2>
          <Card className="shadow-xs py-0 overflow-hidden">
            <CardContent className="p-0">
              <MethodRow
                icon={KeyRound}
                title="Backup codes"
                description="One-time codes to use if you lose access to your other methods."
                active={(data.backup_codes_count ?? 0) > 0}
                activeLabel={(data.backup_codes_count ?? 0) > 0 ? `${data.backup_codes_count} remaining` : undefined}
                onClick={() => navigate(`${base}/totp${fromQuery}`)}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

interface MethodRowProps {
  icon: LucideIcon
  title: string
  description: string
  active: boolean
  activeLabel?: string
  onClick: () => void
}

function MethodRow({ icon: Icon, title, description, active, activeLabel, onClick }: MethodRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-4 px-4 py-4 text-left transition-colors hover:bg-accent/50 focus-visible:bg-accent/50 focus-visible:outline-none first:rounded-t-xl last:rounded-b-xl"
    >
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <Icon className="size-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">{title}</p>
          <StatusBadge status={active ? "active" : "inactive"} />
          {active && activeLabel && <span className="text-xs text-muted-foreground">· {activeLabel}</span>}
        </div>
        <p className="text-sm text-muted-foreground mt-0.5 truncate">{description}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0 text-sm text-muted-foreground">
        <span className="hidden sm:inline">{active ? "Manage" : "Set up"}</span>
        <ChevronRight className="size-4" />
      </div>
    </button>
  )
}

function MFAIndexSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-20 w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-40" />
        <Card className="shadow-xs py-0 overflow-hidden">
          <CardContent className="p-0">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-4 px-4 py-4">
                <Skeleton className="size-10 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-64" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
