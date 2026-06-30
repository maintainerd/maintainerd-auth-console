import type { CSSProperties } from "react"
import { Outlet } from "react-router-dom"
import { AppSidebar } from "@/components/sidebar/AppSideBar"
import { TopNav } from "@/components/navigation/TopNav"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { ConsoleBrandingProvider } from "@/components/theme/ConsoleBrandingProvider"
import { cn } from "@/lib/utils"

interface PrivateLayoutProps {
  fullWidth?: boolean
}

// Access gating (auth, registration completeness, tenant isolation) is handled
// centrally by AppBootstrap → RouteGuard; this layout only renders the chrome.
export function PrivateLayout({ fullWidth = false }: PrivateLayoutProps) {
  return (
    <ConsoleBrandingProvider>
    <div className="min-h-screen flex flex-col bg-background">
      {/* Wider sidebar (default is 16rem) to suit the larger menu text/icons */}
      <SidebarProvider style={{ "--sidebar-width": "17rem" } as CSSProperties}>
        <TopNav />
        <div className="flex flex-1 pt-14">
          <AppSidebar variant="sidebar" className="top-14" />
          <SidebarInset className="bg-slate-50 min-w-0">
            <main className={cn(
              "flex-1 px-4 py-6 sm:px-6 sm:py-8",
              !fullWidth && "max-w-6xl mx-auto"
            )}>
              <Outlet />
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
    </ConsoleBrandingProvider>
  )
}
