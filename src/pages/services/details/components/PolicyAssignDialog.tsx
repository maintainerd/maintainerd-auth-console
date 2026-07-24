import { useState, useEffect, type FormEvent } from "react"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { usePolicies } from "@/hooks/usePolicies"
import { useServicePolicyMutations } from "../hooks/useServicePolicyMutations"
import { useToast } from "@/hooks/useToast"

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
  const [selectedPolicies, setSelectedPolicies] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  const { showSuccess, showError } = useToast()
  const { assignPolicy } = useServicePolicyMutations(serviceId)

  const { data: policiesData, isLoading: isLoadingPolicies } = usePolicies(
    {
      page: 1,
      limit: 100,
      sort_by: 'name',
      sort_order: 'asc'
    },
    { enabled: open }
  )

  useEffect(() => {
    if (!open) {
      setSelectedPolicies([])
      setSearchQuery("")
    }
  }, [open])

  const handlePolicyToggle = (policyId: string) => {
    setSelectedPolicies(prev =>
      prev.includes(policyId)
        ? prev.filter(id => id !== policyId)
        : [...prev, policyId]
    )
  }

  const handleSelectAll = () => {
    const availablePolicies = (policiesData?.rows ?? []).filter(
      policy => !existingPolicyIds.includes(policy.policy_id)
    )
    const availablePolicyIds = availablePolicies.map(p => p.policy_id)

    if (selectedPolicies.length === availablePolicyIds.length) {
      setSelectedPolicies([])
    } else {
      setSelectedPolicies(availablePolicyIds)
    }
  }

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault()
    if (selectedPolicies.length === 0) {
      showError("Please select at least one policy")
      return
    }

    try {
      await Promise.all(
        selectedPolicies.map(policyId => assignPolicy.mutateAsync(policyId))
      )

      showSuccess(`${selectedPolicies.length} polic${selectedPolicies.length !== 1 ? 'ies' : 'y'} assigned successfully`)
      onOpenChange(false)
    } catch (error) {
      showError(error)
    }
  }

  const isLoading = assignPolicy.isPending

  const filteredPolicies = policiesData?.rows?.filter(policy =>
    !existingPolicyIds.includes(policy.policy_id) &&
    (policy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (policy.description ?? "").toLowerCase().includes(searchQuery.toLowerCase()))
  ) ?? []

  const availablePoliciesCount = policiesData?.rows?.filter(
    policy => !existingPolicyIds.includes(policy.policy_id)
  ).length ?? 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Assign Policies to Service</DialogTitle>
          <DialogDescription>
            Select policies to assign to this service. Already assigned policies are not shown.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Select Policies</Label>
              {availablePoliciesCount > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleSelectAll}
                  className="h-7 text-xs"
                >
                  {selectedPolicies.length === availablePoliciesCount
                    ? "Deselect All"
                    : "Select All"}
                </Button>
              )}
            </div>

            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search policies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <div className="border rounded-lg max-h-[400px] overflow-y-auto">
            {isLoadingPolicies && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                Loading policies...
              </div>
            )}

            {!isLoadingPolicies && filteredPolicies.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                {searchQuery
                  ? "No policies found matching your search"
                  : "All available policies are already assigned"}
              </div>
            )}

            {!isLoadingPolicies && filteredPolicies.length > 0 && (
              <div className="divide-y">
                {filteredPolicies.map((policy) => (
                  <div
                    key={policy.policy_id}
                    className="flex items-start gap-3 p-3 hover:bg-accent/50 transition-colors"
                  >
                    <Checkbox
                      id={policy.policy_id}
                      checked={selectedPolicies.includes(policy.policy_id)}
                      onCheckedChange={() => handlePolicyToggle(policy.policy_id)}
                      disabled={isLoading}
                    />
                    <label
                      htmlFor={policy.policy_id}
                      className="flex-1 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{policy.name}</span>
                        {policy.is_system && (
                          <span className="text-xs px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground">
                            System
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {policy.description}
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedPolicies.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {selectedPolicies.length} polic{selectedPolicies.length !== 1 ? 'ies' : 'y'} selected
            </p>
          )}
        </div>

        <DialogFooter>
          <form onSubmit={handleSubmit} className="contents">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={selectedPolicies.length === 0 || isLoading}
              className="gap-2"
            >
              {isLoading ? (
                <>Assigning...</>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Assign Policies
                </>
              )}
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
