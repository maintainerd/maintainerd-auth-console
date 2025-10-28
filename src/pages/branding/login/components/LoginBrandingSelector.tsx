"use client"

import * as React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Palette, Eye } from "lucide-react"
import type { LoginBranding } from "../types"
import { MOCK_LOGIN_BRANDINGS } from "../constants"

interface LoginBrandingSelectorProps {
  value?: string
  onValueChange: (brandingId: string) => void
  placeholder?: string
  disabled?: boolean
  showPreview?: boolean
}

export function LoginBrandingSelector({
  value,
  onValueChange,
  placeholder = "Select login branding",
  disabled = false,
  showPreview = true
}: LoginBrandingSelectorProps) {
  const [brandings] = React.useState<LoginBranding[]>(MOCK_LOGIN_BRANDINGS)
  
  const selectedBranding = brandings.find(b => b.id === value)

  const handlePreview = (branding: LoginBranding) => {
    window.open(branding.previewUrl, '_blank')
  }

  return (
    <div className="space-y-2">
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger>
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder={placeholder} />
          </div>
        </SelectTrigger>
        <SelectContent>
          {brandings
            .filter(branding => branding.status === "active")
            .map((branding) => (
              <SelectItem key={branding.id} value={branding.id}>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <span>{branding.name}</span>
                    {branding.isDefault && (
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
                        Default
                      </Badge>
                    )}
                    {branding.isSystem && (
                      <Badge className="bg-gray-100 text-gray-800 border-gray-200 text-xs">
                        System
                      </Badge>
                    )}
                  </div>
                  {showPreview && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 ml-2"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handlePreview(branding)
                      }}
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
      
      {selectedBranding && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Badge
            className={
              selectedBranding.template === "modern"
                ? "bg-blue-100 text-blue-800 border-blue-200"
                : selectedBranding.template === "classic"
                ? "bg-gray-100 text-gray-800 border-gray-200"
                : selectedBranding.template === "minimal"
                ? "bg-slate-100 text-slate-800 border-slate-200"
                : selectedBranding.template === "corporate"
                ? "bg-indigo-100 text-indigo-800 border-indigo-200"
                : selectedBranding.template === "creative"
                ? "bg-purple-100 text-purple-800 border-purple-200"
                : "bg-orange-100 text-orange-800 border-orange-200"
            }
          >
            {selectedBranding.template}
          </Badge>
          <span>•</span>
          <span className="capitalize">{selectedBranding.layout} layout</span>
          <span>•</span>
          <span>{selectedBranding.usageCount} applications</span>
          {showPreview && (
            <>
              <span>•</span>
              <Button
                variant="link"
                size="sm"
                className="h-auto p-0 text-xs"
                onClick={() => handlePreview(selectedBranding)}
              >
                Preview
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
