"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

function NavMainItem({ item }) {
  const pathname = usePathname();

  const isLinkActive = (url) => url && url !== "#" && pathname === url;
  const isParentActive =
    item.items?.some((subItem) => isLinkActive(subItem.url)) ?? false;

  // Controlled open state, seeded from the initial active check
  const [open, setOpen] = useState(isParentActive);

  // Keep it in sync if the route changes after mount
  useEffect(() => {
    if (isParentActive) setOpen(true);
  }, [isParentActive]);

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="group/collapsible"
      render={<SidebarMenuItem />}
    >
      <CollapsibleTrigger
        nativeButton={false}
        render={
          <SidebarMenuButton
            tooltip={item.title}
            render={<Link href={item.url || "#"} />}
          >
            {item.icon}
            <span>{item.title}</span>
            {item.items ? (
              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            ) : null}
          </SidebarMenuButton>
        }
      />
      {item.items ? (
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.items?.map((subItem) => (
              <SidebarMenuSubItem key={subItem.title}>
                <SidebarMenuSubButton
                  render={
                    <Link href={subItem.url}>
                      {subItem.icon}
                      <span>{subItem.title}</span>
                    </Link>
                  }
                />
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      ) : null}
    </Collapsible>
  );
}

export function NavMain({ items, title }) {
  const safeItems = Array.isArray(items) ? items : [];

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className={"text-sm font-bold"}>
        {title}
      </SidebarGroupLabel>
      <SidebarMenu>
        {safeItems.map((item) => (
          <NavMainItem key={item.title} item={item} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}