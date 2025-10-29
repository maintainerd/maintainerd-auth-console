import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  MoreHorizontal,
  Eye,
  Edit,
  Copy,
  MessageSquare,
  Download,
  Trash2,
  Settings
} from "lucide-react"
import type { SmsTemplate } from "../types"

interface SmsTemplateActionsProps {
  template: SmsTemplate
}

export function SmsTemplateActions({ template }: SmsTemplateActionsProps) {
  const handlePreview = () => {
    console.log("Preview SMS template:", template.id)
  }

  const handleEdit = () => {
    console.log("Edit SMS template:", template.id)
  }

  const handleDuplicate = () => {
    console.log("Duplicate SMS template:", template.id)
  }

  const handleSendTest = () => {
    console.log("Send test SMS:", template.id)
  }

  const handleExport = () => {
    console.log("Export SMS template:", template.id)
  }

  const handleConfigure = () => {
    console.log("Configure SMS template:", template.id)
  }

  const handleDelete = () => {
    console.log("Delete SMS template:", template.id)
  }

  return (
    <div className="px-3 py-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={handlePreview}>
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSendTest}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Send Test
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDuplicate}>
            <Copy className="mr-2 h-4 w-4" />
            Duplicate
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleConfigure}>
            <Settings className="mr-2 h-4 w-4" />
            Configure
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </DropdownMenuItem>
          {!template.isSystem && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
