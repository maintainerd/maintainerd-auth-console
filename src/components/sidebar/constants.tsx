import {
	Settings,
	Shield,
	Users,
	Webhook,
	MessageSquare,
	LifeBuoy,
	Zap,
	Wrench,
	Palette,
	Container,
	Server,
	KeyRound,
	Layers,
	TrendingUp,
	GitBranch,
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
          title: "Policies",
          route: "/policies",
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
      icon: KeyRound,
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
        {
          title: "API Keys",
          route: "/api-keys",
        },
      ],
    },
    {
      title: "Auth Flows",
      route: "/auth-flows",
      icon: GitBranch,
      items: [
        {
          title: "Onboarding",
          route: "/onboarding",
        },
      ],
    },

    // 3. Security (Technical Configuration)
    {
      title: "Security",
      route: "/security",
      icon: Shield,
      items: [
        {
          title: "Security Settings",
          route: "/security/settings",
        },
        {
          title: "Password Policies",
          route: "/security/password-policies",
        },
        {
          title: "Session Management",
          route: "/security/sessions",
        },
        {
          title: "Threat Detection",
          route: "/security/threats",
        },

        {
          title: "IP Restrictions",
          route: "/security/ip-restrictions",
        },
      ],
    },

    // 4. Monitoring (Observability)
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

    // 6. Events & Monitoring (Coming Soon)
    {
      title: "Events",
      route: "/events",
      icon: Zap,
      comingSoon: true,
    },
    {
      title: "Webhooks",
      route: "/webhooks",
      icon: Webhook,
      comingSoon: true,
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