import React from "react";
import { AppSidebar } from "./(sidebar)/app-sidebar-student";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export const iframeHeight = "800px";

export const description = "A sidebar with a header and a search form.";

function layout({ children }) {
  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset>
            <SiteHeader />
            <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}

export default layout;
