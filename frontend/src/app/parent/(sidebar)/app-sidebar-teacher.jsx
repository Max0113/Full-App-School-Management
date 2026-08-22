"use client";

import { useAuth } from "@/components/Context/AuthContext";
import { GoHomeFill } from "react-icons/go";
import { useEffect, useState } from "react";
import { SidebarCom } from "@/components/app-sidebar";
import { PiStudentBold } from "react-icons/pi";

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
        url: "/parent/dashboard",
        icon: <GoHomeFill />,
        items: null,
      },
      {
        title: "My Children",
        url: "#",
        icon: <PiStudentBold />,
        items: null,
      },
    ],
    navSecondary: [],
  };

  return <SidebarCom data={data} />;
}
