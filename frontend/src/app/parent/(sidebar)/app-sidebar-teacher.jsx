"use client";

import { useAuth } from "@/components/Context/AuthContext";
import { GoHomeFill } from "react-icons/go";
import { useEffect, useState } from "react";
import { SidebarCom } from "@/components/app-sidebar";
import { PiStudentBold } from "react-icons/pi";
import { CalendarDays, ClipboardList, GraduationCap, Info } from "lucide-react";
import { LifeBuoyIcon, SendIcon } from "lucide-react";

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
      name: isLoading
        ? ""
        : `${user?.firstname ?? ""} ${user?.lastname ?? ""}`.trim() ||
          "Unknown",
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
        title: "Notes des enfants",
        url: "/parent/grades",
        icon: <PiStudentBold />,
        items: null,
      },
      {
        title: "Calendrier & séances",
        url: "/parent/sessions",
        icon: <CalendarDays />,
        items: null,
      },
      {
        title: "Examens",
        url: "/parent/exams",
        icon: <ClipboardList />,
        items: null,
      },
      {
        title: "Enseignants",
        url: "/parent/teachers",
        icon: <GraduationCap />,
        items: null,
      },
      {
        title: "Informations école",
        url: "/parent/school-info",
        icon: <Info />,
        items: null,
      },
    ],
    navSecondary: [
      { title: "Settings", url: "#", icon: <LifeBuoyIcon /> },
      { title: "Support", url: "#", icon: <SendIcon /> },
    ],
  };

  return <SidebarCom data={data} />;
}
