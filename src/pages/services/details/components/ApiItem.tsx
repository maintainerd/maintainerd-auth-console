import { MoreHorizontal, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SystemBadge } from "@/components/badges"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { ApiType } from "@/services/api/api/types"

interface ApiItemProps {
  api: ApiType
  onView: () => void
}

export function ApiItem({ api, onView }: ApiItemProps) {
  return (
    <div className="flex justify-between items-center p-4 border-b hover:bg-accent/50 transition-colors">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-medium">{api.display_name}</h4>
          <SystemBadge isSystem={api.is_default} />
        </div>
        <p className="text-sm text-muted-foreground">{api.description}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
          <span>Name: <span className="font-mono">{api.name}</span></span>
          <span>•</span>
          <span>ID: <span className="font-mono">{api.identifier}</span></span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant={api.status === "active" ? "secondary" : "outline"} className="capitalize">
          {api.status}
        </Badge>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onView}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

