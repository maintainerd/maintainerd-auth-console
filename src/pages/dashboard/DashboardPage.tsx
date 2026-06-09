import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Users,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Server,
  KeyRound,
  Layers,
  Settings,
  Lock,
  Clock,
  Globe,
  CheckCircle,
  BookOpen,
  ExternalLink,
  ChevronRight,
} from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { fetchMFAStatus } from "@/services/api/mfa"
import { DetailsContainer } from "@/components/container"

// Placeholder metrics — wire to live counts (e.g. /users, /clients, /services,
// /identity_providers, /auth-events/count) when those pages are built.
const STATS = [
  { label: "Total Users", value: "1,234", icon: Users, hero: true },
  { label: "Applications", value: "8", icon: Layers },
  { label: "Services", value: "12", icon: Server },
  { label: "Identity Providers", value: "5", icon: KeyRound },
]

const QUICK_ACTIONS = [
  { icon: Users, title: "Manage Users", desc: "Add users and assign roles", to: "/users" },
  { icon: Shield, title: "Security Settings", desc: "Configure security policies", to: "/security/settings" },
  { icon: Server, title: "Manage Services", desc: "Register application services", to: "/services" },
  { icon: KeyRound, title: "Identity Providers", desc: "Connect external providers", to: "/providers/identity" },
]

// Security areas that exist in the backend (/security-settings/*, /ip-restriction-rules)
// AND have a built console page.
const SECURITY_LINKS = [
  { title: "Multi-Factor Auth", desc: "Require a second authentication factor", icon: ShieldCheck, to: "/security/settings" },
  { title: "Password Policy", desc: "Set password strength requirements", icon: Lock, to: "/security/password-policies" },
  { title: "Sessions", desc: "Session lifetime and concurrency limits", icon: Clock, to: "/security/sessions" },
  { title: "Threat Detection", desc: "Detect and block suspicious activity", icon: ShieldAlert, to: "/security/threats" },
  { title: "IP Restrictions", desc: "Allow or block access by IP range", icon: Globe, to: "/security/ip-restrictions" },
]

// Shared icon-tile + chevron row used by both Quick Actions and Security, so the
// two sections stay visually identical.
function NavRow({
  icon: Icon,
  title,
  desc,
  onClick,
}: {
  icon: LucideIcon
  title: string
  desc: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-between rounded-lg border p-3 text-left transition-colors hover:bg-accent"
    >
      <div className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <Icon className="size-5" />
        </div>
        <div className="space-y-0.5">
          <div className="font-medium">{title}</div>
          <div className="text-sm text-muted-foreground">{desc}</div>
        </div>
      </div>
      <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
    </button>
  )
}

// Prompts the user to enable a second factor. Shown on the dashboard until at
// least one MFA method is active, so securing the account reads as a required
// onboarding step.
function MfaSetupBanner({ onSetup }: { onSetup: () => void }) {
  const { data, isLoading, isError } = useQuery({ queryKey: ["mfa", "status"], queryFn: fetchMFAStatus, retry: false })
  if (isLoading || isError || !data) return null

  const active = (data.is_totp_enabled ? 1 : 0) + (data.is_sms_available ? 1 : 0) + ((data.webauthn_keys?.length ?? 0) > 0 ? 1 : 0)
  if (active > 0) return null

  return (
    <Card className="border-amber-500/40 bg-amber-500/[0.04] shadow-xs">
      <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
            <ShieldAlert className="size-5" />
          </div>
          <div className="space-y-0.5">
            <p className="font-medium">Secure your account with two-factor authentication</p>
            <p className="text-sm text-muted-foreground">
              Add a second step at sign-in to protect your account. This is strongly recommended for all administrators.
            </p>
          </div>
        </div>
        <Button onClick={onSetup} className="shrink-0 self-start sm:self-auto">
          <ShieldCheck className="mr-2 size-4" />
          Set up MFA
        </Button>
      </CardContent>
    </Card>
  )
}

const DashboardPage = () => {
  const navigate = useNavigate()
  const { tenantId } = useParams()

  const to = (path: string) => navigate(`/${tenantId}${path}`)

  return (
    <DetailsContainer>
      <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Get Started</h1>
        <p className="text-sm text-muted-foreground">
          Welcome to your M9d-Auth dashboard. Manage your authentication services, users, and security settings.
        </p>
      </div>

      {/* MFA setup prompt — shown until the user enables a second factor */}
      <MfaSetupBanner onSetup={() => to("/account/mfa?from=dashboard")} />

      {/* KPI stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => (
          <Card
            key={stat.label}
            className={cn(
              "py-0 shadow-xs transition-shadow hover:shadow-sm",
              stat.hero &&
                "border-transparent bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-sm shadow-blue-500/20",
            )}
          >
            <CardContent className="flex items-center justify-between p-5">
              <div className="space-y-1">
                <p className={cn("text-sm", stat.hero ? "text-blue-50" : "text-muted-foreground")}>
                  {stat.label}
                </p>
                <p className="text-2xl font-semibold tracking-tight">{stat.value}</p>
              </div>
              <div
                className={cn(
                  "flex size-10 items-center justify-center rounded-xl",
                  stat.hero ? "bg-white/15 text-white" : "bg-muted text-muted-foreground",
                )}
              >
                <stat.icon className="size-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="shadow-xs">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Settings className="h-4 w-4" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Essential setup tasks to get your authentication system ready
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {QUICK_ACTIONS.map((action) => (
              <NavRow
                key={action.title}
                icon={action.icon}
                title={action.title}
                desc={action.desc}
                onClick={() => to(action.to)}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Integration Guide */}
      <Card className="shadow-xs">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BookOpen className="h-4 w-4" />
            Application Integration
          </CardTitle>
          <CardDescription>
            Connect your applications to M9d-Auth using standard protocols
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-1">
                <div className="font-medium">OAuth 2.0 / OpenID Connect</div>
                <div className="text-sm text-muted-foreground">Standard authentication flows</div>
              </div>
              <CheckCircle className="h-5 w-5 text-muted-foreground" />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-1">
                <div className="font-medium">REST APIs</div>
                <div className="text-sm text-muted-foreground">Direct API integration</div>
              </div>
              <CheckCircle className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button onClick={() => to("/clients")}>
              Create OAuth Client
            </Button>
            <Button variant="outline" onClick={() => to("/api-keys")}>
              Generate API Key
            </Button>
            <Button variant="ghost">
              <ExternalLink className="mr-2 h-4 w-4" />
              Documentation
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="shadow-xs">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="h-4 w-4" />
            Security
          </CardTitle>
          <CardDescription>
            Configure your security policies and access protections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {SECURITY_LINKS.map((item) => (
              <NavRow
                key={item.title}
                icon={item.icon}
                title={item.title}
                desc={item.desc}
                onClick={() => to(item.to)}
              />
            ))}
          </div>
        </CardContent>
      </Card>
      </div>
    </DetailsContainer>
  )
}

export default DashboardPage
