import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { PolicyStatementType } from "@/services/api/policy/types"

interface PolicyStatementsTabProps {
  statements: PolicyStatementType[]
}

export function PolicyStatementsTab({ statements }: PolicyStatementsTabProps) {
  if (statements.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">No statements defined for this policy.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {statements.map((statement, index) => (
        <Card key={index}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Statement {index + 1}</CardTitle>
              <Badge
                variant={statement.effect === "allow" ? "default" : "destructive"}
                className={
                  statement.effect === "allow"
                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                    : "bg-red-100 text-red-800 hover:bg-red-100"
                }
              >
                {statement.effect.toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Actions</p>
              <div className="flex flex-wrap gap-2">
                {statement.action.map((action, actionIndex) => (
                  <Badge key={actionIndex} variant="outline" className="font-mono text-xs">
                    {action}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Resources</p>
              <div className="flex flex-wrap gap-2">
                {statement.resource.map((resource, resourceIndex) => (
                  <Badge key={resourceIndex} variant="outline" className="font-mono text-xs">
                    {resource}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

