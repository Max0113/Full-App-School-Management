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
import { LuGraduationCap } from "react-icons/lu";
import { NavMain } from "./nav-main";


export function SidebarCom({ data, ...props }) {
  return (
    <Sidebar className="top-0 h-screen" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<a href="/" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-[#1447E6] text-sidebar-primary-foreground">
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
        <NavMain items={data?.pageMain} title="General" />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
