import { useParams, useNavigate, useSearchParams } from "react-router-dom"
import { SlidersHorizontal, ShieldCheck, ChevronRight } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DetailsContainer } from "@/components/container"
import { FormPageHeader } from "@/components/header"
import { SettingsCard } from "@/components/card"
import { StatusBadge } from "@/components/details"
import { fetchMFAStatus } from "@/services/api/mfa"
import { useQuery } from "@tanstack/react-query"
import { PreferencesForm } from "./components/PreferencesForm"
import { SecuritySessions } from "./components/SecuritySessions"
import { AccountActions } from "./components/AccountActions"

export default function SettingsPage() {
  const { tenantId } = useParams<{ tenantId: string }>()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const tab = searchParams.get("tab") === "security" ? "security" : "preferences"

  return (
    <DetailsContainer>
      <div className="flex flex-col gap-6">
        <FormPageHeader
          backUrl={`/${tenantId}/dashboard`}
          backLabel="Back"
          title="Settings"
          description="Manage your preferences and account security."
        />

        <Tabs value={tab} onValueChange={(v) => setSearchParams(v === "security" ? { tab: "security" } : {})} className="space-y-6">
          <TabsList>
            <TabsTrigger value="preferences" className="gap-2"><SlidersHorizontal className="size-4" />Preferences</TabsTrigger>
            <TabsTrigger value="security" className="gap-2"><ShieldCheck className="size-4" />Security</TabsTrigger>
          </TabsList>

          <TabsContent value="preferences">
            <PreferencesForm />
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <MFACard onManage={() => navigate(`/${tenantId}/account/mfa?from=settings`)} />
            <SecuritySessions />
            <AccountActions />
          </TabsContent>
        </Tabs>
      </div>
    </DetailsContainer>
  )
}

function MFACard({ onManage }: { onManage: () => void }) {
  const { data } = useQuery({ queryKey: ["mfa", "status"], queryFn: fetchMFAStatus, retry: false })
  const totp = data?.is_totp_enabled ?? false
  const sms = data?.is_sms_available ?? false
  const passkeys = (data?.webauthn_keys?.length ?? 0) > 0
  const active = [totp, sms, passkeys].filter(Boolean).length

  return (
    <SettingsCard title="Multi-factor authentication" description="Add a second step at sign-in to protect your account." icon={ShieldCheck}>
      <button
        type="button"
        onClick={onManage}
        className="flex w-full items-center justify-between gap-3 rounded-lg border p-4 text-left transition-colors hover:bg-accent/50"
      >
        <div className="flex items-center gap-3 min-w-0">
          <StatusBadge status={active > 0 ? "active" : "inactive"} />
          <span className="text-sm text-muted-foreground">
            {active > 0 ? `${active} method${active === 1 ? "" : "s"} active` : "No methods set up yet"}
          </span>
        </div>
        <span className="flex items-center gap-1 text-sm text-muted-foreground shrink-0">
          Manage<ChevronRight className="size-4" />
        </span>
      </button>
    </SettingsCard>
  )
}
