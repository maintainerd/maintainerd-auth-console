import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, Gauge, FileText, Wrench } from "lucide-react"

const ITEMS = [
  { title: "Rate Limits", description: "API request throttling", icon: Gauge, tab: "rate-limit" },
  { title: "Audit", description: "Logging and retention", icon: FileText, tab: "audit" },
  { title: "Maintenance", description: "Maintenance mode", icon: Wrench, tab: "maintenance" },
]

export function TenantSettings() {
  const navigate = useNavigate()

  return (
    <Card className="shadow-xs">
      <CardContent className="py-8">
        <div className="flex flex-col items-center gap-4 mb-8 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Settings className="size-6" />
          </div>
          <h3 className="text-lg font-semibold">Tenant Settings</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Configure operational controls — rate limiting, audit logging, and maintenance mode.
          </p>
          <Button variant="outline" onClick={() => navigate(`/settings`)}>
            Open Settings
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {ITEMS.map((item) => (
            <button
              key={item.tab}
              onClick={() => navigate(`/settings?tab=${item.tab}`)}
              className="flex items-start gap-3 rounded-lg border p-4 text-left transition-colors hover:bg-accent"
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                <item.icon className="size-4" />
              </div>
              <div>
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
