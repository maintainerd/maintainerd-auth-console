import type { ReactNode } from "react"

interface PageContainerProps {
  children: ReactNode
}

export function PageContainer({ children }: PageContainerProps) {
  return (
    <div className="flex flex-col gap-6">
      {children}
    </div>
  )
}

