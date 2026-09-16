"use client";

import { useAuth } from "@/components/Context/AuthContext";
import { GoHomeFill } from "react-icons/go";
import { useEffect, useState } from "react";
import { SidebarCom } from "@/components/app-sidebar";
import { PiStudentBold } from "react-icons/pi";
import { PiUsersThreeBold } from "react-icons/pi";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { FaCheckDouble } from "react-icons/fa6";
import { BiColumns } from "react-icons/bi";
import { BiFontColor } from "react-icons/bi";
import { PiUserBold } from "react-icons/pi";



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
        url: "/teacher/dashboard",
        icon: <GoHomeFill />,
        items: null,
      },
      {
        title: "My Students",
        url: "/teacher/manage-student",
        icon: <PiStudentBold />,
        items: null,
      },
      {
        title: "My Classes",
        url: "/teacher/manage-classes",
        icon: <PiUsersThreeBold />,
        items: null,
      },
      {
        title: "My Sessions",
        url: "/teacher/sessions",
        icon: <MdOutlineCalendarMonth />,
        items: null,
      },
      {
        title: "Attendance",
        url: "/teacher/attendance",
        icon: <FaCheckDouble />,
        items: null,
      },
      {
        title: "My Exams",
        url: "/teacher/exams",
        icon: <BiColumns />,
        items: null,
      },
      {
        title: "Grades",
        url: "/teacher/grades",
        icon: <BiFontColor />,
        items: null,
      },
      {
        title: "Parents of Students",
        url: "/teacher/parents",
        icon: <PiUserBold />,
        items: null,
      },
    ],
    navSecondary: [],
  };

  return <SidebarCom data={data} />;
}
