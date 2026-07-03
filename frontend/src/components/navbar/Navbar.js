'use client'

import React, { useEffect, useState } from 'react'
import ButtonPr from '../ui/ButtonPr'
import ButtonSe from '../ui/ButtonSe'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '../Context/AuthContext'
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


import { Button } from "@/components/ui/button"
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
} from "@/components/ui/dropdown-menu"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"


function Navbar() {
  const { isAuthenticated, logout, checkAuth , user } = useAuth()
  const router = useRouter()
  const { setTheme , theme } = useTheme()


  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    checkAuth()
      .catch(() => {})
      .finally(() => {
        setIsChecking(false)
        console.log(user);
      })
  }, [checkAuth])

  const LogoutFun = async () => {
    await logout()
    router.push('/login')
  }

  return (
    <main
  className={`flex justify-between items-center py-5 px-20 ${
    theme === "dark" ? "bg-black" : "bg-white"
  }`}
>
      <div className='flex items-center gap-10'>
      <div className='flex items-center gap-3'>
        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                        <LuGraduationCap className="size-4" />
        </div>
        <h1 className='text-2xl font-extrabold'>School<span className='text-blue-500'>.</span></h1>
      </div>

      <nav className="flex gap-5 *:border-black *:hover:border-b-1">
        <Link href="/">Home</Link>
        <Link href="/">About</Link>
        <Link href="/">Contact</Link>
      </nav>
      </div> 

    

      <diV className="flex items-center gap-5">   
        <Button
                      onClick={() =>
                        setTheme(theme === "dark" ? "light" : "dark")
                      }
                      variant="outline"
                      size="icon"
                    >
                      {theme === "dark" ? (
                        <Sun className="h-[1.2rem] w-[1.2rem]" />
                      ) : (
                        <Moon className="h-[1.2rem] w-[1.2rem]" />
                      )}
          
                      <span className="sr-only">Toggle theme</span>
                    </Button>
      
      {isChecking ? ( <div className='h-13 w-34 rounded-md bg-gray-200 animate-pulse'></div> ) : isAuthenticated ? (
        <div className='flex gap-5 items-center'>
        
      
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className='flex gap-2 items-center text-xl font-bold border-1 p-4 rounded-full cursor-pointer hover:bg-gray-100 transition-colors duration-300'>
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
                  <DropdownMenuShortcut >⇧⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/dashboard")} >
                  <IoCardOutline />
                  Dashbord
                  <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem><LuGithub/> GitHub</DropdownMenuItem>
                <DropdownMenuItem><BiSupport />Support</DropdownMenuItem>
                <DropdownMenuItem disabled><IoMdCloudOutline />API</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={LogoutFun}>
                  <TbLogout />Log out
                  <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <div className='flex gap-3'>
          <div onClick={() => router.push('/login')} className="cursor-pointer">
            <ButtonPr text="Login" />
          </div>

          <div onClick={() => router.push('/register')} className="cursor-pointer">
            <ButtonSe text="Sign up" />
          </div>
        </div>
      )}
      </diV>
    </main>
  )
}

export default Navbar
