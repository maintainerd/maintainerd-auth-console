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
import {
  BookOpen,
  ChevronDown,
  Code2,
  HelpCircle,
  LogOut,
  MessageSquare,
  Settings,
  User,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { logout } from "@/services/api/auth"
import { useAppSelector } from "@/store/hooks"
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs"
import { CreateMenu } from "@/components/navigation/CreateMenu"

const resourceLinks = [
  { title: "Documentation", icon: BookOpen, href: "#" },
  { title: "API Reference", icon: Code2, href: "#" },
  { title: "Community", icon: MessageSquare, href: "#" },
]

// Slim content header (Coolify-style). The brand and tenant switcher live at the
// top of the sidebar; this bar keeps the sidebar collapse toggle, the breadcrumb,
// and the right-side actions (help resources + user menu).
export function TopNav() {
  const navigate = useNavigate()
  const profile = useAppSelector((state) => state.auth.profile)

  const displayName = profile?.display_name || profile?.email || "User"
  const initials = displayName.slice(0, 2).toUpperCase()

  return (
    <header className="sticky top-0 z-10 flex h-[72px] items-center gap-3 border-b border-slate-200 bg-[#fcfcfc] px-4 sm:px-6">
      {/* Mobile-only drawer toggle (desktop keeps the sidebar always visible). */}
      <SidebarTrigger className="md:hidden size-9 text-slate-600" />

      {/* Breadcrumb — where we are now */}
      <Breadcrumbs />

      {/* Right actions: create + help resources + profile */}
      <div className="ml-auto flex items-center gap-2">
        <CreateMenu />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Help & resources">
              <HelpCircle className="size-5 text-slate-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48" align="end">
            <DropdownMenuLabel className="font-normal text-muted-foreground">
              Resources
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {resourceLinks.map((link) => (
              <DropdownMenuItem key={link.title} asChild className="cursor-pointer">
                <a href={link.href} target="_blank" rel="noopener noreferrer">
                  <link.icon className="mr-2 h-4 w-4" />
                  {link.title}
                </a>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2">
              <Avatar className="h-7 w-7 shrink-0">
                <AvatarImage src={undefined} alt={displayName} />
                <AvatarFallback className="bg-slate-200 text-slate-700 text-xs">
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
    </header>
  )
}
