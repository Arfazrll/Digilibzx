'use client'
import React, { useState, useRef, useEffect } from "react";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from "sonner";
import {verifyToken, deleteToken} from "@/common/tokenizer";

import { Book, Menu, Sunset, Trees, Zap, Bell, User, Bookmark, LogOut, Search, History } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { assets } from '@/app/config';
import { Input } from './ui/input';
import { Cart } from "./user-page/borrow/cart";

const webName = "BookWise"


const subMenuItemsOne = [
  {
    title: 'Blog',
    description: 'The latest industry news, updates, and info',
    icon: <Book className="size-5 shrink-0" />,
  },
  {
    title: 'Compnay',
    description: 'Our mission is to innovate and empower the world',
    icon: <Trees className="size-5 shrink-0" />,
  },
  {
    title: 'Careers',
    description: 'Browse job listing and discover our workspace',
    icon: <Sunset className="size-5 shrink-0" />,
  },
  {
    title: 'Support',
    description:
      'Get in touch with our support team or visit our community forums',
    icon: <Zap className="size-5 shrink-0" />,
  },
];

const subMenuItemsTwo = [
  {
    title: 'Help Center',
    description: 'Get all the answers you need right here',
    icon: <Zap className="size-5 shrink-0" />,
  },
  {
    title: 'Contact Us',
    description: 'We are here to help you with any questions you have',
    icon: <Sunset className="size-5 shrink-0" />,
  },
  {
    title: 'Status',
    description: 'Check the current status of our services and APIs',
    icon: <Trees className="size-5 shrink-0" />,
  },
  {
    title: 'Terms of Service',
    description: 'Our terms and conditions for using our services',
    icon: <Book className="size-5 shrink-0" />,
  },
];

export default function NavbarAdmin({ loggedAs = "Admin", userName = "Admin" }: { loggedAs?: string, userName?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const onLogout = () => {
    deleteToken()
    toast.success("Logged out successfully");
    router.push("/")
  }

  useEffect(() => {
    setIsLoggedIn(verifyToken())
  })

  return (
    <section className="flex border-b bg-background p-4 sticky top-0 z-50">
      <div className="container mx-auto">
        {/* Desktop */}
        <nav className="hidden justify-between lg:flex">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <img
                src={assets.logoUrl}
                className="w-8"
                alt="logo"
              />
              <span className="text-xl font-bold uppercase">{webName}</span>
              <span className="text-sm font-regular uppercase">| ADMIN PAGE</span>
            </Link>

            {/* button space here */}
          
          </div>
          <div className="flex items-center w-full max-w-lg gap-4">
            {/* space kosong tengah */}
          </div>
          <div className="flex gap-2">
            {isLoggedIn ? (
              <>
                <NavigationMenu className='flex gap-2'>
                  {/* <a
                    className={cn(
                      'text-muted-foreground',
                      navigationMenuTriggerStyle,
                      buttonVariants({
                        variant: 'ghost',
                      }),
                    )}
                    href="/borrow"
                  >
                    Peminjaman
                  </a> */}

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Avatar className="cursor-pointer">
                        <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${userName}`} alt={userName} />
                        <AvatarFallback>{userName}</AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin/settings" className="flex items-center cursor-pointer">
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      {/* <DropdownMenuItem asChild>
                        <Link href="/settings/transaction-history" className="flex items-center cursor-pointer">
                          <History className="mr-2 h-4 w-4" />
                          Transaction History
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/settings/bookmark" className="flex items-center cursor-pointer">
                          <Bookmark className="mr-2 h-4 w-4" />
                          Bookmarks
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/settings/notifications" className="flex items-center cursor-pointer">
                          <Bell className="mr-2 h-4 w-4" />
                          Notifications
                        </Link>
                      </DropdownMenuItem> */}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <button className="flex items-center cursor-pointer w-full" onClick={() => onLogout()}>
                          <LogOut className="mr-2 h-4 w-4" />
                          Logout
                        </button>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </NavigationMenu>
              </>
            ) : (
              <div className="mt-2 flex flex-row gap-3">
                <Button>
                  <Link href="/">Back to home</Link>
                </Button>
              </div>
            )}
          </div>
        </nav>
        {/* Mobile */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2">
                <img
                  src={assets.logoUrl}
                  className="w-8"
                  alt="logo"
                />
              </Link>
            </div>
            {/* space kosong tengah */}
            {isLoggedIn ? (
              // LOGGED IN
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant={'outline'} size={'icon'}>
                    <Menu className="size-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>
                      <div className="flex items-center gap-2">
                        <img
                          src={assets.logoUrl}
                          className="w-8"
                          alt="logo"
                        />
                        <span className="text-xl font-bold">{webName}</span>
                      </div>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="my-8 flex flex-col gap-4">
                    <a href="/" className="font-semibold">
                      Home
                    </a>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="products" className="border-b-0">
                        <AccordionTrigger className="mb-4 py-0 font-semibold hover:no-underline">
                          Products
                        </AccordionTrigger>
                        <AccordionContent className="mt-2">
                          {subMenuItemsOne.map((item, idx) => (
                            <a
                              key={idx}
                              className={cn(
                                'flex select-none gap-4 rounded-md p-3 leading-none outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                              )}
                              href="#"
                            >
                              {item.icon}
                              <div>
                                <div className="text-sm font-semibold">
                                  {item.title}
                                </div>
                                <p className="text-sm leading-snug text-muted-foreground">
                                  {item.description}
                                </p>
                              </div>
                            </a>
                          ))}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                  <div className="border-t pt-4">
                    <div className="mt-2 flex flex-col gap-3">
                      <Button onClick={() => onLogout()}>
                        Logout
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            ) : (
              // NOT LOGGED
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant={'outline'} size={'icon'}>
                    <Menu className="size-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>
                      <div className="flex items-center gap-2">
                        <img
                          src={assets.logoUrl}
                          className="w-8"
                          alt="logo"
                        />
                        <span className="text-xl font-bold">{webName}</span>
                      </div>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="my-8 flex flex-col gap-4">
                    <a href="/collections" className="font-semibold">
                      Home
                    </a>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="products" className="border-b-0">
                        <AccordionTrigger className="mb-4 py-0 font-semibold hover:no-underline">
                          Products
                        </AccordionTrigger>
                        <AccordionContent className="mt-2">
                          {subMenuItemsOne.map((item, idx) => (
                            <a
                              key={idx}
                              className={cn(
                                'flex select-none gap-4 rounded-md p-3 leading-none outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                              )}
                              href="#"
                            >
                              {item.icon}
                              <div>
                                <div className="text-sm font-semibold">
                                  {item.title}
                                </div>
                                <p className="text-sm leading-snug text-muted-foreground">
                                  {item.description}
                                </p>
                              </div>
                            </a>
                          ))}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                  <div className="border-t pt-4">
                    <div className="mt-2 flex flex-col gap-3">
                      <Button variant={'outline'}>
                        <Link href="/auth/signin">Log in</Link>
                      </Button>
                      <Button>
                        <Link href="/auth/signup">Sign Up</Link>
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
