import { useNavigate } from "react-router-dom"
import { Edit, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface ServiceHeaderProps {
  service: {
    displayName: string
    description: string
    status: string
    isSystem: boolean
  }
  tenantId: string
  serviceId: string
  getStatusColor: (status: string) => string
  getStatusText: (status: string) => string
}

export function ServiceHeader({ service, tenantId, serviceId, getStatusColor, getStatusText }: ServiceHeaderProps) {
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">{service.displayName}</h1>
          <Badge className={getStatusColor(service.status)}>
            {getStatusText(service.status)}
          </Badge>
          {service.isSystem && (
            <Badge variant="secondary" className="gap-1">
              <Shield className="h-3 w-3" />
              System
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground">{service.description}</p>
      </div>
      <Button
        variant="outline"
        className="gap-2"
        onClick={() => navigate(`/c/${tenantId}/services/${serviceId}/edit`)}
      >
        <Edit className="h-4 w-4" />
        Edit Service
      </Button>
    </div>
  )
}

