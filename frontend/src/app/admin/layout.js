import React from "react";
import { AppSidebar } from "./(sidebar)/app-sidebar-admin";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { RoleGuard } from "@/components/RoleGuard";

function layout({ children }) {
  return (
    <RoleGuard role="admin">
      <div className="[--header-height:calc(--spacing(14))]">
        <SidebarProvider className="flex flex-col">
          <div className="flex flex-1">
            <AppSidebar />
            <SidebarInset className={"w-100"}>
              <SiteHeader />
              <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </RoleGuard>
  );
}

export default layout;
