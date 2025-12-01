import { useNavigate, useParams } from "react-router-dom"
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
import type { ServiceType } from "@/services/api/service/types"

interface ServiceItemProps {
  service: ServiceType
  policyId: string
}

export function ServiceItem({ service }: ServiceItemProps) {
  const navigate = useNavigate()
  const { tenantId } = useParams<{ tenantId: string }>()

  const handleView = () => {
    navigate(`/${tenantId}/services/${service.service_id}`)
  }

  return (
    <div className="flex justify-between items-center p-4 border-b hover:bg-accent/50 transition-colors">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-medium">{service.display_name}</h4>
          <SystemBadge isSystem={service.is_system} />
        </div>
        <p className="text-sm text-muted-foreground">{service.description}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
          <span>Name: <span className="font-mono">{service.name}</span></span>
          <span>•</span>
          <span>Version: <span className="font-mono">{service.version}</span></span>
          <span>•</span>
          <span>APIs: {service.api_count}</span>
          <span>•</span>
          <span>Policies: {service.policy_count}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant={service.status === "active" ? "secondary" : "outline"} className="capitalize">
          {service.status}
        </Badge>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleView}>
              <Eye className="mr-2 h-4 w-4" />
              View Service
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

