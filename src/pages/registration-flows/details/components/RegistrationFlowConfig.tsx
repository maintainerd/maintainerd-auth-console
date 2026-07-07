import { Settings } from "lucide-react"
import { InformationCard } from "@/components/card"
import { ListSkeleton } from "@/components/details"
import { useRegistrationFlow } from "@/hooks/useRegistrationFlows"

interface RegistrationFlowConfigProps {
  registrationFlowId: string
}

export function RegistrationFlowConfig({ registrationFlowId }: RegistrationFlowConfigProps) {
  const { data: registrationFlow, isLoading, isError } = useRegistrationFlow(registrationFlowId)

  if (isLoading) {
    return (
      <InformationCard title="Configuration" description="Core registration flow settings" icon={Settings}>
        <ListSkeleton />
      </InformationCard>
    )
  }

  if (isError || !registrationFlow) {
    return (
      <InformationCard title="Configuration" description="Core registration flow settings" icon={Settings}>
        <p className="py-8 text-center text-sm text-destructive">Failed to load configuration</p>
      </InformationCard>
    )
  }

  const requiredFields = registrationFlow.required_fields ?? []

  return (
    <InformationCard title="Configuration" description="Core registration flow settings" icon={Settings}>
      <div className="space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Verification required</p>
          <p className="text-sm">{registrationFlow.verification_required ? "Enabled" : "Disabled"}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Required fields</p>
          <p className="text-sm">
            {requiredFields.length > 0 ? requiredFields.map(f => f.charAt(0).toUpperCase() + f.slice(1)).join(", ") : "Username and password only"}
          </p>
        </div>
      </div>
    </InformationCard>
  )
}
