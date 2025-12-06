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
import { fetchNotificationsByUserId } from "@/lib/api/notifications";
import { Notification } from "@/types/interfaces";

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

function SearchBar() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([
    "Harry Potter",
    "The Great Gatsby",
    "1984",
    "Moby Dick",
    "Pride and Prejudice",
  ]);
  const [categories] = useState(["Fiction", "Non-fiction", "Sci-fi", "Fantasy", "Biography"]);
  const [years] = useState(["2024", "2023", "2022", "2021", "2020", "Before 2020"]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  // Explicitly type the ref as an HTMLDivElement or null
  const dropdownRef = useRef<any>(null);

  const filteredSuggestions = suggestions.filter((item) => {
    const categoryMatch = selectedCategory ? item.toLowerCase().includes(selectedCategory.toLowerCase()) : true;
    const yearMatch = selectedYear ? item.includes(selectedYear) : true;
    return categoryMatch && yearMatch;
  });

  const handleClickOutside = (e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef?.current?.contains(e.target as Node)) {
      setIsFocused(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Make your API call here with the selectedCategory, selectedYear, and any input query
    // console.log("Searching with filters:", {
    //   category: selectedCategory,
    //   year: selectedYear,
    //   query: filteredSuggestions,
    // });
    router.push(`/collections?search=${search}&category=${selectedCategory}&year=${selectedYear}`);
  };

  return (
    <div className="flex items-center flex-col w-full max-w-lg mx-auto">
      <div className="relative w-full">
        <Search
          className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          placeholder="Search your book here..."
          className="rounded-full h-10 px-5 w-full transition-all duration-300 focus:h-12 ring-1 ring-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
          onFocus={() => setIsFocused(true)}
          onChange={(e) => {
            const query = e.target.value.toLowerCase();
            setSearch(query);
            setSuggestions([
              "Harry Potter",
              "The Great Gatsby",
              "1984",
              "Moby Dick",
              "Pride and Prejudice",
            ].filter((item) => item.toLowerCase().includes(query)));
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setIsFocused(false);
              router.push(`/collections?search=${search}`);
            }
          }}
          value={search}
        />

        {isFocused && (
          <form
            ref={dropdownRef}
            onSubmit={handleSubmit}
            className="absolute top-full mt-2 w-full bg-white shadow-lg rounded-lg z-50 grid grid-cols-1 md:grid-cols-2 divide-x divide-gray-200"
          >
            {/* Left Column: Suggestions */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-700 mb-2">Suggestions</h3>
              {filteredSuggestions.length > 0 ? (
                filteredSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onMouseDown={() => {
                      setIsFocused(false);
                      setSuggestions([]);
                      setSearch(suggestion);
                      router.push(`/collections?search=${encodeURIComponent(suggestion)}`);
                    }}
                  >
                    {suggestion}
                  </div>
                ))
              ) : (
                <div className="text-gray-500">No suggestions found</div>
              )}
            </div>

            {/* Right Column: Advanced Search */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-700 mb-2">Advanced Search</h3>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-gray-300"
              >
                <option value="">All Categories</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-gray-300"
              >
                <option value="">All Years</option>
                {years.map((year, index) => (
                  <option key={index} value={year}>
                    {year}
                  </option>
                ))}
              </select>

              {/* Search Button */}
              {(selectedCategory || selectedYear) && (
                <Button
                  type="submit"
                  className="w-full mt-4"
                >
                  Search
                </Button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

const NotificationComponent = () => {
  const [notifications, setNotifications] = useState<Notification[]>()
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  
  // Fetch Notifications
  useEffect(() => {
    async function loadNotifications() {
      setLoading(true);
      try {
        const userIDFromLocal: string = localStorage.getItem("userId") ?? '';
        const data = await fetchNotificationsByUserId(userIDFromLocal);
        setNotifications(data);
        setError('');
      } catch (err) {
        setError(`Failed to load books: ${err}`);
      } finally {
        setLoading(false);
      }
    }

    loadNotifications();
  }, []);

  if (!notifications) {
    return <></>
  }

  if (loading) {
    return <div className="loading"></div>;
  }

  if (error) {
    return <div className="error"></div>;
  }
  return(
    <NavigationMenuList className="mr-5 gap-4 flex items-center">
      <NavigationMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
              {notifications?.filter(n => !n.read).length > 0 && (
                <span className="absolute -top-2 right-3 w-5 h-5 rounded-full bg-[#E02954] text-primary-foreground text-xs flex items-center justify-center">
                  {notifications?.filter(n => !n.read).length}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications?.filter(n => !n.read).map(( notification: Notification ) => (
              <DropdownMenuItem key={notification.id} asChild>
                <Link href="/settings/notifications">
                  <span className="w-full text-center cursor-pointer">{notification.title}</span>
                </Link>
              </DropdownMenuItem>
            ))}
            {notifications?.filter(n => !n.read).length <= 0 && (
              <DropdownMenuItem asChild>
                <span className="w-full text-center cursor-pointer">Kosong</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings/notifications">
                <span className="w-full text-center cursor-pointer">See All</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </NavigationMenuItem>
    </NavigationMenuList>
  )
}

import { fetchUserById } from "@/lib/api/users";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<{ name: string; role: string } | null>(null);

  const onLogout = () => {
    deleteToken();
    toast.success("Logged out successfully");
    router.push("/");
  };

  useEffect(() => {
    const fetchData = async () => {
      const verify = verifyToken();
      setIsLoggedIn(verify);
  
      if (verify) {
        try {
          const userId = localStorage.getItem("userId");
          if (!userId) {
            throw new Error("User ID tidak ditemukan di localStorage");
          }
  
          const data = await fetchUserById(userId);
          setUserData({ name: data.name, role: data.role });
        } catch (error) {
          console.error("Error fetching user data:", error);
          toast.error("Gagal memuat data pengguna");
        }
      }
    };
  
    fetchData();
  }, []);

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
              {isLoggedIn ? <span className="text-sm font-regular uppercase">| {userData?.role}</span> : null}
            </Link>

            {pathname !== '/collections' && (
              <Button
                className='text-muted-foreground hidden md:flex'
                variant='ghost'
                onClick={(e) => { e.preventDefault(); window.location.href = '/collections'; }}
              >
                Collections
              </Button>
            )}
          </div>
          <div className="flex items-center w-full max-w-lg gap-4">
            <SearchBar />
            { isLoggedIn && <Cart /> }
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

                  <NotificationComponent/>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Avatar className="cursor-pointer">
                        <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${userData?.name}`} alt={userData?.name} />
                        <AvatarFallback>{userData?.name}</AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/settings/account" className="flex items-center cursor-pointer">
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
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
                      </DropdownMenuItem>
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
                <Button variant={'outline'}>
                  <Link href="/login">Log in</Link>
                </Button>
                <Button>
                  <Link href="/register">Sign Up</Link>
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
            <SearchBar />
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
