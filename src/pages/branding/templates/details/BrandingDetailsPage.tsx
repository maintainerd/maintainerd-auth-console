import { useParams, useNavigate, useSearchParams } from "react-router-dom"
import { Palette, Link2, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DetailLayout } from "@/components/details"
import { useBranding } from "@/hooks/useBranding"
import { useClients } from "@/hooks/useClients"
import { THEME_TOKENS, tokensFromMetadata, tokenId, isHex } from "../themeTokens"
import { BrandingHeader } from "./components/BrandingHeader"
import type { Branding } from "@/services/api/branding/types"

const TABS = [
  { value: "theme", label: "Theme", icon: Palette },
  { value: "details", label: "Details", icon: Link2 },
  { value: "clients", label: "Clients", icon: Users },
] as const

export default function BrandingDetailsPage() {
  const { tenantId, brandingId } = useParams<{ tenantId: string; brandingId: string }>()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const activeTab = searchParams.get("tab") || "theme"
  const handleTabChange = (tab: string) => setSearchParams({ tab })

  const { data: branding, isLoading, isError } = useBranding(brandingId)

  return (
    <DetailLayout
      backLabel="Back to Themes"
      onBack={() => navigate(`/${tenantId}/branding/templates`)}
      isLoading={isLoading}
      isError={isError || !branding}
      notFoundTitle="Branding not found"
      notFoundDescription="The branding template you're looking for doesn't exist or may have been removed."
    >
      {branding && (
        <>
          <BrandingHeader branding={branding} tenantId={tenantId!} brandingId={brandingId!} />

          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList>
              {TABS.map(({ value, label, icon: Icon }) => (
                <TabsTrigger key={value} value={value} className="gap-2">
                  <Icon className="size-4" />
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="theme" className="mt-4">
              <ThemeTab branding={branding} />
            </TabsContent>
            <TabsContent value="details" className="mt-4">
              <DetailsTab branding={branding} />
            </TabsContent>
            <TabsContent value="clients" className="mt-4">
              <ClientsTab brandingId={branding.branding_id} />
            </TabsContent>
          </Tabs>
        </>
      )}
    </DetailLayout>
  )
}

function ThemeTab({ branding }: { branding: Branding }) {
  const tokens = tokensFromMetadata(branding.metadata)
  const colors = THEME_TOKENS.filter((t) => t.kind === "color")
  const fontFamily = tokens["font.family"]

  return (
    <Card className="shadow-xs">
      <CardHeader>
        <CardTitle className="text-base">Theme tokens</CardTitle>
        <p className="text-sm text-muted-foreground">
          The colors and typography applied by this template.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {colors.map((t) => {
            const value = tokens[tokenId(t)]
            return (
              <div key={tokenId(t)} className="flex items-center gap-3">
                <span
                  className="size-10 shrink-0 rounded-lg border"
                  style={{ backgroundColor: isHex(value) ? value : "transparent" }}
                  aria-hidden
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium">{t.label}</p>
                  <p className="font-mono text-xs text-muted-foreground">{value || "—"}</p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="border-t pt-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Font family
          </p>
          <p className="mt-1 text-sm" style={{ fontFamily: fontFamily || undefined }}>
            {fontFamily || "—"}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

function DetailsTab({ branding }: { branding: Branding }) {
  const links: { label: string; value: string }[] = [
    { label: "Company name", value: branding.company_name },
    { label: "Logo URL", value: branding.logo_url },
    { label: "Favicon URL", value: branding.favicon_url },
    { label: "Support URL", value: branding.support_url },
    { label: "Privacy policy URL", value: branding.privacy_policy_url },
    { label: "Terms of service URL", value: branding.terms_of_service_url },
  ]

  return (
    <Card className="shadow-xs">
      <CardHeader>
        <CardTitle className="text-base">Brand assets &amp; links</CardTitle>
        <p className="text-sm text-muted-foreground">
          Company name and the URLs surfaced across the auth experience.
        </p>
      </CardHeader>
      <CardContent className="divide-y">
        {links.map((item) => {
          const isUrl = item.label.endsWith("URL") && !!item.value
          return (
            <div
              key={item.label}
              className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-[220px_1fr] sm:items-center"
            >
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {item.label}
              </span>
              {isUrl ? (
                <a
                  href={item.value}
                  target="_blank"
                  rel="noreferrer"
                  className="truncate text-sm text-primary hover:underline"
                >
                  {item.value}
                </a>
              ) : (
                <span className="truncate text-sm">{item.value || "—"}</span>
              )}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

function ClientsTab({ brandingId }: { brandingId: string }) {
  const { data: clientsData, isLoading } = useClients({ limit: 200 })

  const matchingClients = (clientsData?.rows ?? []).filter(
    (c) => c.branding_id === brandingId
  )

  return (
    <Card className="shadow-xs">
      <CardHeader>
        <CardTitle className="text-base">Clients using this branding</CardTitle>
        <p className="text-sm text-muted-foreground">
          {matchingClients.length > 0
            ? `${matchingClients.length} client${matchingClients.length !== 1 ? "s" : ""} explicitly using this branding.`
            : "No clients are explicitly using this branding template."}
        </p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="py-6 text-center text-sm text-muted-foreground">Loading clients…</p>
        ) : matchingClients.length === 0 ? (
          <div className="py-6 text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Clients without an explicit branding template fall back to the tenant's active branding.
            </p>
            <p className="text-xs text-muted-foreground">
              Deleting this branding template will return any using clients to the tenant's active branding fallback.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <ul className="divide-y">
              {matchingClients.map((client) => (
                <li key={client.client_id} className="py-2">
                  <span className="text-sm font-medium">{client.name}</span>
                  <span className="ml-2 font-mono text-xs text-muted-foreground">
                    {client.client_id}
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground">
              Deleting this branding template will return these clients to the tenant's active branding fallback.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
