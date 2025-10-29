import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MessageSquare, Plus, X } from "lucide-react"
import type { SmsTemplate, SmsTemplateType, SmsTemplateCategory } from "../types"
import { smsTemplateTypes, smsTemplateCategories } from "../types"

interface SmsTemplateFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  template?: SmsTemplate
  mode: "create" | "edit"
}

export function SmsTemplateForm({ open, onOpenChange, template, mode }: SmsTemplateFormProps) {
  const [formData, setFormData] = React.useState({
    name: template?.name || "",
    description: template?.description || "",
    type: template?.type || "custom" as SmsTemplateType,
    category: template?.category || "notifications" as SmsTemplateCategory,
    message: template?.content?.message || "",
    maxLength: template?.content?.maxLength || 160,
    variables: template?.variables || []
  })

  const [newVariable, setNewVariable] = React.useState({
    name: "",
    description: "",
    example: "",
    required: false
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Submit SMS template:", formData)
    onOpenChange(false)
  }

  const addVariable = () => {
    if (newVariable.name) {
      setFormData(prev => ({
        ...prev,
        variables: [...prev.variables, newVariable]
      }))
      setNewVariable({ name: "", description: "", example: "", required: false })
    }
  }

  const removeVariable = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variables: prev.variables.filter((_, i) => i !== index)
    }))
  }

  const messageLength = formData.message.length
  const isOverLimit = messageLength > formData.maxLength

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create SMS Template" : "Edit SMS Template"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create" 
              ? "Create a new SMS template for your messaging campaigns."
              : "Update the SMS template details and content."
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Template Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Welcome SMS"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: SmsTemplateType) => setFormData(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {smsTemplateTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.replace('_', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: SmsTemplateCategory) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {smsTemplateCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.replace('_', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxLength">Max Length</Label>
                <Input
                  id="maxLength"
                  type="number"
                  value={formData.maxLength}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxLength: parseInt(e.target.value) || 160 }))}
                  min="1"
                  max="1600"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of this SMS template"
                rows={2}
              />
            </div>
          </div>

          <Separator />

          {/* Message Content */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="message">Message Content</Label>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span className={`text-sm ${isOverLimit ? 'text-red-600' : 'text-muted-foreground'}`}>
                    {messageLength}/{formData.maxLength}
                  </span>
                </div>
              </div>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Hi {{user.firstName}}, welcome to {{company.name}}!"
                rows={4}
                className={isOverLimit ? 'border-red-300 focus:border-red-500' : ''}
                required
              />
              {isOverLimit && (
                <p className="text-sm text-red-600">
                  Message exceeds maximum length by {messageLength - formData.maxLength} characters
                </p>
              )}
            </div>
          </div>

          <Separator />

          {/* Variables */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Variables</Label>
              <span className="text-sm text-muted-foreground">
                {formData.variables.length} variables
              </span>
            </div>

            {/* Existing Variables */}
            {formData.variables.length > 0 && (
              <div className="space-y-2">
                {formData.variables.map((variable, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono text-xs">
                          {`{{${variable.name}}}`}
                        </Badge>
                        {variable.required && (
                          <Badge variant="destructive" className="text-xs">
                            Required
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {variable.description}
                      </p>
                      {variable.example && (
                        <p className="text-xs text-muted-foreground">
                          Example: {variable.example}
                        </p>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeVariable(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Variable */}
            <div className="p-4 border rounded-lg bg-muted/50">
              <div className="grid grid-cols-2 gap-3 mb-3">
                <Input
                  placeholder="Variable name (e.g., user.firstName)"
                  value={newVariable.name}
                  onChange={(e) => setNewVariable(prev => ({ ...prev, name: e.target.value }))}
                />
                <Input
                  placeholder="Description"
                  value={newVariable.description}
                  onChange={(e) => setNewVariable(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div className="flex items-center gap-3">
                <Input
                  placeholder="Example value"
                  value={newVariable.example}
                  onChange={(e) => setNewVariable(prev => ({ ...prev, example: e.target.value }))}
                  className="flex-1"
                />
                <Button type="button" onClick={addVariable} size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isOverLimit}>
              {mode === "create" ? "Create Template" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
