import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Key, Calendar, Globe, Unlink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { InformationCard } from "@/components/card"
import { EmptyState, ListSkeleton } from "@/components/details"
import { DataTablePagination, usePaginationTable } from "@/components/data-table"
import { useUserIdentities, useUnlinkUserIdentity } from "@/hooks/useUsers"
import { useToast } from "@/hooks/useToast"
import type { UserIdentity } from "@/services/api/users/types"
import { type PaginationState } from "@tanstack/react-table"

interface UserIdentitiesProps {
  userId: string
}

export function UserIdentities({ userId }: UserIdentitiesProps) {
  const { showSuccess, showError } = useToast()
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const { data, isLoading, isError } = useUserIdentities(userId, {
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    sort_by: 'created_at',
    sort_order: 'desc',
  })

  const unlinkMutation = useUnlinkUserIdentity()

  const handleUnlink = async (identityId: string) => {
    try {
      await unlinkMutation.mutateAsync({ userId, identityId })
      showSuccess("Identity unlinked")
    } catch (error) {
      showError(error)
    }
  }

export function UserIdentities({ userId }: UserIdentitiesProps) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const { data, isLoading, isError } = useUserIdentities(userId, {
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    sort_by: 'created_at',
    sort_order: 'desc',
  })

  const table = usePaginationTable({
    pagination,
    onPaginationChange: setPagination,
    pageCount: data?.total_pages ?? 0,
  })

  return (
    <InformationCard
      title="User Identities"
      description="How this user can authenticate — provider, subject, and the client each identity is linked to. Read-only."
      icon={Key}
    >
      <div className="space-y-4">
        {isLoading && <ListSkeleton />}

        {isError && (
          <p className="py-8 text-center text-sm text-destructive">Failed to load identities</p>
        )}

        {data && data.rows.length === 0 && (
          <EmptyState
            icon={Key}
            title="No identities"
            description="This user has no linked authentication identities yet."
          />
        )}

        {data && data.rows.length > 0 && (
          <div className="space-y-3">
            {data.rows.map((identity: UserIdentity) => (
              <div key={identity.user_identity_id} className="rounded-lg border p-4">
                <div className="flex items-start gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <Key className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1 space-y-3">
                    {/* Provider + subject */}
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-0.5">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Provider
                        </p>
                        <p className="text-sm font-medium capitalize">{identity.provider}</p>
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Subject
                        </p>
                        <p className="break-all font-mono text-sm">{identity.sub}</p>
                      </div>
                    </div>

                    {/* Linked client */}
                    {identity.client && (
                      <div className="space-y-2 rounded-md border bg-muted/30 p-3">
                        <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          <Globe className="size-3.5" />
                          Linked client
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-medium">{identity.client.display_name}</span>
                          <Badge variant="secondary" className="font-normal capitalize">
                            {identity.client.client_type}
                          </Badge>
                          {identity.client.is_default && (
                            <Badge variant="outline" className="font-normal">
                              Default
                            </Badge>
                          )}
                          {identity.client.is_system && (
                            <Badge variant="outline" className="font-normal">
                              System
                            </Badge>
                          )}
                        </div>
                        {identity.client.domain && (
                          <p className="break-all font-mono text-xs text-muted-foreground">
                            {identity.client.domain}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="size-3" />
                        Connected {format(new Date(identity.created_at), "PPP")}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs h-7"
                        disabled={unlinkMutation.isPending}
                        onClick={() => handleUnlink(identity.user_identity_id)}
                      >
                        <Unlink className="size-3 mr-1" /> Unlink
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination controls */}
        {data && data.total > 0 && (
          <div className="pt-4 border-t">
            <DataTablePagination table={table} rowCount={data.total} />
          </div>
        )}
      </div>
    </InformationCard>
  )
}
