import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"

interface InformationCardProps {
  title: string
  description?: string
  icon?: LucideIcon
  action?: ReactNode
  children: ReactNode
}

export function InformationCard({ title, description, icon: Icon, action, children }: InformationCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle className={Icon ? "flex items-center gap-2" : undefined}>
              {Icon && <Icon className="h-5 w-5" />}
              {title}
            </CardTitle>
            {description && (
              <p className="text-sm text-muted-foreground mt-1.5">{description}</p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  )
}

