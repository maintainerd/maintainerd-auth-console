import { BookOpen, Code2, MessageSquare } from "lucide-react"
import {
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

const externalLinks = [
  { title: "Documentation", icon: BookOpen, href: "#" },
  { title: "API Reference", icon: Code2, href: "#" },
  { title: "Community", icon: MessageSquare, href: "#" },
]

export function SidebarFooterNav() {
  return (
    <SidebarFooter className="gap-1 pb-3">

      {/* External links */}
      <SidebarGroup className="py-0">
        <SidebarGroupContent>
          <SidebarMenu>
            {externalLinks.map((link) => (
              <SidebarMenuItem key={link.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={link.title}
                  className="h-8 px-3 text-sm text-muted-foreground hover:text-foreground [&>svg]:size-4"
                >
                  <a href={link.href} target="_blank" rel="noopener noreferrer">
                    <link.icon />
                    <span>{link.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

    </SidebarFooter>
  )
}
