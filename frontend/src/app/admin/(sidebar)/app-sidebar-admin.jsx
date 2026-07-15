"use client";

import { NavProjects } from "@/components/nav-projects";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  TerminalSquareIcon,
  BotIcon,
  BookOpenIcon,
  Settings2Icon,
  LifeBuoyIcon,
  SendIcon,
  FrameIcon,
  PieChartIcon,
  MapIcon,
  TerminalIcon,
  Cast,
} from "lucide-react";
import { LuGraduationCap } from "react-icons/lu";
import { useAuth } from "@/components/Context/AuthContext";
import { GoHomeFill } from "react-icons/go";

export function AppSidebar({ ...props }) {
  const { user, checkAuth, isAuthenticated, SetIsAuthenticated } = useAuth();

  const data = {
    user: {
      name: user?.name,
      email: user?.email,
      avatar: "/avatars/shadcn.jpg",
    },
    pageGeneral: [
      {
        name: "Dahbord",
        url: "/admin/dashboard",
        icon: <GoHomeFill />,
      },
      {
        name: "Parents",
        url: "/admin/manage-parents",
        icon: <PieChartIcon />,
      },
      {
        name: "Support",
        url: "#",
        icon: <MapIcon />,
      },
    ],
    navSecondary: [
      {
        title: "Setting Avenc",
        url: "#",
        icon: <LifeBuoyIcon />,
      },
      {
        title: "Feedback",
        url: "#",
        icon: <SendIcon />,
      },
    ],
  };

  return (
    <Sidebar className="top-0 h-screen" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<a href="/" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <LuGraduationCap className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <h1 className="text-2xl font-extrabold">
                  School<span className="text-blue-500">.</span>
                </h1>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.pageGeneral} title="Genaral" />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
