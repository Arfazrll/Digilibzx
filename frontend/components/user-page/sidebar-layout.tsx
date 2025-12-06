import React from 'react';
import AppSidebar from '@/components/user-page/app-sidebar';
import {
  SidebarProvider,
  SidebarInset,
} from '@/components/ui/sidebar';

interface SidebarLayoutProps {
  children: React.ReactNode;
  header: React.ReactNode;
  defaultOpen?: boolean;
}

export default function SidebarLayout({ children, header, defaultOpen }: SidebarLayoutProps) {
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar className="pt-3" />
      <SidebarInset className="bg-muted/50">
        <div className="bg-white">{header}</div>
        <div className="container mx-auto p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
