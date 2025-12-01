import { format } from "date-fns"
import { InformationCard } from "@/components/card"

interface PolicyInformationProps {
  policy: {
    name: string
    version: string
    created_at: string
    is_system: boolean
    is_default: boolean
  }
}

export function PolicyInformation({ policy }: PolicyInformationProps) {
  return (
    <InformationCard title="Policy Information">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Policy Name</p>
          <p className="text-sm font-mono">{policy.name}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Version</p>
          <p className="text-sm font-mono">{policy.version}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Created</p>
          <p className="text-sm">{format(new Date(policy.created_at), "MMM d, yyyy")}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Type</p>
          <p className="text-sm">
            {policy.is_system ? "System Policy" : policy.is_default ? "Default Policy" : "Custom Policy"}
          </p>
        </div>
      </div>
    </InformationCard>
  )
}

