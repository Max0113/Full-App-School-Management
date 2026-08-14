"use client";

import { LifeBuoyIcon, SendIcon, PieChartIcon, MapIcon } from "lucide-react";
import { useAuth } from "@/components/Context/AuthContext";
import { GoHomeFill } from "react-icons/go";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

import { PiStudentBold } from "react-icons/pi";
import { PiUserBold } from "react-icons/pi";
import { FaChalkboardTeacher } from "react-icons/fa";
import { SidebarCom } from "@/components/app-sidebar";
import { BiArchive } from "react-icons/bi";
import { BiArrowFromBottom } from "react-icons/bi";
import { BiDna } from "react-icons/bi";
import { FiCalendar } from "react-icons/fi";
import { MdOutlineMeetingRoom } from "react-icons/md";
import { FiBook } from "react-icons/fi";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { MdOutlineAssignment } from "react-icons/md";
import { BiChalkboard } from "react-icons/bi";
import { MdOutlineCheckCircleOutline } from "react-icons/md";
import { BiBarChartAlt2 } from "react-icons/bi";
import { BiColumns } from "react-icons/bi";
import { BiFontColor } from "react-icons/bi";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { GoHome } from "react-icons/go";
import { BiHomeAlt } from "react-icons/bi";

export function AppSidebar({ ...props }) {
  const { user, checkAuth, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const runCheckAuth = async () => {
      try {
        await checkAuth();
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    runCheckAuth();
  }, [isAuthenticated]);

  const data = {
    user: {
      name: isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-3 w-[100px]" />
          <Skeleton className="h-3 w-[150px]" />
        </div>
      ) : (
        (user?.firstname ?? "Unknown")
      ),
      email: isLoading ? "" : (user?.email ?? ""),
      avatar: "/avatars/shadcn.jpg",
    },
    pageMain: [
      {
        title: "Dashboard",
        icon: <BiHomeAlt />,
        url: "/admin/dashboard",
        items: null,
      },
      {
        title: "Gestion Académique",
        icon: <BiArchive />,
        isActive: true,
        items: [
          {
            title: "Niveaux & Années",
            icon: <BiArrowFromBottom />,
            url: "/admin/manage-school",
          },
          {
            title: "Spécialités",
            icon: <BiDna />,
            url: "/admin/manage-specialites",
          },
          {
            title: "Classes",
            icon: <MdOutlineMeetingRoom />,
            url: "/admin/manage-classes",
          },
          {
            title: "Matières",
            icon: <FiBook />,
            url: "/admin/manage-subjects",
          },
        ],
      },
      {
        title: "Utilisateurs",
        icon: <FaRegUser />,
        items: [
          {
            title: "Élèves",
            icon: <PiStudentBold />,
            url: "/admin/manage-students",
          },
          {
            title: "Enseignants",
            icon: <FaChalkboardTeacher />,
            url: "/admin/manage-teachers",
          },
          {
            title: "Parents",
            icon: <PiUserBold />,
            url: "/admin/manage-parents",
          },
          {
            title: "Admins",
            icon: <MdOutlineAdminPanelSettings />,
            url: "/admin/manage-admins",
          },
        ],
      },
      {
        title: "Enseignement",
        icon: <FaChalkboardTeacher />,
        items: [
          {
            title: "Affectations",
            icon: <MdOutlineAssignment />,
            url: "#",
          },
          {
            title: "Séances de cours",
            icon: <BiChalkboard />,
            url: "#",
          },
          {
            title: "Absences",
            icon: <MdOutlineCheckCircleOutline />,
            url: "#",
          },
        ],
      },
      {
        title: "Évaluations",
        icon: <BiBarChartAlt2 />,
        items: [
          {
            title: "Examens",
            icon: <BiColumns />,
            url: "#",
          },
          {
            title: "Notes",
            icon: <BiFontColor />,
            url: "#",
          },
        ],
      },
      {
        title: "Finance",
        icon: <RiMoneyDollarCircleLine />,
        items: [
          {
            title: "Paiements élèves",
            icon: <PiStudentBold />,
            url: "#",
          },
          {
            title: "Salaires enseignants",
            icon: <FaChalkboardTeacher />,
            url: "#",
          },
        ],
      },
    ],
    navSecondary: [
      { title: "Settings", url: "#", icon: <LifeBuoyIcon /> },
      { title: "Support", url: "#", icon: <SendIcon /> },
    ],
  };

  return <SidebarCom data={data} />;
}
