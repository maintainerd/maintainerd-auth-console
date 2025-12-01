import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { FileText, Search } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { policyKeys } from "@/hooks/usePolicies"
import { fetchPolicies } from "@/services/api/policy"
import { useServicePolicyMutations } from "../hooks/useServicePolicyMutations"

interface PolicyAssignDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  serviceId: string
}

export function PolicyAssignDialog({
  open,
  onOpenChange,
  serviceId,
}: PolicyAssignDialogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPolicyId, setSelectedPolicyId] = useState<string | null>(null)

  // Only fetch policies when dialog is open
  const params = {
    page: 1,
    limit: 100,
    name: searchQuery || undefined,
  }

  const { data: policiesData, isLoading } = useQuery({
    queryKey: policyKeys.list(params),
    queryFn: () => fetchPolicies(params),
    enabled: open, // Only fetch when dialog is open
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Assign Policy to Service
          </DialogTitle>
          <DialogDescription>
            Search and select a policy to assign to this service.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
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
            <div className="border rounded-lg max-h-[400px] overflow-y-auto">
              {isLoading && (
                <div className="text-center py-8 text-muted-foreground">
                  Loading policies...
                </div>
              )}

              {!isLoading && policiesData && policiesData.rows.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  {searchQuery ? "No policies found matching your search" : "No policies available"}
                </div>
              )}

              {!isLoading && policiesData && policiesData.rows.length > 0 && (
                <div className="divide-y">
                  {policiesData.rows.map((policy) => (
                    <div
                      key={policy.policy_id}
                      className={`p-4 cursor-pointer hover:bg-accent transition-colors ${
                        selectedPolicyId === policy.policy_id ? "bg-accent" : ""
                      }`}
                      onClick={() => setSelectedPolicyId(policy.policy_id)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{policy.name}</h4>
                            {policy.is_system && (
                              <Badge variant="outline" className="text-xs">
                                System
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{policy.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={policy.status === "active" ? "secondary" : "outline"} className="capitalize">
                            {policy.status}
                          </Badge>
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

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
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
            >
              {isAssigning ? "Assigning..." : "Assign Policy"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

