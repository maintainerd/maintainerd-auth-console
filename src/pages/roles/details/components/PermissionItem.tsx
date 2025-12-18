import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Key, Trash2 } from "lucide-react"
import { format } from "date-fns"

interface PermissionItemProps {
  permission: {
    permission_id: string
    name: string
    description: string
    api?: {
      display_name: string
      api_type: string
    }
    status: string
    is_system: boolean
    created_at: string
  }
  onDelete?: (permissionId: string, permissionName: string) => void
}

export function PermissionItem({ permission, onDelete }: PermissionItemProps) {
  return (
    <div className="flex items-start gap-3 py-3 border-b last:border-0">
      <div className="mt-1">
        <Key className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium font-mono text-sm">{permission.name}</span>
          {permission.is_system && (
            <Badge variant="secondary" className="text-xs">
              System
            </Badge>
          )}
          <Badge 
            variant={permission.status === 'active' ? 'default' : 'outline'} 
            className="text-xs capitalize"
          >
            {permission.status}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-2">{permission.description}</p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {permission.api && (
            <>
              <span>API: {permission.api.display_name}</span>
              <span>•</span>
              <span className="uppercase">{permission.api.api_type}</span>
              <span>•</span>
            </>
          )}
          <span>Created: {format(new Date(permission.created_at), "MMM d, yyyy")}</span>
        </div>
      </div>
      {onDelete && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(permission.permission_id, permission.name)}
          className="h-8 w-8 p-0"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
