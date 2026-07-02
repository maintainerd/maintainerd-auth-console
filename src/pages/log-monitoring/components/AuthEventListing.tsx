import { useCallback } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { SortingState } from "@tanstack/react-table"
import { ResourceListing, type FilterGroup } from "@/components/data-table"
import { authEventColumns } from "./AuthEventColumns"
import { useAuthEventsList } from "@/hooks/useAuthEvents"
import { API_ENDPOINTS } from "@/services/api/config"

const DEFAULT_SORT: SortingState = [{ id: "created_at", desc: true }]
const SEARCH_FIELDS = ["event_type", "ip_address"]
const FILTER_GROUPS: readonly FilterGroup[] = [
  { key: "category", label: "Category", options: ["AUTHN", "AUTHZ", "SESSION", "USER", "SYSTEM"] },
  { key: "severity", label: "Severity", options: ["INFO", "WARN", "CRITICAL"] },
  { key: "result", label: "Result", options: ["success", "failure"] },
]

function buildExportUrl(format: "csv" | "json", searchParams: URLSearchParams): string {
  const params = new URLSearchParams(searchParams)
  params.set("format", format)
  params.delete("page")
  params.delete("limit")
  return `${API_ENDPOINTS.AUTH_EVENTS}/export?${params.toString()}`
}

export function AuthEventListing() {
  const navigate = useNavigate()
  const { tenantId } = useParams<{ tenantId: string }>()
  const [searchParams] = useSearchParams()

  const handleExport = useCallback((format: "csv" | "json") => {
    const url = buildExportUrl(format, searchParams)
    window.open(url, "_blank")
  }, [searchParams])

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" /> Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleExport("csv")}>CSV</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport("json")}>JSON</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <ResourceListing
        columns={authEventColumns}
        defaultSort={DEFAULT_SORT}
        searchFields={SEARCH_FIELDS}
        searchPlaceholder="Search events by type or IP..."
        useData={useAuthEventsList}
        filterGroups={FILTER_GROUPS}
        emptyTitle="No auth events yet"
        emptyDescription="Authentication and authorization events will appear here as users interact with the system."
        onRowClick={(event) => navigate(`/${tenantId}/logs/${event.auth_event_id}`)}
      />
    </div>
  )
}
