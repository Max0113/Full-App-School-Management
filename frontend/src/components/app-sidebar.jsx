"use client";

import { NavMain } from "@/components/nav-main";
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
import { useAuth } from "./Context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GoHomeFill } from "react-icons/go";
import { dataSidebar } from "./data-sidebar";

export function AppSidebar({ ...props }) {
  const [isLoading, setIsLoading] = useState(true);
  const { checkAuth, isAuthenticated, SetIsAuthenticated } = useAuth();
  const [user, SetUser] = useState([]);
  const [role, Setrole] = useState("");
  const route = useRouter();

  useEffect(() => {
    const verifyAuth = async () => {
      const authenticated = localStorage.getItem("AUTHENTICATED") === "true";

      if (!authenticated) {
        route.replace("/login");
        setIsLoading(false);
        return;
      }

      try {
        const data = await checkAuth();
        SetUser(data);
        Setrole(data.role);
        console.log(dataSidebar);
      } catch (error) {
        console.error(error);
        route.replace("/login");
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, []);

  const nav =
    role === "student"
      ? dataSidebar.dataStudent
      : role === "admin"
        ? dataSidebar.dataAdmin
        : dataSidebar.dataTeacher;

  const data = {
    user: {
      name: user?.name,
      email: user?.email,
      avatar: "/avatars/shadcn.jpg",
    },
    ...nav,
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
        {!isLoading ? (
          <>
            <NavProjects projects={data.pageGeneral} title="Genaral" />
            <NavSecondary items={data.navSecondary} className="mt-auto" />
          </>
        ) : (
          <div className="animate-pulse w-full h-full bg-gray-500"></div>
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
