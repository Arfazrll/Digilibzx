"use client"

import Navbar from '@/components/navbar-user';

interface UserLayoutProps {
  children: React.ReactNode
}

export default function CollectionLayout({ children }: UserLayoutProps) {
  return (
    <>
        <Navbar/>
        {children}
    </>
  )
}

