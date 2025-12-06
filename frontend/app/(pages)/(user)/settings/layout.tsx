"use client"

import { Metadata } from "next"
import Image from "next/image"
import { Separator } from "@/components/ui/separator"
import { SidebarNav } from "@/components/user-page/sidebar-nav"
import { useAuthGuard } from "@/common/tokenizer"
import LoadingComponent from "@/components/loading"

const sidebarNavItems = [
  {
    title: "Akun",
    href: "/settings/account",
  },
  {
    title: "Pengembalian",
    href: "/settings/return",
  },
  {
    title: "Riwayat Transaksi",
    href: "/settings/transaction-history",
  },
  {
    title: "Bookmarked",
    href: "/settings/bookmark",
  },
  {
    title: "Notifications",
    href: "/settings/notifications",
  },
]

interface SettingsLayoutProps {
  children: React.ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const { isLoading } = useAuthGuard();
    if (isLoading) {
        return (
        <div className="flex items-center justify-center h-screen">
            <LoadingComponent/>
        </div>
        );
    }
  return (
    <div className="container mx-auto space-y-6 p-10 pb-16">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and set preferences.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="w-full">{children}</div>
      </div>
    </div>
  )
}