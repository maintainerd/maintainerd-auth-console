import { useState, useMemo } from "react"
import { Server, Search } from "lucide-react"
import { TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { InformationCard } from "@/components/card"
import { DataTablePagination } from "@/components/data-table"
import { ServiceItem } from "./ServiceItem"
import { useServicesByPolicy } from "../hooks/useServicesByPolicy"
import {
  getCoreRowModel,
  useReactTable,
  type PaginationState,
} from "@tanstack/react-table"

interface PolicyServicesTabProps {
  policyId: string
}

export function PolicyServicesTab({ policyId }: PolicyServicesTabProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const { data, isLoading, error } = useServicesByPolicy({
    policyId,
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    name: searchQuery || undefined,
  })

  // Create a simple table instance for pagination
  const columns = useMemo(() => [], [])
  const tableData = useMemo(() => data?.rows || [], [data])

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
    <TabsContent value="services" className="space-y-6">
      <InformationCard
        title="Services"
        description="Services where this policy is applied"
        icon={Server}
      >
        <div className="space-y-4">
          {/* Search filter */}
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search services..."
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
                Loading services...
              </div>
            )}

            {error && (
              <div className="text-center py-8 text-destructive">
                Failed to load services
              </div>
            )}

            {!isLoading && !error && data && data.rows && data.rows.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery ? "No services found matching your search" : "This policy is not applied to any services"}
              </div>
            )}

            {!isLoading && !error && data && data.rows && data.rows.length > 0 && (
              <>
                {data.rows.map((service) => (
                  <ServiceItem key={service.service_id} service={service} policyId={policyId} />
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

