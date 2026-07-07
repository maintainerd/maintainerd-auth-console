import { useState } from "react"
import { format } from "date-fns"
import { History } from "lucide-react"
import { EmptyState, ListSkeleton } from "@/components/details"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { usePolicyHistory } from "@/hooks/usePolicies"
import type { PolicyVersionHistory } from "@/services/api/policies/types"

interface PolicyHistoryTabProps {
  policyId: string
}

export function PolicyHistoryTab({ policyId }: PolicyHistoryTabProps) {
  const { data, isLoading } = usePolicyHistory(policyId)
  const [selected, setSelected] = useState<PolicyVersionHistory | null>(null)
  const versions = data?.rows ?? []

  return (
    <div className="space-y-4">
      {isLoading && <ListSkeleton />}

      {!isLoading && versions.length === 0 && (
        <EmptyState
          icon={History}
          title="No history"
          description="No previous versions of this policy exist."
        />
      )}

      {versions.map((v) => (
        <div
          key={v.version_number}
          className="flex items-center justify-between rounded-lg border p-3"
        >
          <div className="space-y-0.5">
            <span className="text-sm font-medium">Version {v.version_number}</span>
            <p className="text-xs text-muted-foreground">
              {format(new Date(v.snapshot_at), "PPp")}
              {v.changed_by_user_id && ` — by ${v.changed_by_user_id}`}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setSelected(v)}>
            View
          </Button>
        </div>
      ))}

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Version {selected?.version_number}</DialogTitle>
          </DialogHeader>
          {selected && (
            <pre className="max-h-96 overflow-auto rounded-md bg-muted p-3 text-xs">
              {JSON.stringify(selected.document, null, 2)}
            </pre>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
