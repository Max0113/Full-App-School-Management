"use client";

import {
  TerminalSquareIcon,
  BotIcon,
  BookOpenIcon,
  Settings2Icon,
  LifeBuoyIcon,
  SendIcon,
  FrameIcon,
  PieChartIcon,
  MapIcon,
  TerminalIcon,
  Cast,
} from "lucide-react";
import { useAuth } from "@/components/Context/AuthContext";
import { GoHomeFill } from "react-icons/go";
import { useEffect, useState } from "react";
import { SidebarCom } from "@/components/app-sidebar";
import { Skeleton } from "@/components/ui/skeleton";

export function AppSidebar({ ...props }) {
  const { user, checkAuth, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const runCheckAuth = async () => {
      try {
        await checkAuth(); // updates `user` and `isAuthenticated` inside the context itself
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    runCheckAuth();
  }, []);

  const data = {
    user: {
      name: isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-3 w-[100px]" />
          <Skeleton className="h-3 w-[150px]" />
        </div>
      ) : (
        (user?.firstname + " " + user?.lastname ?? "Unknown")
      ),
      email: isLoading ? "" : (user?.email ?? ""),
      avatar: "/avatars/shadcn.jpg",
    },
    pageGeneral: [
      {
        name: "Dahbord",
        url: "/teacher/dashboard",
        icon: <GoHomeFill />,
      },
      {
        name: "Student",
        url: "#",
        icon: <PieChartIcon />,
      },
      {
        name: "Parents of Students",
        url: "#",
        icon: <MapIcon />,
      },
    ],
    navSecondary: [
      {
        title: "Setting Avenc",
        url: "#",
        icon: <LifeBuoyIcon />,
      },
      {
        title: "Feedback",
        url: "#",
        icon: <SendIcon />,
      },
    ],
  };

  return <SidebarCom data={data} />;
}
