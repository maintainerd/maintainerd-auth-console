import { useParams, useNavigate } from "react-router-dom"
import { Plus, Download, Upload, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ApiToolbar() {
  const { tenantId } = useParams<{ tenantId: string }>()
  const navigate = useNavigate()

  const handleCreateApi = () => {
    navigate(`/${tenantId}/apis/create`)
  }

  const handleImportApis = () => {
    console.log("Import APIs")
    // TODO: Implement import functionality
  }

  const handleExportApis = () => {
    console.log("Export APIs")
    // TODO: Implement export functionality
  }

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Actions
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuLabel>Bulk Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleImportApis}>
            <Upload className="mr-2 h-4 w-4" />
            Import APIs
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleExportApis}>
            <Download className="mr-2 h-4 w-4" />
            Export APIs
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Button onClick={handleCreateApi} className="gap-2">
        <Plus className="h-4 w-4" />
        Create API
      </Button>
    </div>
  )
}
