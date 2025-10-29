import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Edit,
  Trash2,
  Eye,
  Copy,
  Mail,
  Download,
  Upload,
  BarChart3,
  Settings,
  Play,
  Pause,
  FileText
} from "lucide-react"
import type { EmailTemplate } from "../types"

interface Props {
  template: EmailTemplate
  children: React.ReactNode
}

export function EmailTemplateActions({ template, children }: Props) {
  const handlePreview = () => {
    console.log("Preview template:", template)
  }

  const handleEdit = () => {
    console.log("Edit template:", template)
  }

  const handleDuplicate = () => {
    console.log("Duplicate template:", template)
  }

  const handleSendTest = () => {
    console.log("Send test email:", template)
  }

  const handleViewAnalytics = () => {
    console.log("View analytics:", template)
  }

  const handleToggleStatus = () => {
    const newStatus = template.status === "active" ? "inactive" : "active"
    console.log(`${newStatus === "active" ? "Activate" : "Deactivate"} template:`, template)
  }

  const handleExport = () => {
    console.log("Export template:", template)
  }

  const handleImport = () => {
    console.log("Import template:", template)
  }

  const handleViewSource = () => {
    console.log("View template source:", template)
  }

  const handleSettings = () => {
    console.log("Template settings:", template)
  }

  const handleDelete = () => {
    console.log("Delete template:", template)
  }

  const isActive = template.status === "active"
  const canDelete = !template.isSystem
  const canEdit = !template.isSystem || template.type === "custom"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handlePreview}>
          <Eye className="mr-2 h-4 w-4" />
          Preview
        </DropdownMenuItem>
        
        {canEdit && (
          <DropdownMenuItem onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Template
          </DropdownMenuItem>
        )}

        <DropdownMenuItem onClick={handleDuplicate}>
          <Copy className="mr-2 h-4 w-4" />
          Duplicate
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleSendTest}>
          <Mail className="mr-2 h-4 w-4" />
          Send Test Email
        </DropdownMenuItem>

        {template.usageCount > 0 && (
          <DropdownMenuItem onClick={handleViewAnalytics}>
            <BarChart3 className="mr-2 h-4 w-4" />
            View Analytics
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleToggleStatus}>
          {isActive ? (
            <>
              <Pause className="mr-2 h-4 w-4" />
              Deactivate
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Activate
            </>
          )}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleViewSource}>
          <FileText className="mr-2 h-4 w-4" />
          View Source
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleSettings}>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleImport}>
          <Upload className="mr-2 h-4 w-4" />
          Import
        </DropdownMenuItem>

        {canDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDelete} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
