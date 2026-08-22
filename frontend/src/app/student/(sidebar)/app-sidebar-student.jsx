"use client";

import { useAuth } from "@/components/Context/AuthContext";
import { GoHomeFill } from "react-icons/go";
import { useEffect, useState } from "react";
import { SidebarCom } from "@/components/app-sidebar";
import { BiColumns } from "react-icons/bi";

export function AppSidebar({ ...props }) {
  const { user, checkAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const run = async () => {
      try {
        await checkAuth();
      } catch {
        // Guard handles redirection.
      } finally {
        if (active) setIsLoading(false);
      }
    };
    run();
    return () => {
      active = false;
    };
  }, [checkAuth]);

  const data = {
    user: {
      name: isLoading ? "" : `${user?.firstname ?? ""} ${user?.lastname ?? ""}`.trim() || "Unknown",
      email: isLoading ? "" : (user?.email ?? ""),
      avatar: "/avatars/shadcn.jpg",
    },
    pageMain: [
      {
        title: "Dashboard",
        url: "/student/dashboard",
        icon: <GoHomeFill />,
        items: null,
      },
      {
        title: "Exams & Notes",
        url: "#",
        icon: <BiColumns />,
        items: null,
      },
    ],
    navSecondary: [],
  };

  return <SidebarCom data={data} />;
}
