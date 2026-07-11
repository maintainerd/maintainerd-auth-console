import { useParams, useNavigate, useSearchParams } from "react-router-dom"
import { AppWindow, Radio, History } from "lucide-react"
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DetailTabs } from "@/components/details/DetailTabs"
import { DetailLayout } from "@/components/details"
import { useWebhook } from "@/hooks/useWebhooks"
import { WebhookHeader, WebhookInformation, WebhookEvents } from "./components"
import { WebhookDeliveries } from "./components/WebhookDeliveries"

const TABS = [
  { value: "overview", label: "Overview", icon: AppWindow },
  { value: "events", label: "Events", icon: Radio },
  { value: "deliveries", label: "Deliveries", icon: History },
] as const

type WebhookDetailsTab = typeof TABS[number]["value"]

const TAB_VALUES = new Set<string>(TABS.map((tab) => tab.value))

export default function WebhookDetailsPage() {
  const { webhookId } = useParams<{ webhookId: string }>()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const requestedTab = searchParams.get("tab")
  const activeTab: WebhookDetailsTab = TAB_VALUES.has(requestedTab || "")
    ? requestedTab as WebhookDetailsTab
    : "overview"

  const handleTabChange = (tab: string) => {
    setSearchParams({ tab })
  }

  const { data: webhook, isLoading, isError } = useWebhook(webhookId || "")

  return (
    <DetailLayout
      backLabel="Back to Webhooks"
      onBack={() => navigate(`/webhooks`)}
      isLoading={isLoading}
      isError={isError || !webhook}
      notFoundTitle="Webhook not found"
      notFoundDescription="The webhook you're looking for doesn't exist or may have been removed."
    >
      {webhook && (
        <>
          <WebhookHeader webhook={webhook} webhookId={webhookId!} />

          <DetailTabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="h-auto w-full flex-wrap justify-start gap-1 p-1 md:w-fit">
              {TABS.map(({ value, label, icon: Icon }) => (
                <TabsTrigger key={value} value={value} className="h-8 flex-none gap-2 px-3">
                  <Icon className="size-4" />
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="overview">
              <WebhookInformation webhook={webhook} />
            </TabsContent>

            <TabsContent value="events">
              <WebhookEvents webhookId={webhookId!} />
            </TabsContent>

            <TabsContent value="deliveries">
              <WebhookDeliveries webhookId={webhookId!} />
            </TabsContent>
          </DetailTabs>
        </>
      )}
    </DetailLayout>
  )
}
