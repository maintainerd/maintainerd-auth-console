import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { FileText, Search, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { policyKeys } from "@/hooks/usePolicies"
import { fetchPolicies } from "@/services/api/policies"
import { useServicePolicyMutations } from "../hooks/useServicePolicyMutations"

interface PolicyAssignDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  serviceId: string
  existingPolicyIds: string[]
}

export function PolicyAssignDialog({
  open,
  onOpenChange,
  serviceId,
  existingPolicyIds,
}: PolicyAssignDialogProps) {
  const [selectedPolicyId, setSelectedPolicyId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Only fetch policies when dialog is open
  const params = {
    page: 1,
    limit: 100,
    name: searchQuery || undefined,
  }

  const { data: policiesData, isLoading } = useQuery({
    queryKey: policyKeys.list(params),
    queryFn: () => fetchPolicies(params),
    enabled: open,
  })

  const { assignPolicy } = useServicePolicyMutations(serviceId)

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setSearchQuery("")
      setSelectedPolicyId(null)
    }
  }, [open])

  const handleAssign = async () => {
    if (!selectedPolicyId) return

    await assignPolicy.mutateAsync(selectedPolicyId)
    onOpenChange(false)
  }

  const isAssigning = assignPolicy.isPending

  // Filter out policies that are already assigned to this service
  const availablePolicies = (policiesData?.rows ?? []).filter(
    (policy) => !existingPolicyIds.includes(policy.policy_id)
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Assign Policy to Service
          </DialogTitle>
          <DialogDescription>
            Search and select a policy to assign to this service. Already assigned policies are not shown.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Search Input */}
          <div className="space-y-2">
            <Label htmlFor="policy-search">Search Policies</Label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="policy-search"
                placeholder="Search by policy name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
                disabled={isAssigning}
              />
            </div>
          </div>

          {/* Policy List */}
          <div className="space-y-2">
            <Label>Available Policies</Label>
            <div className="border rounded-lg max-h-[300px] overflow-y-auto">
              {isLoading && (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  Loading policies...
                </div>
              )}

              {!isLoading && availablePolicies.length === 0 && (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  {searchQuery
                    ? "No policies found matching your search"
                    : "All available policies are already assigned to this service"}
                </div>
              )}

              {!isLoading && availablePolicies.length > 0 && (
                <div className="divide-y">
                  {availablePolicies.map((policy) => (
                    <div
                      key={policy.policy_id}
                      className={`p-4 cursor-pointer hover:bg-accent/50 transition-colors ${
                        selectedPolicyId === policy.policy_id ? "bg-accent" : ""
                      }`}
                      onClick={() => setSelectedPolicyId(policy.policy_id)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{policy.name}</h4>
                            {policy.is_system && (
                              <span className="text-xs px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground">
                                System
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{policy.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {selectedPolicyId === policy.policy_id && (
                            <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isAssigning}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleAssign}
            disabled={!selectedPolicyId || isAssigning}
            className="gap-2"
          >
            {isAssigning ? (
              "Assigning..."
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Assign Policy
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
