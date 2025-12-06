"use client"

import * as React from "react"
import {
  BookOpen,
  Command,
  Frame,
  HelpCircle,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
  UserPen,
  BriefcaseBusiness,
  MonitorSmartphone,
  Cpu,
  Piano,
  BookHeart,
  Swords,
  Sparkles,
  MoreHorizontal
} from "lucide-react"

import { NavMain } from "@/components/user-page/nav-main"
import { NavProjects } from "@/components/user-page/nav-projects"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "../ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { appInfo, assets } from "@/app/config"
import Link from "next/link"
import { NavNonBook } from "./nav-nonbook"
import { useEffect, useState } from "react"
import { MagicWandIcon } from "@radix-ui/react-icons"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navBook: [
    {
      title: "Fiction",
      url: "/collections?category=fiction",
      icon: MagicWandIcon, // ganti sesuai kebutuhan
      isActive: true,
    },
    {
      title: "Romance",
      url: "/collections?category=romance",
      icon: BookHeart, // ganti sesuai kebutuhan
    },
    {
      title: "Action",
      url: "/collections?category=action",
      icon: Swords, // ganti sesuai kebutuhan
    },
    {
      title: "Memoir",
      url: "/collections?category=memoir",
      icon: BookOpen, // ganti sesuai kebutuhan
    },
    {
      title: "Fantasy",
      url: "/collections?category=fantasy",
      icon: Sparkles, // ganti sesuai kebutuhan
    },
    {
      title: "Lainnya",
      icon: MoreHorizontal, // ganti sesuai kebutuhan
      items: [
        {
          title: "Finance",
          url: "/collections?kind=ebook&category=finance&subcategory=finance",
        },
        {
          title: "Self-help",
          url: "/collections?kind=ebook&category=self-help&subcategory=self-help",
        },
        {
          title: "Southern Gothic",
          url: "/collections?kind=ebook&category=southern gothic&subcategory=southern gothic",
        },
        {
          title: "Drama",
          url: "/collections?kind=ebook&category=drama&subcategory=drama",
        },
        {
          title: "Philosophy",
          url: "/collections?kind=ebook&category=philosophy&subcategory=philosophy",
        },
      ],
    }
  ],
  navEBook: [
    {
      title: "Komputer",
      url: "/collections?kind=ebook&category=Komputer",
      icon: MonitorSmartphone, // ganti sesuai kebutuhan
      items: [
        {
          title: "Aplikasi Bisnis & Produktivitas",
          url: "/collections?kind=ebook&category=Komputer&subcategory=Aplikasi Bisnis & Produktivitas",
        },
        {
          title: "Database Administrasi & Manajemen",
          url: "/collections?kind=ebook&category=Komputer&subcategory=Database Administrasi & Manajemen",
        },
        {
          title: "Desain, Grafik & Media",
          url: "/collections?kind=ebook&category=Komputer&subcategory=Desain, Grafik & Media",
        },
        {
          title: "Internet",
          url: "/collections?kind=ebook&category=Komputer&subcategory=Internet",
        },
        {
          title: "Pemrograman",
          url: "/collections?kind=ebook&category=Komputer&subcategory=Pemrograman",
        },
      ],
    },
    {
      title: "Teknologi",
      url: "/collections?kind=ebook&category=Teknologi",
      icon: Cpu, // ganti sesuai kebutuhan
      items: [
        {
          title: "Teknik Elektro",
          url: "/collections?kind=ebook&category=Teknologi&subcategory=Teknik Elektro",
        },
        {
          title: "Teknologi Informasi",
          url: "/collections?kind=ebook&category=Teknologi&subcategory=Teknologi Informasi",
        },
        {
          title: "Robotik",
          url: "/collections?kind=ebook&category=Teknologi&subcategory=Robotik",
        },
        {
          title: "Kecerdasan Buatan",
          url: "/collections?kind=ebook&category=Teknologi&subcategory=Kecerdasan Buatan",
        },
        {
          title: "Jaringan Komputer",
          url: "/collections?kind=ebook&category=Teknologi&subcategory=Jaringan Komputer",
        },
      ],
    },
    {
      title: "Musik",
      url: "/collections?kind=ebook&category=Musik",
      icon: Piano, // ganti sesuai kebutuhan
      items: [
        {
          title: "Alat Musik",
          url: "/collections?kind=ebook&category=Musik&subcategory=Alat Musik",
        },
        {
          title: "Dance",
          url: "/collections?kind=ebook&category=Musik&subcategory=Dance",
        },
        {
          title: "Instruksi & Studi",
          url: "/collections?kind=ebook&category=Musik&subcategory=Instruksi & Studi",
        },
        {
          title: "Musik Klasik",
          url: "/collections?kind=ebook&category=Musik&subcategory=Musik Klasik",
        },
        {
          title: "Komposisi Musik",
          url: "/collections?kind=ebook&category=Musik&subcategory=Komposisi Musik",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
  navNonBook: [
    2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017
  ]
}

export default function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="sidebar" {...props}>
      <SidebarHeader className='bg-white'>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                  <img
                    src={assets.logoUrl}
                    className="w-8"
                    alt="logo"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{appInfo.appName}</span>
                  <span className="truncate text-xs">{appInfo.tagLine}</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-white">
        {/* <Tabs defaultValue="book" className="w-full mt-3">
          <TabsList className="mx-auto flex items-center w-fit rounded-full gap-2 p-2 h-10">
            <TabsTrigger value="book" className="rounded-full">Book</TabsTrigger>
            <TabsTrigger value="non-book" className="rounded-full">Non Book</TabsTrigger>
          </TabsList>
          <TabsContent value="book">
            <NavMain kind="Buku" items={data.navBook} />
            <NavMain kind="E-Book" items={data.navEBook} />

          </TabsContent>
          <TabsContent value="non-book">
            <NavNonBook kind="Journal" items={data.navNonBook} />
          </TabsContent>
        </Tabs> */}
        <TabsComponent data={data}/>
      </SidebarContent>

      <SidebarFooter className="border-t p-4 bg-white">
        <div className="rounded-lg bg-gray-100 p-4">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-white p-2">
              <HelpCircle className="h-6 w-6 text-teal-500" />
            </div>
            <div>
              <h4 className="font-semibold">Need help?</h4>
              <p className="text-sm text-gray-500">Contact our helpdesk</p>
            </div>
          </div>
          <Link href="https://wa.me/6282232335782">
            <Button variant="outline" className="mt-4 w-full font-semibold">
              CONTACT
            </Button>
          </Link>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}



function TabsComponent({ data }: { data: any }) {
  const [activeTab, setActiveTab] = useState<string>("book");
  return (
    <Tabs
      defaultValue={activeTab}
      onValueChange={(value) => setActiveTab(value)}
      className="w-full mt-3"
    >
      {/* <TabsList className="mx-auto flex items-center w-fit rounded-full gap-2 p-2 h-10">
        <TabsTrigger value="book" className="rounded-full">Book</TabsTrigger>
        <TabsTrigger value="non-book" className="rounded-full">Non Book</TabsTrigger>
      </TabsList> */}
      <TabsContent value="book">
        <NavMain kind="Buku" items={data.navBook} />
        {/* <NavMain kind="E-Book" items={data.navEBook} /> */}
      </TabsContent>
      {/* <TabsContent value="non-book">
        <NavNonBook kind="Journal" items={data.navNonBook} />
        <NavProjects projects={data.projects} />
      </TabsContent> */}
    </Tabs>
  );
}
