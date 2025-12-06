"use client"

import { useAuthGuard } from "@/common/tokenizer"
import LoadingComponent from "@/components/loading";
import Navbar from '@/components/navbar-user';

interface UserLayoutProps {
  children: React.ReactNode
}

export default function UserLayout({ children }: UserLayoutProps) {
  const { isLoading } = useAuthGuard();
    if (isLoading) {
        return (
        <div className="flex items-center justify-center h-screen">
            <LoadingComponent/>
        </div>
        );
    }
  return (
    <>
        <Navbar/>
        {children}
    </>
  )
}

