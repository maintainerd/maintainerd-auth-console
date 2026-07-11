import { useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import { Radio } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { PageContainer, PageHeader } from "@/components/layout"
import { DetailsContainer } from "@/components/container"
import { InformationCard } from "@/components/card/InformationCard"
import { EmptyState } from "@/components/details"
import { useEventTypes } from "@/hooks/useEventTypes"
import { useEventRoutes, useToggleEventRoute } from "@/hooks/useEventRoutes"
import { useToast } from "@/hooks/useToast"
import { cn } from "@/lib/utils"
import type { EventType } from "@/services/api/event-types/types"
import type { EventRoute } from "@/services/api/event-routes/types"

const CHANNELS = [{ value: "rabbitmq", label: "RabbitMQ", icon: Radio }] as const

function groupByCategory(types: EventType[]): [string, EventType[]][] {
  const groups = new Map<string, EventType[]>()
  for (const t of types) {
    const key = t.category || "OTHER"
    const bucket = groups.get(key)
    if (bucket) bucket.push(t)
    else groups.set(key, [t])
  }
  return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b))
}

export default function EventRoutesPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const channel = searchParams.get("channel") || "rabbitmq"
  const handleChannelChange = (ch: string) => setSearchParams({ channel: ch })

  const { data: eventTypes, isLoading: isLoadingTypes, isError } = useEventTypes()
  const { data: routes } = useEventRoutes()
  const toggleRoute = useToggleEventRoute()
  const { showSuccess, showError } = useToast()

  const routeMap = useMemo(() => {
    const map = new Map<string, EventRoute>()
    for (const r of routes ?? []) {
      if (r.channel === channel) {
        map.set(r.event_type_uuid, r)
      }
    }
    return map
  }, [routes, channel])

  const isEnabled = (eventTypeUuid: string) => {
    const route = routeMap.get(eventTypeUuid)
    return route ? route.enabled : false
  }

  const handleToggle = (eventType: EventType, enabled: boolean) => {
    toggleRoute.mutate(
      { eventTypeUuid: eventType.uuid, enabled },
      {
        onSuccess: () =>
          showSuccess(`${eventType.key} ${enabled ? "enabled" : "disabled"} for ${channel}`),
        onError: (error) => showError(error, "Failed to update route"),
      },
    )
  }

  const groups = useMemo(() => {
    return groupByCategory(eventTypes ?? [])
  }, [eventTypes])

  return (
    <DetailsContainer>
      <PageContainer>
        <PageHeader
          title="Event Routes"
          description="Configure which integration events are published to message brokers. Each channel routes independently — enable an event type to forward it to the selected broker."
        />

        <Tabs value={channel} onValueChange={handleChannelChange}>
          <TabsList className="h-auto w-full flex-wrap justify-start gap-1 p-1 md:w-fit">
            {CHANNELS.map(({ value, label, icon: Icon }) => (
              <TabsTrigger key={value} value={value} className="h-8 flex-none gap-2 px-3">
                <Icon className="size-4" />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={channel} className="mt-4 space-y-4">
            {isLoadingTypes && (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="space-y-3">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-full max-w-md" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {isError && (
              <p className="py-8 text-center text-sm text-destructive">Failed to load event types</p>
            )}

            {eventTypes && groups.length === 0 && (
              <EmptyState
                icon={Radio}
                title="No event types available"
                description="No event types are available for this tenant."
              />
            )}

            {groups.map(([category, types]) => (
              <InformationCard
                key={category}
                title={category}
                description={`${types.length} event type${types.length === 1 ? "" : "s"}`}
              >
                <div className="divide-y divide-border/60">
                  {types.map((t) => {
                    const enabled = isEnabled(t.uuid)
                    return (
                      <div
                        key={t.uuid}
                        className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                      >
                        <div className={cn("min-w-0 space-y-1", !enabled && "opacity-50")}>
                          <div className="flex items-center gap-2">
                            <code className="rounded bg-muted px-2 py-0.5 font-mono text-sm font-medium">
                              {t.key}
                            </code>
                            {t.version > 1 && (
                              <span className="text-xs text-muted-foreground">v{t.version}</span>
                            )}
                          </div>
                          {t.description && (
                            <p className="text-sm text-muted-foreground">{t.description}</p>
                          )}
                        </div>
                        <Switch
                          checked={enabled}
                          onCheckedChange={(checked) => handleToggle(t, checked)}
                          aria-label={`${enabled ? "Disable" : "Enable"} ${t.key} for ${channel}`}
                        />
                      </div>
                    )
                  })}
                </div>
              </InformationCard>
            ))}
          </TabsContent>
        </Tabs>
      </PageContainer>
    </DetailsContainer>
  )
}
