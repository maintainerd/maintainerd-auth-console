import {
	Settings,
	Shield,
	Users,
	Webhook,
	MessageSquare,
	LifeBuoy,
	Zap,
	Wrench,
	UserPlus,
	Palette,
	Container,
	Server,
	Plug,
	Layers,
	FileText,
	TrendingUp,
} from "lucide-react"

export const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    // 1. Setup & Configuration (Top Priority)
    {
      title: "Get Started",
      route: "/dashboard",
      icon: Wrench,
			active: true,
    },
    {
      title: "Containers",
      route: "/containers",
      icon: Container,
    },
    {
      title: "Services",
      route: "/services",
      icon: Server,
      items: [
        {
          title: "Services",
          route: "/services",
        },
        {
          title: "APIs",
          route: "/apis",
        },
        {
          title: "Permissions",
          route: "/permissions",
        },
      ],
    },

    // 2. Core Management (Daily Operations)
    {
      title: "User Management",
      route: "/user-management",
      icon: Users,
      items: [
        {
          title: "Users",
          route: "/users",
        },
        {
          title: "Roles",
          route: "/roles",
        },
      ],
    },
    {
      title: "Providers",
      route: "/providers",
      icon: Plug,
      items: [
        {
          title: "Identity",
          route: "/providers/identity",
        },
        {
          title: "Social",
          route: "/providers/social",
        },
      ],
    },
    {
      title: "Applications",
      route: "/applications",
      icon: Layers,
      items: [
        {
          title: "Clients",
          route: "/clients",
        },
      ],
    },

    // 3. Policies & Security (Technical Configuration)
    {
      title: "Policies",
      route: "/policies",
      icon: FileText,
    },
    {
      title: "Security",
      route: "/security",
      icon: Shield,
    },

    // 4. Events & Monitoring (Observability)
    {
      title: "Events",
      route: "/events",
      icon: Zap,
    },
    {
      title: "Webhooks",
      route: "/webhooks",
      icon: Webhook,
    },
    {
      title: "Monitoring",
      route: "/monitoring",
      icon: TrendingUp,
      items: [
        {
          title: "Analytics",
          route: "/analytics",
        },
        {
          title: "Logs",
          route: "/logs",
        },
      ],
    },

    // 5. Customization & Admin (Less Frequent)
    {
      title: "Branding",
      route: "/branding",
      icon: Palette,
      items: [
        {
          title: "Login",
          route: "/branding/login",
        },
        {
          title: "Email Templates",
          route: "/branding/email-templates",
        },
        {
          title: "SMS Templates",
          route: "/branding/sms-templates",
        },
      ],
    },
    {
      title: "Onboarding",
      route: "/onboarding",
      icon: UserPlus,
    },
    {
      title: "Settings",
      route: "/settings",
      icon: Settings,
    },
  ],
  navSecondary: [
    {
      title: "Give Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Give Feedback",
      url: "#",
      icon: MessageSquare,
    },
  ],
}