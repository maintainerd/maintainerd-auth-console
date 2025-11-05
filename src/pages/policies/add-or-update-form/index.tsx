import { useState, useEffect } from "react"
import { useParams, useNavigate, useSearchParams } from "react-router-dom"
import { ArrowLeft, Save, Trash2, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { MOCK_POLICIES, POLICY_STATUSES } from "../constants"
import type { PolicyStatus, PolicyStatement, PolicyEffect } from "../constants"

export default function PolicyAddOrUpdateForm() {
  const { tenantId, policyId } = useParams<{ tenantId: string; policyId?: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isEditing = !!policyId
  const isCreating = !isEditing

  // Find existing policy if editing
  const existingPolicy = isEditing ? MOCK_POLICIES.find(p => p.id === policyId) : null

  // Get pre-selected service from query params
  const preSelectedServiceId = searchParams.get('serviceId')

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "draft" as PolicyStatus,
    version: "1.0.0",
  })

  const [statements, setStatements] = useState<PolicyStatement[]>([
    {
      effect: "allow" as PolicyEffect,
      actions: [""],
      resources: [""],
      conditions: {}
    }
  ])

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  // Load existing data if editing
  useEffect(() => {
    if (existingPolicy) {
      setFormData({
        name: existingPolicy.name,
        description: existingPolicy.description,
        status: existingPolicy.status,
        version: existingPolicy.version,
      })
      setStatements(existingPolicy.statements)
    }
  }, [existingPolicy, preSelectedServiceId])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Policy name is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    if (statements.length === 0) {
      newErrors.statements = "At least one statement is required"
    }

    // Validate statements
    statements.forEach((statement, index) => {
      if (statement.actions.length === 0 || statement.actions.every(a => !a.trim())) {
        newErrors[`statement_${index}_actions`] = "At least one action is required"
      }
      if (statement.resources.length === 0 || statement.resources.every(r => !r.trim())) {
        newErrors[`statement_${index}_resources`] = "At least one resource is required"
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const policyData = {
        ...formData,
        statements: statements.filter(s => 
          s.actions.some(a => a.trim()) && s.resources.some(r => r.trim())
        )
      }
      
      if (isCreating) {
        console.log("Creating policy:", policyData)
      } else {
        console.log("Updating policy:", policyId, policyData)
      }
      
      // Navigate back to policies list
      navigate(`/${tenantId}/policies`)
    } catch (error) {
      console.error("Error saving policy:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this policy? This action cannot be undone.")) {
      return
    }

    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log("Deleting policy:", policyId)
      navigate(`/${tenantId}/policies`)
    } catch (error) {
      console.error("Error deleting policy:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const addStatement = () => {
    setStatements([...statements, {
      effect: "allow",
      actions: [""],
      resources: [""],
      conditions: {}
    }])
  }

  const removeStatement = (index: number) => {
    if (statements.length > 1) {
      setStatements(statements.filter((_, i) => i !== index))
    }
  }

  const updateStatement = (index: number, field: keyof PolicyStatement, value: any) => {
    const newStatements = [...statements]
    newStatements[index] = { ...newStatements[index], [field]: value }
    setStatements(newStatements)
  }

  const addActionToStatement = (statementIndex: number) => {
    const newStatements = [...statements]
    newStatements[statementIndex].actions.push("")
    setStatements(newStatements)
  }

  const removeActionFromStatement = (statementIndex: number, actionIndex: number) => {
    const newStatements = [...statements]
    if (newStatements[statementIndex].actions.length > 1) {
      newStatements[statementIndex].actions.splice(actionIndex, 1)
      setStatements(newStatements)
    }
  }

  const updateActionInStatement = (statementIndex: number, actionIndex: number, value: string) => {
    const newStatements = [...statements]
    newStatements[statementIndex].actions[actionIndex] = value
    setStatements(newStatements)
  }

  const addResourceToStatement = (statementIndex: number) => {
    const newStatements = [...statements]
    newStatements[statementIndex].resources.push("")
    setStatements(newStatements)
  }

  const removeResourceFromStatement = (statementIndex: number, resourceIndex: number) => {
    const newStatements = [...statements]
    if (newStatements[statementIndex].resources.length > 1) {
      newStatements[statementIndex].resources.splice(resourceIndex, 1)
      setStatements(newStatements)
    }
  }

  const updateResourceInStatement = (statementIndex: number, resourceIndex: number, value: string) => {
    const newStatements = [...statements]
    newStatements[statementIndex].resources[resourceIndex] = value
    setStatements(newStatements)
  }



  const submitButtonText = isCreating ? "Create Policy" : "Update Policy"
  const pageTitle = isCreating ? "Create Policy" : "Edit Policy"

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col gap-6">
        {/* Back Button */}
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/${tenantId}/policies`)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Policies
          </Button>
        </div>

        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{pageTitle}</h1>
          <p className="text-muted-foreground mt-1">
            {isCreating 
              ? "Create a new AWS-style policy to control access to services and resources."
              : "Update the policy configuration and statements."
            }
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Policy Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., User Management Policy, API Access Policy"
                    disabled={existingPolicy?.isSystem}
                  />
                  <p className="text-xs text-muted-foreground">
                    A descriptive name for the policy
                  </p>
                  {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="version">Version</Label>
                  <Input
                    id="version"
                    value={formData.version}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                    placeholder="1.0.0"
                  />
                  <p className="text-xs text-muted-foreground">
                    Semantic version for the policy
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe what this policy controls and its purpose..."
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Detailed description of the policy's purpose and scope
                </p>
                {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: PolicyStatus) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {POLICY_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Current status of the policy
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Policy Statements */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Policy Statements</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addStatement}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Statement
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {statements.map((statement, statementIndex) => (
                <div key={statementIndex} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Statement {statementIndex + 1}</h4>
                    {statements.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeStatement(statementIndex)}
                        className="gap-2 text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                        Remove
                      </Button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Effect *</Label>
                    <Select
                      value={statement.effect}
                      onValueChange={(value: PolicyEffect) => updateStatement(statementIndex, "effect", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="allow">Allow</SelectItem>
                        <SelectItem value="deny">Deny</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Actions *</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => addActionToStatement(statementIndex)}
                        className="gap-1 text-xs"
                      >
                        <Plus className="h-3 w-3" />
                        Add Action
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {statement.actions.map((action, actionIndex) => (
                        <div key={actionIndex} className="flex gap-2">
                          <Input
                            value={action}
                            onChange={(e) => updateActionInStatement(statementIndex, actionIndex, e.target.value)}
                            placeholder="e.g., users:read, apis:*, *"
                            className="flex-1"
                          />
                          {statement.actions.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeActionFromStatement(statementIndex, actionIndex)}
                              className="px-2"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Specify actions like "users:read", "apis:write", or "*" for all actions
                    </p>
                    {errors[`statement_${statementIndex}_actions`] && (
                      <p className="text-sm text-destructive">{errors[`statement_${statementIndex}_actions`]}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Resources *</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => addResourceToStatement(statementIndex)}
                        className="gap-1 text-xs"
                      >
                        <Plus className="h-3 w-3" />
                        Add Resource
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {statement.resources.map((resource, resourceIndex) => (
                        <div key={resourceIndex} className="flex gap-2">
                          <Input
                            value={resource}
                            onChange={(e) => updateResourceInStatement(statementIndex, resourceIndex, e.target.value)}
                            placeholder="e.g., user-management, api-gateway, auth-service, *"
                            className="flex-1"
                          />
                          {statement.resources.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeResourceFromStatement(statementIndex, resourceIndex)}
                              className="px-2"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Specify resource ARNs or use "*" for all resources
                    </p>
                    {errors[`statement_${statementIndex}_resources`] && (
                      <p className="text-sm text-destructive">{errors[`statement_${statementIndex}_resources`]}</p>
                    )}
                  </div>
                </div>
              ))}
              {errors.statements && <p className="text-sm text-destructive">{errors.statements}</p>}
            </CardContent>
          </Card>



          {/* Actions */}
          <div className="flex items-center justify-between">
            <div>
              {isEditing && !existingPolicy?.isSystem && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Policy
                </Button>
              )}
              {isEditing && existingPolicy?.isSystem && (
                <p className="text-sm text-muted-foreground">
                  System policies cannot be deleted
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/${tenantId}/policies`)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="gap-2">
                <Save className="h-4 w-4" />
                {isLoading ? "Saving..." : submitButtonText}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
