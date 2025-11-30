import { Badge } from "@/components/ui/badge"
import { SystemBadge } from "@/components/badges"
import type { ApiType } from "@/services/api/api/types"

interface ApiItemProps {
  api: ApiType
  onClick: () => void
}

export function ApiItem({ api, onClick }: ApiItemProps) {
  return (
    <div
      className="flex justify-between items-center p-4 border-b cursor-pointer hover:bg-accent/50 transition-colors"
      onClick={onClick}
    >
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
      <div className="flex gap-2">
        <Badge variant={api.status === "active" ? "secondary" : "outline"} className="capitalize">
          {api.status}
        </Badge>
      </div>
    </div>
  )
}

