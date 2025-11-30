/**
 * Details Container Component
 * Provides a consistent max-width centered container for detail pages and forms
 */

import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface DetailsContainerProps {
  children: ReactNode
  className?: string
}

export function DetailsContainer({ children, className }: DetailsContainerProps) {
  return (
    <div className={cn("max-w-4xl mx-auto", className)}>
      {children}
    </div>
  )
}

