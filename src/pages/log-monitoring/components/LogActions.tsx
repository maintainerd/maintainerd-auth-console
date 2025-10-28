import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {
  MoreHorizontal,
  Eye,
  Copy,
  Search,
  User,
  Clock,
  Download,
  Share,
  Flag,
  FileText,
} from "lucide-react"
import type { LogEntry } from "../constants"

interface LogActionsProps {
  log: LogEntry
}

export function LogActions({ log }: LogActionsProps) {
  const handleViewDetails = () => {
    console.log("View details for log:", log.id)
  }

  const handleViewInContext = () => {
    console.log("View in context for log:", log.id)
  }

  const handleCopyLogId = () => {
    navigator.clipboard.writeText(log.id)
    console.log("Copied log ID:", log.id)
  }

  const handleCopyRequestId = () => {
    if (log.requestId) {
      navigator.clipboard.writeText(log.requestId)
      console.log("Copied request ID:", log.requestId)
    }
  }

  const handleSearchSimilar = () => {
    console.log("Search similar logs for:", log.id)
  }

  const handleViewUser = () => {
    if (log.userId) {
      console.log("View user:", log.userId)
    }
  }

  const handleViewSession = () => {
    if (log.sessionId) {
      console.log("View session:", log.sessionId)
    }
  }

  const handleExportLog = () => {
    console.log("Export log:", log.id)
  }

  const handleShareLog = () => {
    console.log("Share log:", log.id)
  }

  const handleFlagForReview = () => {
    console.log("Flag for review:", log.id)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Log Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleViewDetails}>
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleViewInContext}>
          <FileText className="mr-2 h-4 w-4" />
          View in Context
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleCopyLogId}>
          <Copy className="mr-2 h-4 w-4" />
          Copy Log ID
        </DropdownMenuItem>
        
        {log.requestId && (
          <DropdownMenuItem onClick={handleCopyRequestId}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Request ID
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleSearchSimilar}>
          <Search className="mr-2 h-4 w-4" />
          Search Similar
        </DropdownMenuItem>
        
        {log.userId && (
          <DropdownMenuItem onClick={handleViewUser}>
            <User className="mr-2 h-4 w-4" />
            View User
          </DropdownMenuItem>
        )}
        
        {log.sessionId && (
          <DropdownMenuItem onClick={handleViewSession}>
            <Clock className="mr-2 h-4 w-4" />
            View Session
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleExportLog}>
          <Download className="mr-2 h-4 w-4" />
          Export Log
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleShareLog}>
          <Share className="mr-2 h-4 w-4" />
          Share Log
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleFlagForReview}>
          <Flag className="mr-2 h-4 w-4" />
          Flag for Review
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
