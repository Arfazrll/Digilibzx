"use client";

import * as React from "react";
import {
    CalendarSearch,
    CalendarArrowDownIcon,
    LibraryBig,
    LayoutDashboard,
    UserRound,
    Cog,
    RefreshCcw,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarInput, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import Link from "next/link";
import { assets } from "@/app/config";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { NavUser } from "@/components/admin-page/nav-user";
import InvoiceComponent from "../user-page/borrow/invoice";
import { fetchTransactions, fetchUpdateStatusTransaction } from "@/lib/api/transactions";
import { Transaction } from "@/types/interfaces";
import { toast } from "sonner";

const data = {
    user: {
        name: "admin",
        email: "admin@admin.com",
        avatar: `https://api.dicebear.com/6.x/initials/svg?seed=admin`,
    },
    navMain: [
        { title: "Dashboard", url: "/admin", icon: LayoutDashboard, isActive: true },
        { title: "Book", url: "/admin/book", icon: LibraryBig, isActive: false },
        { title: "User", url: "/admin/user", icon: UserRound, isActive: false },
        { title: "Transaction", url: "/admin/transaction", icon: CalendarSearch, isActive: false },
        { title: "Return", url: "/admin/return", icon: CalendarArrowDownIcon, isActive: false },
        // { title: "Settings", url: "/admin/settings", icon: Cog, isActive: false },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const [activeItem, setActiveItem] = React.useState(data.navMain[0]);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [filteredData, setFilteredData] = React.useState<Transaction[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await fetchTransactions({
                search: searchQuery,
                status: "pending", 
                type: "borrow"
            });
            setFilteredData(data);
        } catch (err) {
            console.error("Error fetching transactions:", err);
            setError("Failed to fetch transactions.");
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchData();
    }, [searchQuery]);

    const approveDeclineButton = async (invoiceCode: string, status: string) => {
        console.log("asdf")
        setLoading(true);
        setError(null);

        try {
            const updateStatus = await fetchUpdateStatusTransaction(invoiceCode, status);
            fetchData();
            toast(`Berhasil update status ${status}`)
        } catch(err) {
            toast(`Gagas update status ${err}`)
            console.error("Error update status transactions:", err);
            setError("Failed to update status transactions.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Sidebar collapsible="icon" className="overflow-hidden [&>[data-sidebar=sidebar]]:flex-row" {...props}>
            <Sidebar collapsible="none" className="!w-[calc(var(--sidebar-width-icon)_+_1px)] border-r">
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                                <a href="/admin">
                                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                                        <img src={assets.logoUrl} className="w-8" alt="logo" />
                                    </div>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">Book Wise</span>
                                        <span className="truncate text-xs">Admin Dashboard</span>
                                    </div>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupContent className="px-1.5 md:px-0">
                            <SidebarMenu>
                                {data.navMain.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <Link href={item.url} className="flex items-center space-x-2">
                                            <SidebarMenuButton
                                                tooltip={{ children: item.title, hidden: false }}
                                                onClick={() => setActiveItem(item)}
                                                isActive={activeItem.title === item.title}
                                                className="px-2.5 md:px-2"
                                            >
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </SidebarMenuButton>
                                        </Link>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarFooter>
                    <NavUser user={data.user} />
                </SidebarFooter>
            </Sidebar>

            <Sidebar collapsible="none" className="hidden flex-1 md:flex">
                <SidebarHeader className="gap-3.5 border-b p-4">
                    <div className="flex w-full items-center justify-between">
                        <div className="text-base font-medium text-foreground">
                            Pending Approval
                        </div>
                        <Label className="flex items-center gap-2 text-sm">
                            <Button variant="ghost" size="icon" onClick={() => fetchData()}>
                                <RefreshCcw className="h-4 w-4"/>
                            </Button>
                            {filteredData?.length !== 0 && (
                                <span className="w-6 h-6 rounded-full bg-[#E02954] text-primary-foreground text-xs flex items-center justify-center">
                                    {filteredData.length > 9 ? "10+" : filteredData.length}
                                </span>
                            )}
                        </Label>
                    </div>
                    <SidebarInput
                        placeholder="Type to search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup className="px-0">
                        <SidebarGroupContent>
                            {loading && <p>Loading...</p>}
                            {error && <p className="text-red-500">{error}</p>}
                            {filteredData.map((item) => (
                                <Dialog key={item.id}>
                                    <DialogTrigger asChild>
                                        <button className="flex w-full flex-col items-start gap-2 whitespace-nowrap border-b p-4 text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                                            <div className="flex w-full items-center gap-2">
                                                <span className="font-medium">{item.invoiceCode}</span>
                                                <span className="ml-auto text-xs">{item.dateRange.from}</span>
                                            </div>
                                            <div className="text-xs">Nama: {item.user.name}</div>
                                            <span className="text-xs">Phone: {item.user.phone}</span>
                                        </button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-4xl w-full overflow-y-auto">
                                        <DialogHeader>
                                            <DialogTitle>Transaction Approval</DialogTitle>
                                        </DialogHeader>
                                        <div className="max-h-[70vh] overflow-y-auto">
                                            <InvoiceComponent invoiceCode={item.invoiceCode} />
                                        </div>
                                        <DialogFooter>
                                            <Button variant="secondary" onClick={() => approveDeclineButton(item.invoiceCode, "declined")}>Decline</Button>
                                            <Button onClick={() => approveDeclineButton(item.invoiceCode, "approved")}>Approve</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            ))}
                            {filteredData.length == 0 && (
                                <p className="text-gray-500 text-center col-span-full text-sm">
                                <img src="/assets/dino.png" alt="dino" width={40} height={40} className="mx-auto mt-10 mb-3" />
                                "Your calm day right?<br /> No need to work today!"
                            </p>
                            )}
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>
        </Sidebar>
    );
}
