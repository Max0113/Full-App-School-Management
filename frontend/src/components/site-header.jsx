"use client"

import { SearchForm } from "@/components/search-form"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useSidebar } from "@/components/ui/sidebar"
import { PanelLeftIcon } from "lucide-react"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function SiteHeader() {
  const { toggleSidebar } = useSidebar()
  const { setTheme , theme } = useTheme()

  return (
    <header
      className="sticky top-0 z-50 flex w-full items-center border-b bg-background">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
        <Button className="h-8 w-8" variant="ghost" size="icon" onClick={toggleSidebar}>
          <PanelLeftIcon />
        </Button>
        <Separator
          orientation="vertical"
          className="mr-2 data-vertical:h-4 data-vertical:self-auto" />
        <Breadcrumb className="hidden sm:block">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Build Your Application</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Data Fetching</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex gap-3 w-full sm:ml-auto sm:w-auto">
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
          <SearchForm  />
        </div>
        
      </div>
    </header>
  );
}
