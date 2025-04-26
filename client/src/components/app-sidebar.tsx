import * as React from "react"
import {
  Bot,
  Frame,
  GalleryVerticalEnd,
  PieChart,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// Get user data from localStorage
const username = localStorage.getItem("name")
const email = localStorage.getItem("email")
const userType = localStorage.getItem("userType") // 'buyer' or 'agent'

// Common data
const commonData : any = {
  user: {
    name: username,
    email: email,
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Bharat Vyapaar",
      logo: GalleryVerticalEnd,
    },
  ],
  projects: [
    {
      name: "Marketing",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales",
      url: "#",
      icon: PieChart,
    },
  ],
}

// Buyer-specific navigation
const buyerNav = [
  {
    title: "Search",
    url: "#",
    icon: SquareTerminal,
    isActive: true,
    items: [
      {
        title: "Sourcing Agents",
        url: "sourcing-agents",
      },
    ],
  },
  {
    title: "Requests",
    url: "#",
    icon: Bot,
    items: [
      {
        title: "Post a Request",
        url: "sourcing-agents",
      },
      {
        title: "All Requests",
        url: "buyer-requests",
      },
      {
        title: "Accepted Requests",
        url: "buyer-accepted",
      },
    ],
  },
  {
    title: "Products",
    url: "#",
    icon: SquareTerminal,
    items: [
      {
        title: "Explore Products",
        url: "getimages",
      },
      {
        title: "Rate a Product",
        url: "ratings",
      },
      {
        title: "Live Tracking",
        url: "location-track",
      },
    ],
  },
]

// Agent-specific navigation
const agentNav = [
  {
    title: "Requests",
    url: "#",
    icon: Bot,
    items: [
      {
        title: "Available Requests",
        url: "requests",
      },
      {
        title: "Accepted Proposals",
        url: "agent-accepted",
      },
    ],
  },
  {
    title: "Products",
    url: "#",
    icon: SquareTerminal,
    items: [
      {
        title: "Track Product",
        url: "static-trakcer",
      },
      {
        title: "Add Product",
        url: "add-photos",
      },
    ],
  },
]

// Combine common data with role-specific data
const data = {
  ...commonData,
  navMain: userType === 'buyer' ? buyerNav : agentNav
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}