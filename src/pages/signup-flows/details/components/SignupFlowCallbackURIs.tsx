import { useState } from "react"
import { Link2, Plus, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { InformationCard } from "@/components/card"
import { EmptyState, ListSkeleton } from "@/components/details"
import { DataTablePagination, usePaginationTable, RowActions, type RowActionItem } from "@/components/data-table"
import {
  useSignupFlowCallbackURIs,
  useRemoveSignupFlowCallbackURI,
} from "@/hooks/useSignupFlows"
import { useToast } from "@/hooks/useToast"
import { AssignSignupFlowCallbackURIsDialog } from "./AssignSignupFlowCallbackURIsDialog"
import { type PaginationState } from "@tanstack/react-table"

interface SignupFlowCallbackURIsProps {
  signupFlowId: string
  clientId?: string
}

export function SignupFlowCallbackURIs({ signupFlowId, clientId }: SignupFlowCallbackURIsProps) {
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })
  const [isAddOpen, setIsAddOpen] = useState(false)

  const { showSuccess, showError } = useToast()
  const removeMutation = useRemoveSignupFlowCallbackURI()

  const { data, isLoading, isError } = useSignupFlowCallbackURIs(signupFlowId, {
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    sort_by: "created_at",
    sort_order: "desc",
  })

  const table = usePaginationTable({
    pagination,
    onPaginationChange: setPagination,
    pageCount: data?.total_pages ?? 0,
  })

  const existingClientUriIds = data?.rows.map((r) => r.client_uri_id) ?? []

  const removeURI = async (clientUriId: string) => {
    try {
      await removeMutation.mutateAsync({ signupFlowId, clientUriId })
      showSuccess("Callback URI removed successfully")
    } catch (error) {
      showError(error)
    }
  }

  // Callback URIs come from the flow's client's registered redirect URIs.
  if (!clientId) {
    return (
      <InformationCard
        title="Callback URIs"
        description="Redirect URIs this flow may return to after authentication"
        icon={Link2}
      >
        <EmptyState
          icon={Link2}
          title="No client attached"
          description="Attach a client to this auth flow first — callback URIs are chosen from the client's registered redirect URIs."
        />
      </InformationCard>
    )
  }

  return (
    <>
      <InformationCard
        title="Callback URIs"
        description="Redirect URIs this flow may return to, chosen from the client's registered redirect URIs"
        icon={Link2}
        action={
          <Button onClick={() => setIsAddOpen(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add URIs
          </Button>
        }
      >
        <div className="space-y-4">
          {isLoading && <ListSkeleton />}

          {isError && (
            <p className="py-8 text-center text-sm text-destructive">Failed to load callback URIs</p>
          )}

          {data && data.rows.length === 0 && (
            <EmptyState
              icon={Link2}
              title="No callback URIs"
              description="Add callback URIs from the client's registered redirect URIs."
            />
          )}

          {data && data.rows.length > 0 && (
            <div className="space-y-3">
              {data.rows.map((uri) => {
                const actions: RowActionItem[] = [
                  {
                    key: "remove",
                    label: "Remove Callback URI",
                    icon: Trash2,
                    destructive: true,
                    onSelect: () => removeURI(uri.client_uri_id),
                    confirm: {
                      title: "Remove Callback URI",
                      description:
                        "This detaches the callback URI from this auth flow. The client's registered URI is not deleted.",
                      confirmText: "Remove",
                    },
                  },
                ]

                return (
                  <div
                    key={uri.auth_flow_callback_uri_id}
                    className="flex items-start justify-between gap-3 rounded-lg border p-4"
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        <Link2 className="size-4" />
                      </div>
                      <div className="min-w-0 space-y-1">
                        <p className="break-all font-mono text-sm">{uri.uri}</p>
                        <div className="text-xs text-muted-foreground">
                          Added {format(new Date(uri.created_at), "MMM dd, yyyy")}
                        </div>
                      </div>
                    </div>
                    <RowActions items={actions} />
                  </div>
                )
              })}
            </div>
          )}

          {data && data.total > 0 && (
            <div className="border-t pt-4">
              <DataTablePagination table={table} rowCount={data.total} />
            </div>
          )}
        </div>
      </InformationCard>

      <AssignSignupFlowCallbackURIsDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        signupFlowId={signupFlowId}
        clientId={clientId}
        existingClientUriIds={existingClientUriIds}
      />
    </>
  )
}
