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
import { LogOut, Settings, User, Bell, Globe, ChevronDown } from "lucide-react"
import { data } from "@/components/sidebar/constants"
import MaintainedAuthIcon from "../icon/MaintainedAuthIcon"

export function TopNav() {
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

        {/* Container Selector */}
        <div className="ml-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                <span className="text-sm">Default Container</span>
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48" align="start">
              <DropdownMenuLabel>Select Container</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <div className="flex flex-col">
                  <span className="font-medium">Default</span>
                  <span className="text-xs text-muted-foreground">Admin & system users</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-blue-600">
                <span>+ Create New Container</span>
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
            <Button variant="ghost" size="icon" className="relative text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                3
              </span>
            </Button>

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
                    <AvatarImage src={data.user.avatar} alt={data.user.name} />
                    <AvatarFallback className="bg-primary-foreground/10 text-primary-foreground">
                      {data.user.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{data.user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {data.user.email}
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
                <DropdownMenuItem>
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
