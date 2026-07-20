"use client";

import React, { useEffect, useState } from "react";
import ButtonPr from "../ui/ButtonPr";
import ButtonSe from "../ui/ButtonSe";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../Context/AuthContext";
import { GoPerson } from "react-icons/go";
import { IoCardOutline } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";
import { IoPeopleOutline } from "react-icons/io5";
import { FiUserPlus } from "react-icons/fi";
import { FiPlus } from "react-icons/fi";
import { LuGithub } from "react-icons/lu";
import { BiSupport } from "react-icons/bi";
import { IoMdCloudOutline } from "react-icons/io";
import { TbLogout } from "react-icons/tb";
import { MdOutlineLightMode } from "react-icons/md";
import { LuGraduationCap } from "react-icons/lu";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import ThemeToggle from "@/components/ui/SunMoon";
import { useTheme } from "next-themes";
import { Skeleton } from "../ui/skeleton";

function Navbar() {
  const { isAuthenticated, logout, checkAuth, user } = useAuth();
  const router = useRouter();

  const [isChecking, setIsChecking] = useState(true);
  const [role, Setrole] = useState("");
  const { theme } = useTheme();

  useEffect(() => {
    const verifyAuth = async () => {
      setIsChecking(true);
      const authenticated = localStorage.getItem("AUTHENTICATED") === "true";

      if (!authenticated) {
        setIsChecking(false);
        return;
      }

      try {
        const res = await checkAuth();
        Setrole(res.role);
      } catch (error) {
        console.error(error);
      } finally {
        setIsChecking(false);
      }
    };

    verifyAuth();
  }, [isAuthenticated]);

  const LogoutFun = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <main
      className={`flex justify-between items-center py-5 px-20 bg-white dark:bg-black`}
    >
      <div className="flex items-center gap-10">
        <div className="flex items-center gap-3">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <LuGraduationCap className="size-4" />
          </div>
          <h1 className="text-2xl font-extrabold">
            School<span className="text-blue-500">.</span>
          </h1>
        </div>

        <nav className="flex gap-5 *:border-black *:hover:border-b-1">
          <Link href="/">Home</Link>
          <Link href="/">About</Link>
          <Link href="/">Contact</Link>
        </nav>
      </div>

      <div className="flex items-center gap-5">
        <ThemeToggle />

        {isChecking ? (
          <Skeleton className="h-13 w-27"></Skeleton>
        ) : isAuthenticated ? (
          <div className="flex gap-5 items-center">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="flex gap-2 items-center text-xl font-bold border-1 p-4 rounded-full cursor-pointer hover:bg-gray-100 hover:dark:bg-gray-500 transition-colors duration-300">
                  <GoPerson />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-60 px-2" align="start">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <GoPerson />
                    Profile
                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push(role + "/dashboard")}
                  >
                    <IoCardOutline />
                    Dashbord
                    <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <LuGithub /> GitHub
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <BiSupport />
                    Support
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled>
                    <IoMdCloudOutline />
                    API
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={LogoutFun}>
                    <TbLogout />
                    Log out
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex gap-3">
            <div onClick={() => router.push("/login")}>
              <Button className="text-md dark:text-white font-semibold py-6 px-8 dark:bg-blue-500 dark:hover:bg-blue-400 cursor-pointer">
                Login
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default Navbar;
