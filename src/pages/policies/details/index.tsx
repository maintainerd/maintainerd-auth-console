import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { format } from "date-fns"
import { ArrowLeft, Edit, Shield, FileText, Server, Activity, Plus, Eye, AlertTriangle, Copy, Download, Code, CheckCircle, XCircle, Info, Search, Maximize2, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MOCK_POLICIES } from "../constants"
import type { PolicyEffect, PolicyStatement } from "../constants"

export default function PolicyDetailsPage() {
  const { containerId, policyId } = useParams<{ containerId: string; policyId: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("overview")
  const [expandedStatements, setExpandedStatements] = useState<Set<number>>(new Set())
  const [statementSearch, setStatementSearch] = useState("")
  const [showJsonView, setShowJsonView] = useState(false)
  
  const policy = MOCK_POLICIES.find(p => p.id === policyId)

  if (!policy) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Policy Not Found</h2>
          <p className="text-muted-foreground mt-2">
            The policy you're looking for doesn't exist or has been removed.
          </p>
        </div>
        <Button onClick={() => navigate(`/c/${containerId}/policies`)} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Policies
        </Button>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "inactive":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
      case "draft":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Active"
      case "inactive":
        return "Inactive"
      case "draft":
        return "Draft"
      default:
        return status
    }
  }

  const getEffectBadge = (effect: PolicyEffect) => {
    return (
      <Badge
        variant={effect === "allow" ? "default" : "destructive"}
        className={effect === "allow"
          ? "text-xs bg-green-100 text-green-800 border-green-200 hover:bg-green-200"
          : "text-xs bg-red-100 text-red-800 border-red-200 hover:bg-red-200"
        }
      >
        {effect === "allow" ? (
          <CheckCircle className="mr-1 h-3 w-3" />
        ) : (
          <XCircle className="mr-1 h-3 w-3" />
        )}
        {effect.toUpperCase()}
      </Badge>
    )
  }



  const copyStatementToClipboard = (statement: PolicyStatement) => {
    const statementJson = JSON.stringify(statement, null, 2)
    navigator.clipboard.writeText(statementJson)
  }

  const copyAllStatementsToClipboard = () => {
    const statementsJson = JSON.stringify(policy?.statements, null, 2)
    navigator.clipboard.writeText(statementsJson)
  }

  const toggleStatementExpansion = (index: number) => {
    const newExpanded = new Set(expandedStatements)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedStatements(newExpanded)
  }

  const exportStatements = () => {
    const statementsJson = JSON.stringify(policy?.statements, null, 2)
    const blob = new Blob([statementsJson], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${policy?.name}-statements.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getStatementRiskLevel = (statement: PolicyStatement) => {
    const hasWildcardActions = statement.actions.some(action => action === "*" || action.includes("*"))
    const hasWildcardResources = statement.resources.some(resource => resource === "*")
    const isDenyStatement = statement.effect === "deny"

    if (isDenyStatement) return "low"
    if (hasWildcardActions && hasWildcardResources) return "high"
    if (hasWildcardActions || hasWildcardResources) return "medium"
    return "low"
  }

  const getRiskBadge = (riskLevel: string) => {
    const variants = {
      high: { variant: "destructive" as const, icon: AlertTriangle, text: "High Risk" },
      medium: { variant: "secondary" as const, icon: Info, text: "Medium Risk" },
      low: { variant: "outline" as const, icon: CheckCircle, text: "Low Risk" }
    }
    const config = variants[riskLevel as keyof typeof variants]
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="text-xs">
        <Icon className="mr-1 h-3 w-3" />
        {config.text}
      </Badge>
    )
  }

  const filteredStatements = policy?.statements.filter(statement => {
    if (!statementSearch) return true
    const searchLower = statementSearch.toLowerCase()
    return (
      statement.effect.toLowerCase().includes(searchLower) ||
      statement.actions.some(action => action.toLowerCase().includes(searchLower)) ||
      statement.resources.some(resource => resource.toLowerCase().includes(searchLower)) ||
      (statement.conditions && JSON.stringify(statement.conditions).toLowerCase().includes(searchLower))
    )
  }) || []

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col gap-6">
        {/* Back Button */}
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/c/${containerId}/policies`)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Policies
          </Button>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight">{policy.name}</h1>
              {policy.isSystem && (
                <Badge variant="secondary" className="text-xs">
                  <Shield className="h-3 w-3 mr-1" />
                  System
                </Badge>
              )}
              <Badge className={getStatusColor(policy.status)}>
                {getStatusText(policy.status)}
              </Badge>
            </div>
            <p className="text-muted-foreground max-w-2xl">{policy.description}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => navigate(`/c/${containerId}/policies/${policyId}/edit`)}
              disabled={policy.isSystem}
            >
              <Edit className="h-4 w-4" />
              Edit Policy
            </Button>
          </div>
        </div>

        {/* Policy Information */}
        <Card>
          <CardHeader>
            <CardTitle>Policy Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Policy ID</p>
                <p className="text-sm font-mono">{policy.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Version</p>
                <p className="text-sm font-mono">v{policy.version}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Created</p>
                <p className="text-sm">{format(new Date(policy.createdAt), "PPP")}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Created By</p>
                <p className="text-sm">{policy.createdBy}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                <p className="text-sm">{format(new Date(policy.updatedAt), "PPP")}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Type</p>
                <p className="text-sm">{policy.isSystem ? "System Policy" : "Custom Policy"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="overview" className="gap-2">
                <Activity className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="statements" className="gap-2">
                <FileText className="h-4 w-4" />
                Statements ({policy.statements.length})
              </TabsTrigger>
              <TabsTrigger value="services" className="gap-2">
                <Server className="h-4 w-4" />
                Applied Services ({policy.serviceCount})
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Policy Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Policy Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Statements</span>
                      <span className="font-medium">{policy.statements.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Allow Statements</span>
                      <span className="font-medium text-green-600">
                        {policy.statements.filter(s => s.effect === "allow").length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Deny Statements</span>
                      <span className="font-medium text-red-600">
                        {policy.statements.filter(s => s.effect === "deny").length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Applied to Services</span>
                      <span className="font-medium">{policy.serviceCount}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Service Application */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Server className="h-5 w-5" />
                      Service Application
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {policy.appliedToServices.length > 0 ? (
                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground">
                          This policy is currently applied to {policy.serviceCount} service{policy.serviceCount !== 1 ? 's' : ''}:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {policy.appliedToServices.map((service) => (
                            <Badge key={service} variant="outline" className="text-sm">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <AlertTriangle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                          This policy is not currently applied to any services
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="statements" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Policy Statements</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Define what actions are allowed or denied for specific resources
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search statements..."
                          value={statementSearch}
                          onChange={(e) => setStatementSearch(e.target.value)}
                          className="pl-8 w-64"
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowJsonView(!showJsonView)}
                        className="gap-2"
                      >
                        <Code className="h-4 w-4" />
                        {showJsonView ? "Visual" : "JSON"}
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="gap-2">
                            <Download className="h-4 w-4" />
                            Export
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={copyAllStatementsToClipboard}>
                            <Copy className="mr-2 h-4 w-4" />
                            Copy to Clipboard
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={exportStatements}>
                            <Download className="mr-2 h-4 w-4" />
                            Download JSON
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {showJsonView ? (
                    <div className="bg-muted p-4 rounded-md">
                      <pre className="text-xs font-mono overflow-x-auto">
                        {JSON.stringify({
                          Version: policy.version,
                          Statement: policy.statements
                        }, null, 2)}
                      </pre>
                    </div>
                  ) : filteredStatements.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No statements found</h3>
                      <p className="text-sm text-muted-foreground text-center mb-4">
                        {statementSearch ? "No statements match your search criteria." : "This policy doesn't have any statements yet."}
                      </p>
                      <Button onClick={() => navigate(`/c/${containerId}/policies/${policyId}/edit`)}>
                        Add Statement
                      </Button>
                    </div>
                  ) : (
                    <TooltipProvider>
                      <div className="space-y-4">
                        {filteredStatements.map((statement, index) => {
                        const originalIndex = policy.statements.indexOf(statement)
                        const riskLevel = getStatementRiskLevel(statement)
                        const isExpanded = expandedStatements.has(originalIndex)

                        return (
                          <div key={originalIndex} className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">Statement {originalIndex + 1}</span>
                                {getEffectBadge(statement.effect)}
                                {getRiskBadge(riskLevel)}
                              </div>
                              <div className="flex items-center gap-2">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => copyStatementToClipboard(statement)}
                                    >
                                      <Copy className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Copy statement to clipboard</p>
                                  </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => toggleStatementExpansion(originalIndex)}
                                    >
                                      {isExpanded ? (
                                        <Minimize2 className="h-4 w-4" />
                                      ) : (
                                        <Maximize2 className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{isExpanded ? "Minimize" : "Maximize"} statement details</p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                            </div>
                            <div className="space-y-4">
                              {/* Summary View */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-sm font-medium text-muted-foreground">Actions ({statement.actions.length})</Label>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {statement.actions.slice(0, isExpanded ? undefined : 3).map((action, actionIndex) => (
                                      <Badge key={actionIndex} variant="outline" className="text-xs font-mono">
                                        {action}
                                      </Badge>
                                    ))}
                                    {!isExpanded && statement.actions.length > 3 && (
                                      <Badge variant="secondary" className="text-xs">
                                        +{statement.actions.length - 3} more
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-muted-foreground">Resources ({statement.resources.length})</Label>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {statement.resources.slice(0, isExpanded ? undefined : 3).map((resource, resourceIndex) => (
                                      <Badge key={resourceIndex} variant="outline" className="text-xs font-mono">
                                        {resource}
                                      </Badge>
                                    ))}
                                    {!isExpanded && statement.resources.length > 3 && (
                                      <Badge variant="secondary" className="text-xs">
                                        +{statement.resources.length - 3} more
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Expanded Details */}
                              <Collapsible open={isExpanded}>
                                <CollapsibleContent className="space-y-4">
                                  {/* Full Actions List */}
                                  {statement.actions.length > 3 && (
                                    <div>
                                      <Label className="text-sm font-medium text-muted-foreground">All Actions</Label>
                                      <div className="bg-muted p-3 rounded-md mt-1">
                                        <div className="flex flex-wrap gap-1">
                                          {statement.actions.map((action, actionIndex) => (
                                            <Badge key={actionIndex} variant="outline" className="text-xs font-mono">
                                              {action}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* Full Resources List */}
                                  {statement.resources.length > 3 && (
                                    <div>
                                      <Label className="text-sm font-medium text-muted-foreground">All Resources</Label>
                                      <div className="bg-muted p-3 rounded-md mt-1">
                                        <div className="flex flex-wrap gap-1">
                                          {statement.resources.map((resource, resourceIndex) => (
                                            <Badge key={resourceIndex} variant="outline" className="text-xs font-mono">
                                              {resource}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* Conditions */}
                                  {statement.conditions && Object.keys(statement.conditions).length > 0 && (
                                    <div>
                                      <Label className="text-sm font-medium text-muted-foreground">Conditions</Label>
                                      <div className="bg-muted p-3 rounded-md mt-1">
                                        <pre className="text-xs font-mono">
                                          {JSON.stringify(statement.conditions, null, 2)}
                                        </pre>
                                      </div>
                                    </div>
                                  )}

                                  {/* Statement Analysis */}
                                  <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-md">
                                    <Label className="text-sm font-medium text-blue-900 dark:text-blue-100">Statement Analysis</Label>
                                    <div className="mt-2 space-y-1 text-xs text-blue-800 dark:text-blue-200">
                                      <p>• Effect: <strong>{statement.effect.toUpperCase()}</strong></p>
                                      <p>• Actions: {statement.actions.length} permission(s)</p>
                                      <p>• Resources: {statement.resources.length} resource(s)</p>
                                      <p>• Risk Level: <strong>{riskLevel.toUpperCase()}</strong></p>
                                      {statement.conditions && (
                                        <p>• Conditions: {Object.keys(statement.conditions).length} condition(s) applied</p>
                                      )}
                                    </div>
                                  </div>
                                </CollapsibleContent>
                              </Collapsible>
                            </div>
                          </div>
                        )
                        })}
                      </div>
                    </TooltipProvider>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="services" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Applied Services</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Services that this policy is currently applied to
                      </p>
                    </div>
                    <Button
                      className="gap-2"
                      onClick={() => navigate(`/c/${containerId}/policies/${policyId}/services/add`)}
                    >
                      <Plus className="h-4 w-4" />
                      Add Service
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {policy.appliedToServices.length > 0 ? (
                    <div className="space-y-4">
                      {policy.appliedToServices.map((service) => (
                        <div key={service} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{service}</span>
                              <Badge variant="outline" className="text-xs">
                                Service
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Policy is actively applied to this service
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span>Applied {format(new Date(policy.createdAt), "MMM d, yyyy")}</span>
                              <span>by {policy.createdBy}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/c/${containerId}/services`)}
                            >
                              View Service
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/c/${containerId}/policies/${policyId}/services/remove?service=${service}`)}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Server className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Services Applied</h3>
                      <p className="text-muted-foreground mb-4">
                        This policy is not currently applied to any services. Add services to start applying this policy's rules.
                      </p>
                      <Button
                        className="gap-2"
                        onClick={() => navigate(`/c/${containerId}/policies/${policyId}/services/add`)}
                      >
                        <Plus className="h-4 w-4" />
                        Add First Service
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
