import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { Server, Search } from "lucide-react"
import { TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { InformationCard } from "@/components/card"
import { DataTablePagination } from "@/components/data-table"
import { ApiItem } from "./ApiItem"
import { useServiceApis } from "../hooks/useServiceApis"
import {
  getCoreRowModel,
  useReactTable,
  type PaginationState,
} from "@tanstack/react-table"

interface ServiceApisTabProps {
  tenantId: string
  serviceId: string
}

export function ServiceApisTab({ tenantId, serviceId }: ServiceApisTabProps) {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const { data, isLoading, error } = useServiceApis({
    serviceId,
    limit: pagination.pageSize,
    page: pagination.pageIndex + 1,
    name: searchQuery || undefined,
    displayName: searchQuery || undefined,
    description: searchQuery || undefined,
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

  return (
    <TabsContent value="apis" className="space-y-6">
      <InformationCard
        title="Service APIs"
        description="Manage APIs and their permissions for this service"
        icon={Server}
      >
        <div className="space-y-4">
          {/* Search filter */}
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search APIs..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setPagination({ pageIndex: 0, pageSize: 10 }) // Reset to first page on search
              }}
              className="pl-8"
            />
          </div>

          {/* Horizontal line */}
          <div className="border-t" />

          {/* Scrollable content area */}
          <div className="max-h-[600px] overflow-y-auto pr-2">
            {isLoading && (
              <div className="text-center py-8 text-muted-foreground">
                Loading APIs...
              </div>
            )}

            {error && (
              <div className="text-center py-8 text-destructive">
                Failed to load APIs
              </div>
            )}

            {data && data.rows.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery ? "No APIs found matching your search" : "No APIs found for this service"}
              </div>
            )}

            {data && data.rows.length > 0 && (
              <>
                {data.rows.map((api) => (
                  <ApiItem
                    key={api.api_id}
                    api={api}
                    onClick={() => navigate(`/c/${tenantId}/apis/${api.api_id}`)}
                  />
                ))}
              </>
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
    </TabsContent>
  )
}

