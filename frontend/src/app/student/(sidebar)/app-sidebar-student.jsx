"use client";

import { useAuth } from "@/components/Context/AuthContext";
import { GoHomeFill } from "react-icons/go";
import { useEffect, useState } from "react";
import { SidebarCom } from "@/components/app-sidebar";
import { BookOpenCheck, CalendarDays, ClipboardList, ClipboardX, GraduationCap, Info } from "lucide-react";

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
        title: "Mes Notes",
        url: "/student/manage-grades",
        icon: <BookOpenCheck />,
        items: null,
      },
      { title: "Mes Séances", url: "/student/manage-sessions", icon: <CalendarDays />, items: null },
      { title: "Mes Examens", url: "/student/manage-exams", icon: <ClipboardList />, items: null },
      { title: "Mes Absences", url: "/student/manage-absences", icon: <ClipboardX />, items: null },
      { title: "Enseignants", url: "/student/manage-teachers", icon: <GraduationCap />, items: null },
      { title: "Informations école", url: "/student/manage-school-info", icon: <Info />, items: null },
    ],
    navSecondary: [],
  };

  return <SidebarCom data={data} />;
}
