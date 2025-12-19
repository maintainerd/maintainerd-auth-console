import { useState, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Key, Calendar, Globe } from "lucide-react"
import { format } from "date-fns"
import { InformationCard } from "@/components/card"
import { DataTablePagination } from "@/components/data-table"
import { useUserIdentities } from "@/hooks/useUsers"
import type { UserIdentityType } from "@/services/api/user/types"
import {
  getCoreRowModel,
  useReactTable,
  type PaginationState,
} from "@tanstack/react-table"

interface UserIdentitiesProps {
  userId: string
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

  // Create a simple table instance for pagination
  const columns = useMemo(() => [], [])
  const tableData = data?.rows || []

  const table = useReactTable({
    data: tableData,
    columns,
    pageCount: data?.total_pages || 0,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  })

  const getProviderBadge = (provider: string) => {
    const colors: Record<string, string> = {
      default: "bg-blue-100 text-blue-800 border-blue-200",
      google: "bg-red-100 text-red-800 border-red-200",
      github: "bg-gray-100 text-gray-800 border-gray-200",
      facebook: "bg-indigo-100 text-indigo-800 border-indigo-200",
    }

    return (
      <Badge variant="outline" className={colors[provider] || colors.default}>
        {provider.charAt(0).toUpperCase() + provider.slice(1)}
      </Badge>
    )
  }

  return (
    <InformationCard
      title="User Identities"
      description="Authentication identities associated with this user"
      icon={Key}
    >
      <div className="space-y-4">
        {/* Horizontal line */}
        <div className="border-t" />

        {/* Scrollable content area */}
        <div className="max-h-[600px] overflow-y-auto pr-2">
          {isLoading && (
            <div className="text-center py-8 text-muted-foreground">
              Loading identities...
            </div>
          )}

          {isError && (
            <div className="text-center py-8 text-destructive">
              Failed to load identities
            </div>
          )}

          {data && data.rows.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No identities found for this user
            </div>
          )}

          {data && data.rows.length > 0 && (
            <div className="space-y-3">
              {data.rows.map((identity: UserIdentityType) => (
                <div
                  key={identity.user_identity_id}
                  className="flex items-start justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Key className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">Identity Provider</p>
                        {getProviderBadge(identity.provider)}
                      </div>
                      
                      <div className="text-sm space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground w-20">Subject:</span>
                          <span className="font-mono text-xs">{identity.sub}</span>
                        </div>
                      </div>

                      {/* Client Information */}
                      <div className="mt-3 p-3 bg-muted/50 rounded-md space-y-2">
                        <div className="flex items-center gap-2">
                          <Globe className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs font-medium">Client Information</span>
                        </div>
                        <div className="text-xs space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground w-24">Name:</span>
                            <span className="font-medium">{identity.client.display_name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground w-24">Type:</span>
                            <Badge variant="secondary" className="text-xs h-5">
                              {identity.client.client_type}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground w-24">Domain:</span>
                            <span className="font-mono">{identity.client.domain}</span>
                          </div>
                          {identity.client.is_default && (
                            <Badge variant="outline" className="text-xs mt-1">
                              Default Client
                            </Badge>
                          )}
                          {identity.client.is_system && (
                            <Badge variant="outline" className="text-xs mt-1 ml-1">
                              System Client
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                        <Calendar className="h-3 w-3" />
                        Created {format(new Date(identity.created_at), "PPP")}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

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
