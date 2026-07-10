import { useParams, useNavigate, useSearchParams, useLocation } from "react-router-dom"
import { FileText, Server, History } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DetailLayout } from "@/components/details"
import { usePolicy } from "@/hooks/usePolicies"
import { useServicesByPolicy } from "./hooks/useServicesByPolicy"
import { PolicyHeader, PolicyStatementsTab, PolicyServicesTab, PolicyHistoryTab } from "./components"

const TABS = [
  { value: "statements", label: "Statements", icon: FileText },
  { value: "services", label: "Services", icon: Server },
  { value: "history", label: "History", icon: History },
] as const

export default function PolicyDetailsPage() {
  const { policyId } = useParams<{ policyId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()

  const navState = location.state as { from?: string; backLabel?: string } | null
  const backTo = navState?.from ?? `/policies`
  const backLabel = navState?.backLabel ?? (backTo === `/policies` ? "Back to Policies" : "Back")

  const activeTab = searchParams.get("tab") || "statements"
  const handleTabChange = (tab: string) => setSearchParams({ tab })

  const { data: policy, isLoading, isError } = usePolicy(policyId || "")

  const { data: servicesData } = useServicesByPolicy({
    policyId: policyId || "",
    page: 1,
    limit: 1,
  })

  return (
    <DetailLayout
      backLabel={backLabel}
      onBack={() => navigate(backTo)}
      isLoading={isLoading}
      isError={isError || !policy}
      notFoundTitle="Policy not found"
      notFoundDescription="The policy you're looking for doesn't exist or may have been removed."
    >
      {policy && (
        <>
          <PolicyHeader policy={policy} policyId={policyId!} afterDeleteTo={backTo} />

          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList>
              {TABS.map(({ value, label, icon: Icon }) => (
                <TabsTrigger key={value} value={value} className="gap-2">
                  <Icon className="size-4" />
                  {label}
                  {value === "services" && servicesData?.total ? ` (${servicesData.total})` : ""}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="statements" className="mt-4">
              <PolicyStatementsTab
                documentVersion={policy.document.version}
                statements={policy.document.statement}
              />
            </TabsContent>
            <TabsContent value="services" className="mt-4">
              <PolicyServicesTab policyId={policyId!} />
            </TabsContent>
            <TabsContent value="history" className="mt-4">
              <PolicyHistoryTab policyId={policyId!} />
            </TabsContent>
          </Tabs>
        </>
      )}
    </DetailLayout>
  )
}
