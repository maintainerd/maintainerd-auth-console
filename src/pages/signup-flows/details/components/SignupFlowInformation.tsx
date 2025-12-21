import { format } from "date-fns"
import { InformationCard } from "@/components/card"
import type { SignupFlowType } from "@/services/api/signup-flow/types"

interface SignupFlowInformationProps {
  signupFlow: SignupFlowType
}

export function SignupFlowInformation({ signupFlow }: SignupFlowInformationProps) {
  return (
    <InformationCard title="Sign Up Flow Information">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Name</p>
          <p className="text-sm">{signupFlow.name}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Identifier</p>
          <p className="text-sm font-mono">{signupFlow.identifier}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Description</p>
          <p className="text-sm">{signupFlow.description || 'N/A'}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Created</p>
          <p className="text-sm">{format(new Date(signupFlow.created_at), "MMM d, yyyy")}</p>
        </div>
      </div>
    </InformationCard>
  )
}
