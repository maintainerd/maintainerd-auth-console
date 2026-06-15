import { ShieldCheck } from "lucide-react"
import { InformationCard } from "@/components/card/InformationCard"
import type { Webhook } from "@/services/api/webhooks/types"

interface WebhookInformationProps {
  webhook: Webhook
}

/** A small key/value row used inside the information card. */
function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
      <dt className="w-44 shrink-0 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="min-w-0 text-sm">{value}</dd>
    </div>
  )
}

export function WebhookInformation({ webhook }: WebhookInformationProps) {
  return (
    <InformationCard
      title="Signature verification"
      icon={ShieldCheck}
      description="Every delivery is signed with this endpoint's secret so your service can verify it came from us."
    >
      <dl className="space-y-4">
        <InfoRow
          label="Payload URL"
          value={<span className="break-all font-mono">{webhook.url}</span>}
        />
        <InfoRow
          label="Event subscription"
          value={webhook.subscribe_all ? "All event types" : "Selected event types"}
        />
        <InfoRow
          label="Signing secret"
          value={
            <span className="text-muted-foreground">
              Shown once when created. It can't be retrieved again — use{" "}
              <span className="font-medium text-foreground">Edit → Rotate signing secret</span> to
              generate a new one.
            </span>
          }
        />
        <InfoRow label="Max retries" value={`${webhook.max_retries} attempt(s)`} />
        <InfoRow label="Request timeout" value={`${webhook.timeout_seconds} second(s)`} />
      </dl>
    </InformationCard>
  )
}
