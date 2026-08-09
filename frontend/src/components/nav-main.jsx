"use client";

import { ChevronRight } from "lucide-react";

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
import { useState } from "react";

export function NavMain({ items, title }) {
  const pathname = usePathname();

  const isLinkActive = (url) => url && url !== "#" && pathname === url;

  const isParentActive = (item) =>
    item.items?.some((subItem) => isLinkActive(subItem.url));

  return (
    <>
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel className={"text-sm font-bold"}>
          {title}
        </SidebarGroupLabel>
        <SidebarMenu>
          {items.map((item) => (
            <Collapsible
              key={item.title}
              defaultOpen={isParentActive(item)}
              className="group/collapsible"
              render={<SidebarMenuItem />}
            >
              <CollapsibleTrigger
                nativeButton={false}
                render={
                  <SidebarMenuButton
                    tooltip={item.title}
                    render={<a href={item.url || "#"} />}
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
                            <a href={subItem.url}>
                              {subItem.icon}
                              <span>{subItem.title}</span>
                            </a>
                          }
                        />
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              ) : null}
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </>
  );
}
