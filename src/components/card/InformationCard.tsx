import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"

interface InformationCardProps {
  title: string
  description?: string
  icon?: LucideIcon
  children: ReactNode
}

export function InformationCard({ title, description, icon: Icon, children }: InformationCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className={Icon ? "flex items-center gap-2" : undefined}>
          {Icon && <Icon className="h-5 w-5" />}
          {title}
        </CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  )
}

