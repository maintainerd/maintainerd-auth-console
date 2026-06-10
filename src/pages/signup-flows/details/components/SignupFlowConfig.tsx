import { Settings } from "lucide-react"
import { InformationCard } from "@/components/card"
import { ListSkeleton } from "@/components/details"
import { useSignupFlow } from "@/hooks/useSignupFlows"

interface SignupFlowConfigProps {
  signupFlowId: string
}

export function SignupFlowConfig({ signupFlowId }: SignupFlowConfigProps) {
  const { data: signupFlowData, isLoading, isError } = useSignupFlow(signupFlowId)

  if (isLoading) {
    return (
      <InformationCard
        title="Configuration"
        description="Core auth flow settings"
        icon={Settings}
      >
        <ListSkeleton />
      </InformationCard>
    )
  }

  if (isError || !signupFlowData) {
    return (
      <InformationCard
        title="Configuration"
        description="Core auth flow settings"
        icon={Settings}
      >
        <p className="py-8 text-center text-sm text-destructive">Failed to load configuration</p>
      </InformationCard>
    )
  }

  const config = signupFlowData.config || {}
  const knownKeys = ["auto_approved"]
  const customEntries = Object.entries(config).filter(([key]) => !knownKeys.includes(key))

  return (
    <div className="space-y-6">
      <InformationCard
        title="Configuration"
        description="Core auth flow settings"
        icon={Settings}
      >
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Auto approved
          </p>
          <p className="text-sm">{config.auto_approved ? "Enabled" : "Disabled"}</p>
        </div>
      </InformationCard>

      {customEntries.length > 0 && (
        <InformationCard
          title="Custom Configuration"
          description="Additional configuration fields specific to this auth flow"
          icon={Settings}
        >
          <div className="divide-y">
            {customEntries.map(([key, value]) => (
              <div
                key={key}
                className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-[240px_1fr] sm:items-start"
              >
                <span className="font-mono text-xs text-muted-foreground break-all">{key}</span>
                <span className="font-mono text-sm break-all">
                  {typeof value === "boolean"
                    ? value
                      ? "true"
                      : "false"
                    : Array.isArray(value)
                      ? value.join(", ")
                      : typeof value === "object"
                        ? JSON.stringify(value)
                        : String(value)}
                </span>
              </div>
            ))}
          </div>
        </InformationCard>
      )}
    </div>
  )
}
