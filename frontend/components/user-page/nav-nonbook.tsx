"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

export function NavNonBook({
  kind, items,
}: {
  kind?: string
  items: number[]
  }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{kind}</SidebarGroupLabel>
      <SidebarMenu>
            <SidebarMenuItem>
                    <SidebarMenuSub>
                      {items.map((item) => (
                        <SidebarMenuSubItem key={item}>
                          <SidebarMenuSubButton asChild>
                            <a href={`/collections?kind=journal&year=${item}`}>
                              <span>{item}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
            </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}
