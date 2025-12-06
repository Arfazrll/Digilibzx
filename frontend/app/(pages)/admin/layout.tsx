"use client"

import React, { useEffect, useState } from "react"
import { AppSidebar } from "@/components/admin-page/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Sun, Moon, Cloud } from 'lucide-react'
import { useAuthGuard } from "@/common/tokenizer"

interface AdminLayoutProps {
  children: React.ReactNode,
  page?: string
}

export default function AdminLayout({ children, page }: AdminLayoutProps) {
  const { isLoading } = useAuthGuard();
  const [currentDate, setCurrentDate] = useState<string>("")
  const [greeting, setGreeting] = useState<string>("")
  const [icon, setIcon] = useState<React.ReactNode>(<Cloud />)

  useEffect(() => {
    const updateDate = () => {
      const now = new Date()

      const formattedDate = now.toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })

      setCurrentDate(formattedDate)

      const hour = now.getHours()
      if (hour >= 5 && hour < 12) {
        setGreeting("Selamat Pagi")
        setIcon(<Sun className="text-yellow-500" />)
      } else if (hour >= 12 && hour < 15) {
        setGreeting("Selamat Siang")
        setIcon(<Sun className="text-yellow-600" />)
      } else if (hour >= 15 && hour < 18) {
        setGreeting("Selamat Sore")
        setIcon(<Cloud className="text-orange-500" />)
      } else {
        setGreeting("Selamat Malam")
        setIcon(<Moon className="text-blue-500" />)
      }
    }

    updateDate()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Admin validation...</p>
      </div>
    );
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "350px",
        } as React.CSSProperties
      }
    >
      <div className="flex overflow-hidden w-full">
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1 overflow-hidden">
          <header className="sticky top-0 z-10 flex shrink-0 items-center gap-2 border-b bg-background p-4">
            <div className="flex flex-1 items-center gap-2 px-3">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
                  </BreadcrumbItem>
                  {page &&
                    <>
                      <BreadcrumbSeparator className="hidden md:block" />
                      <BreadcrumbItem>
                        <BreadcrumbPage>{page}</BreadcrumbPage>
                      </BreadcrumbItem>
                    </>
                  }
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="ml-auto px-3 md:flex items-center gap-2 text-gray-500 hidden">
              {icon}
              <span>
                {greeting} | {currentDate}
              </span>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-4">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}