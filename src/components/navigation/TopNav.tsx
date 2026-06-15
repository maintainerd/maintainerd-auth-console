import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { LogOut, Settings, User, Bell, Globe } from "lucide-react"
import MaintainedAuthIcon from "../icon/MaintainedAuthIcon"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/hooks/useToast"
import { useAppSelector } from "@/store/hooks"
import { TenantSwitcher } from "@/components/navigation/TenantSwitcher"

export function TopNav() {
  // Note: tenantId parameter actually contains the tenant identifier (random alphanumeric)
  // URL structure: /{tenantIdentifier}/subpages
  const { tenantId } = useParams<{ tenantId: string }>()
  const navigate = useNavigate()
  const { logout } = useAuth()
  const { showSuccess, showError } = useToast()
  const profile = useAppSelector((state) => state.auth.profile)

  const handleViewAllNotifications = () => {
    if (tenantId) {
      navigate(`/${tenantId}/notifications`)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      showSuccess("Logged out successfully")
      navigate("/login")
    } catch (error) {
      showError(error, "Logout failed")
      // Even if logout fails, navigate to login
      navigate("/login")
    }
  }
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-slate-900 text-slate-100">
      <div className="flex h-14 items-center px-4">
        {/* Mobile Sidebar Trigger */}
        <SidebarTrigger className="md:hidden mr-2 size-9" />

        {/* Logo */}
        <div className="flex items-center gap-2">
          <MaintainedAuthIcon width={30} height={30} className="shrink-0" />
          <span className="hidden text-lg font-semibold sm:inline">M9d-Auth</span>
        </div>

        {/* Tenant Selector */}
        <TenantSwitcher className="ml-4" />

        {/* Right side items */}
        <div className="ml-auto flex items-center gap-6">
          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <a href="#" className="transition-colors text-slate-300 hover:text-white">
              Documentation
            </a>
            <a href="#" className="transition-colors text-slate-300 hover:text-white">
              API Reference
            </a>
            <a href="#" className="transition-colors text-slate-300 hover:text-white">
              Community
            </a>
          </div>

          {/* Action Items */}
          <div className="flex items-center gap-2">
            {/* Notification Bell */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-slate-200 hover:bg-white/10 hover:text-white">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                    3
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-72" align="end">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-80 overflow-y-auto">
                  <DropdownMenuItem className="flex items-start gap-3 p-3 cursor-pointer">
                    <div className="h-2 w-2 rounded-full bg-blue-500 mt-1 shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">New user registration</p>
                      <p className="text-xs text-muted-foreground mt-1">John Doe registered for an account</p>
                      <p className="text-xs text-muted-foreground mt-1">2m</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-start gap-3 p-3 cursor-pointer">
                    <div className="h-2 w-2 rounded-full bg-orange-500 mt-1 shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">API rate limit warning</p>
                      <p className="text-xs text-muted-foreground mt-1">User-api approaching limits (85%)</p>
                      <p className="text-xs text-muted-foreground mt-1">15m</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-start gap-3 p-3 cursor-pointer">
                    <div className="h-2 w-2 rounded-full bg-gray-400 mt-1 shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">System update completed</p>
                      <p className="text-xs text-muted-foreground mt-1">Auth service updated to v2.1.0</p>
                      <p className="text-xs text-muted-foreground mt-1">1h</p>
                    </div>
                  </DropdownMenuItem>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-center justify-center text-sm cursor-pointer"
                  onClick={handleViewAllNotifications}
                >
                  View all
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hidden text-slate-200 hover:bg-white/10 hover:text-white sm:inline-flex">
                  <Globe className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40" align="end">
                <DropdownMenuLabel>Language</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  🇺🇸 English
                </DropdownMenuItem>
                <DropdownMenuItem>
                  🇪🇸 Español
                </DropdownMenuItem>
                <DropdownMenuItem>
                  🇫🇷 Français
                </DropdownMenuItem>
                <DropdownMenuItem>
                  🇩🇪 Deutsch
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-transparent">
                  <Avatar className="h-8 w-8 hover:ring-2 hover:ring-white/40 transition-all">
                    <AvatarImage src={undefined} alt={profile?.display_name || profile?.email || "User"} />
                    <AvatarFallback className="bg-white/10 text-white">
                      {(profile?.display_name || profile?.email || "U").slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{profile?.display_name || profile?.email || "User"}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {profile?.email || "No email"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={() => tenantId && navigate(`/${tenantId}/account/profile`)}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => tenantId && navigate(`/${tenantId}/account/settings`)}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  )
}
