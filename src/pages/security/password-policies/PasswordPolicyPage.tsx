import { useNavigate } from "react-router-dom"
import { KeyRound, Hash, Shield, Clock, Settings, Check, X } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { DetailsContainer } from "@/components/container"
import { PageHeader } from "@/components/layout"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchPasswordPolicies } from "@/services/api/password-policies"
import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"

const HASH_LABELS: Record<string, string> = {
  argon2id: "Argon2id",
  bcrypt: "Bcrypt",
  scrypt: "Scrypt",
  pbkdf2: "PBKDF2",
}

const STRENGTH_LABELS: Record<number, string> = {
  0: "0 — None",
  1: "1 — Weak",
  2: "2 — Fair",
  3: "3 — Strong",
  4: "4 — Very strong",
}

function Attr({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        <Icon className="size-3.5" />
        {label}
      </div>
      <div className="text-sm text-foreground">{value}</div>
    </div>
  )
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <h3 className="text-sm font-semibold text-foreground">{children}</h3>
}

function BoolBadge({ value, label }: { value: boolean; label: string }) {
  return (
    <Badge variant="secondary" className={value ? "gap-1 border-emerald-500/30 bg-emerald-500/10 text-emerald-600" : "gap-1"}>
      {value ? <Check className="size-3" /> : <X className="size-3" />}
      {label}
    </Badge>
  )
}

export default function PasswordPolicyPage() {
  const navigate = useNavigate()

  const { data, isLoading, isError } = useQuery({
    queryKey: ["passwordPolicies", "detail"],
    queryFn: fetchPasswordPolicies,
  })

  const configureUrl = `/security/password/configure`

  return (
    <DetailsContainer>
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Password Policy"
          description="Password length, complexity, breach screening, history, expiry, and hashing algorithm."
        />

        {isLoading && (
          <Card>
            <CardContent className="space-y-4 pt-6">
              <Skeleton className="h-5 w-48" />
              <div className="grid gap-4 md:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {isError && !isLoading && (
          <Card>
            <CardContent className="py-12 text-center text-sm text-destructive">
              Failed to load password policy.
            </CardContent>
          </Card>
        )}

        {!isLoading && data && (
          <Card>
            <CardContent>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <KeyRound className="size-6" />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <h1 className="text-lg font-semibold tracking-tight">Password Policy</h1>
                    <div className="flex flex-wrap items-center gap-2">
                      <BoolBadge value={data.require_uppercase} label="Uppercase" />
                      <BoolBadge value={data.require_lowercase} label="Lowercase" />
                      <BoolBadge value={data.require_number} label="Number" />
                      <BoolBadge value={data.require_symbol} label="Symbol" />
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 gap-2"
                  onClick={() => navigate(configureUrl)}
                >
                  <Settings className="size-4" />
                  Configure
                </Button>
              </div>

              <Separator className="my-5" />
              <SectionLabel>Complexity Requirements</SectionLabel>
              <div className="mt-3 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                <Attr icon={Hash} label="Min Length" value={`${data.min_length} characters`} />
                <Attr icon={Hash} label="Max Length" value={`${data.max_length} characters`} />
                <Attr icon={Shield} label="Min Strength" value={STRENGTH_LABELS[data.min_strength_score] ?? String(data.min_strength_score)} />
              </div>

              <Separator className="my-5" />
              <SectionLabel>Breach & History</SectionLabel>
              <div className="mt-3 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                <Attr icon={data.reject_common_passwords ? Check : X} label="Common Passwords" value={data.reject_common_passwords ? "Rejected" : "Allowed"} />
                <Attr icon={data.check_hibp ? Check : X} label="HIBP Breach Check" value={data.check_hibp ? "Enabled" : "Disabled"} />
                <Attr icon={Hash} label="History Count" value={data.password_history_count > 0 ? `${data.password_history_count} passwords` : "Disabled"} />
              </div>

              <Separator className="my-5" />
              <SectionLabel>Expiry & Hashing</SectionLabel>
              <div className="mt-3 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                <Attr icon={Clock} label="Max Age" value={data.max_age_days > 0 ? `${data.max_age_days} days` : "Never expires"} />
                <Attr icon={Clock} label="Temp Password Validity" value={`${data.temporary_password_validity_hours} hours`} />
                <Attr icon={KeyRound} label="Hash Algorithm" value={HASH_LABELS[data.hash_algorithm] ?? data.hash_algorithm} />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DetailsContainer>
  )
}
