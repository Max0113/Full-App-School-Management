import React from "react";
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
} from "lucide-react";
import { LuGraduationCap } from "react-icons/lu";
import { GoHomeFill } from "react-icons/go";

export const dataSidebar = {
  // ----------- Student ------------
  dataStudent: {
    navSecondary: [
      {
        title: "Support",
        url: "#",
        icon: <LifeBuoyIcon />,
      },
      {
        title: "Feedback",
        url: "#",
        icon: <SendIcon />,
      },
    ],
    pageGeneral: [
      {
        name: "Dahbord",
        url: "/dashboard",
        icon: <GoHomeFill />,
      },
      {
        name: "Learning",
        url: "#",
        icon: <PieChartIcon />,
      },
      {
        name: "Exames",
        url: "#",
        icon: <MapIcon />,
      },
    ],
  },

  // ----------- Admin ------------
  dataAdmin: {
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
    pageGeneral: [
      {
        name: "Dahbord",
        url: "/dashboard",
        icon: <GoHomeFill />,
      },
      {
        name: "Check",
        url: "#",
        icon: <PieChartIcon />,
      },
      {
        name: "Support",
        url: "#",
        icon: <MapIcon />,
      },
    ],
  },

  // ----------- Teacher ------------
  dataTeacher: {
    navSecondary: [
      {
        title: "Setting",
        url: "#",
        icon: <LifeBuoyIcon />,
      },
      {
        title: "Feedback",
        url: "#",
        icon: <SendIcon />,
      },
    ],
    pageGeneral: [
      {
        name: "Dahbord",
        url: "/dashboard",
        icon: <GoHomeFill />,
      },
      {
        name: "Student",
        url: "#",
        icon: <PieChartIcon />,
      },
      {
        name: "Travel",
        url: "#",
        icon: <MapIcon />,
      },
    ],
  },
};
