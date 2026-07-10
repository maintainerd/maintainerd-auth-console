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
import { ChevronDown, LogOut, Settings, User } from "lucide-react"
import MaintainedAuthIcon from "../icon/MaintainedAuthIcon"
import { useNavigate } from "react-router-dom"
import { logout } from "@/services/api/auth"
import { useAppSelector } from "@/store/hooks"
import { TenantSwitcher } from "@/components/navigation/TenantSwitcher"

export function TopNav() {
  const navigate = useNavigate()
  const profile = useAppSelector((state) => state.auth.profile)

  const displayName = profile?.display_name || profile?.email || "User"
  const initials = displayName.slice(0, 2).toUpperCase()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-slate-900 text-slate-100">
      <div className="flex h-14 items-center px-4">
        {/* Mobile sidebar trigger */}
        <SidebarTrigger className="md:hidden mr-2 size-9" />

        {/* Logo */}
        <div className="flex items-center gap-2">
          <MaintainedAuthIcon width={30} height={30} className="shrink-0" />
          <span className="hidden text-lg font-semibold sm:inline">M9d-Auth</span>
        </div>

        {/* Tenant selector */}
        <TenantSwitcher className="ml-4" />

        {/* Profile dropdown */}
        <div className="ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 px-2 hover:bg-white/10 text-slate-100 hover:text-white"
              >
                <Avatar className="h-7 w-7 shrink-0">
                  <AvatarImage src={undefined} alt={displayName} />
                  <AvatarFallback className="bg-white/10 text-white text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline text-sm font-medium">{displayName}</span>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{displayName}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {profile?.email || ""}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => navigate(`/account/profile`)}
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => navigate(`/account/settings`)}
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onClick={() => logout()}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}
