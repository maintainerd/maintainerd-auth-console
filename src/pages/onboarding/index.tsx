import { OnboardingDataTable } from "./components/OnboardingDataTable"
import { onboardingColumns } from "./components/OnboardingColumns"
import { mockOnboardingFlows } from "./constants"

export default function OnboardingPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Onboarding Flows</h1>
        <p className="text-muted-foreground">
          Manage premade signup pages and onboarding flows for your applications.
          Create custom signup experiences with templates and automatic role assignments.
        </p>
      </div>

      <OnboardingDataTable columns={onboardingColumns} data={mockOnboardingFlows} />
    </div>
  )
}
