import { useState } from "react"
import { format } from "date-fns"
import { ClipboardList } from "lucide-react"
import { DetailsContainer } from "@/components/container"
import { PageContainer, PageHeader } from "@/components/layout"
import { ResourceListing, type FilterGroup } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { ColumnDef, SortingState } from "@tanstack/react-table"
import { useAuditLogList } from "@/hooks/useAuditLog"
import type { AuditLogEntry } from "@/services/api/audit-log/types"

const DEFAULT_SORT: SortingState = [{ id: "created_at", desc: true }]
const SEARCH_FIELDS = ["resource_type", "action"]
const FILTER_GROUPS: readonly FilterGroup[] = [
  {
    key: "resource_type",
    label: "Resource",
    options: [
      "user",
      "client",
      "role",
      "policy",
      "tenant",
      "identity_provider",
      "registration_flow",
      "branding",
    ],
  },
  { key: "outcome", label: "Outcome", options: ["success", "failure", "partial"] },
]

function OutcomeBadge({ outcome }: { outcome: string }) {
  const variant =
    outcome === "success"
      ? "default"
      : outcome === "failure"
        ? "destructive"
        : "secondary"
  return (
    <Badge variant={variant} className="text-xs capitalize">
      {outcome}
    </Badge>
  )
}

const auditLogColumns: ColumnDef<AuditLogEntry>[] = [
  {
    accessorKey: "created_at",
    header: "Timestamp",
    cell: ({ getValue }) => {
      const val = getValue() as string
      return (
        <span className="font-mono text-sm text-muted-foreground">
          {format(new Date(val), "PPp")}
        </span>
      )
    },
  },
  {
    id: "actor",
    header: "Actor",
    cell: ({ row }) => {
      const entry = row.original
      return (
        <span className="font-mono text-xs">
          {entry.actor_user_id ?? entry.actor_client_id ?? "—"}
        </span>
      )
    },
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ getValue }) => (
      <span className="font-medium">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: "resource_type",
    header: "Resource Type",
    cell: ({ getValue }) => (
      <Badge variant="outline" className="text-xs capitalize">
        {String(getValue()).replace(/_/g, " ")}
      </Badge>
    ),
  },
  {
    accessorKey: "resource_id",
    header: "Resource ID",
    cell: ({ getValue }) => (
      <span className="font-mono text-xs text-muted-foreground">
        {(getValue() as string)?.slice(0, 8)}...
      </span>
    ),
  },
  {
    accessorKey: "outcome",
    header: "Outcome",
    cell: ({ getValue }) => <OutcomeBadge outcome={getValue() as string} />,
  },
]

export default function AuditLogPage() {
  const [selectedEntry, setSelectedEntry] = useState<AuditLogEntry | null>(null)

  return (
    <DetailsContainer>
      <PageContainer>
        <PageHeader
          title="Audit Log"
          description="Track all administrative actions — resource creates, updates, and deletes — across your tenant."
          icon={ClipboardList}
        />
        <ResourceListing
          columns={auditLogColumns}
          defaultSort={DEFAULT_SORT}
          searchFields={SEARCH_FIELDS}
          searchPlaceholder="Search by action or resource type..."
          useData={useAuditLogList}
          filterGroups={FILTER_GROUPS}
          emptyTitle="No audit entries yet"
          emptyDescription="Administrative actions will appear here as changes are made."
          onRowClick={(entry) => setSelectedEntry(entry)}
        />
      </PageContainer>

      <Dialog open={!!selectedEntry} onOpenChange={() => setSelectedEntry(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Audit Entry — {selectedEntry?.action}</DialogTitle>
          </DialogHeader>
          {selectedEntry && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Resource</span>
                  <p className="font-medium">{selectedEntry.resource_type}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Resource ID</span>
                  <p className="font-mono text-xs">{selectedEntry.resource_id}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Actor</span>
                  <p className="font-mono text-xs">
                    {selectedEntry.actor_user_id ?? selectedEntry.actor_client_id ?? "—"}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">IP Address</span>
                  <p className="font-mono text-xs">{selectedEntry.ip_address ?? "—"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Outcome</span>
                  <OutcomeBadge outcome={selectedEntry.outcome} />
                </div>
                <div>
                  <span className="text-muted-foreground">Timestamp</span>
                  <p className="text-xs">
                    {format(new Date(selectedEntry.created_at), "PPpp")}
                  </p>
                </div>
              </div>
              {selectedEntry.changes && (
                <div>
                  <h4 className="mb-2 text-sm font-medium">Changes</h4>
                  <pre className="overflow-auto rounded-md bg-muted p-3 text-xs">
                    {JSON.stringify(selectedEntry.changes, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DetailsContainer>
  )
}
