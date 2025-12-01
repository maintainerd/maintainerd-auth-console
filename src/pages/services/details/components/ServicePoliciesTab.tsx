import { useState, useMemo } from "react"
import { FileText, Search, Plus } from "lucide-react"
import { TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { InformationCard } from "@/components/card"
import { DataTablePagination } from "@/components/data-table"
import { PolicyItem } from "./PolicyItem"
import { PolicyAssignDialog } from "./PolicyAssignDialog"
import { useServicePolicies } from "../hooks/useServicePolicies"
import {
  getCoreRowModel,
  useReactTable,
  type PaginationState,
} from "@tanstack/react-table"

interface ServicePoliciesTabProps {
  serviceId: string
}

export function ServicePoliciesTab({ serviceId }: ServicePoliciesTabProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const { data, isLoading, error } = useServicePolicies({
    serviceId,
    limit: pagination.pageSize,
    page: pagination.pageIndex + 1,
    name: searchQuery || undefined
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
    <TabsContent value="policies" className="space-y-6">
      <InformationCard
        title="Applied Policies"
        description="Policies applied to this service for access control and permissions management"
        icon={FileText}
      >
        <div className="space-y-4">
          {/* Search filter and Add button */}
          <div className="flex items-center justify-between gap-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search policies..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setPagination({ pageIndex: 0, pageSize: 10 }) // Reset to first page on search
                }}
                className="pl-8"
              />
            </div>
            <Button variant="outline" size="sm" onClick={() => setIsDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Policy
            </Button>
          </div>

          {/* Horizontal line */}
          <div className="border-t" />

          {/* Scrollable content area */}
          <div className="max-h-[600px] overflow-y-auto pr-2">
            {isLoading && (
              <div className="text-center py-8 text-muted-foreground">
                Loading policies...
              </div>
            )}

            {error && (
              <div className="text-center py-8 text-destructive">
                Failed to load policies
              </div>
            )}

            {data && data.rows.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery ? "No policies found matching your search" : "No policies applied to this service"}
              </div>
            )}

            {data && data.rows.length > 0 && (
              <>
                {data.rows.map((policy) => (
                  <PolicyItem
                    key={policy.policy_id}
                    policy={policy}
                    serviceId={serviceId}
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

      {/* Policy Assign Dialog */}
      <PolicyAssignDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        serviceId={serviceId}
      />
    </TabsContent>
  )
}

