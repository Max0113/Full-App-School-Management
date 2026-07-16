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
import { LifeBuoyIcon, SendIcon, PieChartIcon, MapIcon } from "lucide-react";
import { LuGraduationCap } from "react-icons/lu";
import { useAuth } from "@/components/Context/AuthContext";
import { GoHomeFill } from "react-icons/go";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function AppSidebar({ ...props }) {
  const { user, checkAuth, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const runCheckAuth = async () => {
      try {
        await checkAuth(); // updates `user` and `isAuthenticated` inside the context itself
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    runCheckAuth();
  }, []);

  const data = {
    user: {
      name: isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-3 w-[100px]" />
          <Skeleton className="h-3 w-[150px]" />
        </div>
      ) : (
        (user?.name ?? "Unknown")
      ),
      email: isLoading ? "" : (user?.email ?? ""),
      avatar: "/avatars/shadcn.jpg",
    },
    pageGeneral: [
      { name: "Dashboard", url: "/admin/dashboard", icon: <GoHomeFill /> },
      { name: "Parents", url: "/admin/manage-parents", icon: <PieChartIcon /> },
      { name: "Support", url: "#", icon: <MapIcon /> },
    ],
    navSecondary: [
      { title: "Settings", url: "#", icon: <LifeBuoyIcon /> },
      { title: "Feedback", url: "#", icon: <SendIcon /> },
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
        <NavProjects projects={data.pageGeneral} title="General" />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
