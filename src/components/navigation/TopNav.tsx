import { useState } from "react"
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
import { LogOut, Settings, User, Bell, Globe, ChevronDown, Plus, Shield } from "lucide-react"
import MaintainedAuthIcon from "../icon/MaintainedAuthIcon"
import { useParams, useNavigate } from "react-router-dom"
import { useTenantsList } from "@/hooks/useTenants"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/hooks/useToast"
import { useAppSelector } from "@/store/hooks"
import type { TenantEntity } from "@/services/api/tenant/types"
import { CreateTenantDialog } from "@/components/dialog"

export function TopNav() {
  // Note: tenantId parameter actually contains the tenant identifier (random alphanumeric)
  // URL structure: /{tenantIdentifier}/subpages
  const { tenantId } = useParams<{ tenantId: string }>()
  const navigate = useNavigate()
  const { logout } = useAuth()
  const { showSuccess, showError } = useToast()
  const { data: tenantsData, isLoading: tenantsLoading } = useTenantsList({ limit: 100 })
  const tenants = tenantsData?.data?.rows as TenantEntity[] || []
  const profile = useAppSelector((state) => state.auth.profile)
  const [createTenantOpen, setCreateTenantOpen] = useState(false)

  // Find current tenant by identifier (tenantId parameter contains the tenant identifier)
  const currentTenant = tenants.find((t: TenantEntity) => t.identifier === tenantId) || tenants[0] || { name: 'Tenant', identifier: '', description: '', is_system: false }

  const handleViewAllNotifications = () => {
    if (tenantId) {
      navigate(`/${tenantId}/notifications`)
    }
  }

  const handleTenantSwitch = (tenantIdentifier: string) => {
    navigate(`/${tenantIdentifier}/dashboard`)
  }

  const handleCreateTenant = () => {
    setCreateTenantOpen(true)
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
    <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-primary text-primary-foreground">
      <div className="flex h-14 items-center px-4">
        {/* Mobile Sidebar Trigger */}
        <SidebarTrigger className="md:hidden mr-2" />

        {/* Logo */}
        <div className="flex items-center gap-2">
          <MaintainedAuthIcon width={30} height={30} className="shrink-0" />
          <span className="text-lg font-semibold">M9d-Auth</span>
        </div>

        {/* Tenant Selector */}
        <div className="ml-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                <span className="text-sm">{currentTenant?.name || 'Tenant'}</span>
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="start">
              <DropdownMenuLabel>Switch Tenant</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-60 overflow-y-auto">
                {tenantsLoading ? (
                  <div className="p-4 text-center text-muted-foreground text-sm">Loading tenants...</div>
                ) : tenants.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground text-sm">No tenants found</div>
                ) : tenants.map((tenant: TenantEntity) => (
                  <DropdownMenuItem
                    key={tenant.tenant_id}
                    onClick={() => handleTenantSwitch(tenant.identifier)}
                    className={`cursor-pointer ${tenant.identifier === tenantId ? 'bg-accent' : ''}`}
                  >
                    <div className="flex flex-col w-full">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{tenant.name}</span>
                        {tenant.is_system && (
                          <Badge variant="secondary" className="text-xs">
                            <Shield className="h-2 w-2 mr-1" />
                            System
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground truncate">
                        {tenant.description}
                      </span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleCreateTenant} className="text-blue-600 cursor-pointer">
                <Plus className="h-4 w-4 mr-2" />
                <span>Create New Tenant</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Right side items */}
        <div className="ml-auto flex items-center gap-6">
          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <a href="#" className="transition-colors hover:text-primary-foreground/80 text-primary-foreground/60">
              Documentation
            </a>
            <a href="#" className="transition-colors hover:text-primary-foreground/80 text-primary-foreground/60">
              API Reference
            </a>
            <a href="#" className="transition-colors hover:text-primary-foreground/80 text-primary-foreground/60">
              Community
            </a>
          </div>

          {/* Action Items */}
          <div className="flex items-center gap-2">
            {/* Notification Bell */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
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
                <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
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
                  <Avatar className="h-8 w-8 hover:ring-2 hover:ring-primary-foreground/50 transition-all">
                    <AvatarImage src={undefined} alt={profile?.display_name || profile?.email || "User"} />
                    <AvatarFallback className="bg-primary-foreground/10 text-primary-foreground">
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
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
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

      {/* Create Tenant Dialog */}
      <CreateTenantDialog
        open={createTenantOpen}
        onOpenChange={setCreateTenantOpen}
      />
    </nav>
  )
}
