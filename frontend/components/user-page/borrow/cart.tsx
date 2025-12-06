import { useState, useEffect } from "react";
import { toast } from "sonner"
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';

interface CartItem {
  id: string;
  title: string;
  image: string;
  author: string;
}

export function Cart({ isAdd = false, book }: { isAdd?: boolean; book?: CartItem }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const router = useRouter();

  // Function to load items from localStorage
  const refreshData = () => {
    const storedItems = localStorage.getItem("cartItems");
    if (storedItems) {
      setItems(JSON.parse(storedItems));
    }
  };

  // Load items from localStorage on component mount
  useEffect(() => {
    refreshData(); // Only called once when the component mounts
  }, []);

  // Listen for updates to localStorage
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "cartItems") {
        refreshData();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Function to handle adding a book to the cart
  const handleAddToCart = () => {
    if (book) {
      const storedItems = localStorage.getItem("cartItems");
      const cartItems: CartItem[] = storedItems ? JSON.parse(storedItems) : [];

      const isAlreadyInCart = cartItems.some((item) => item.id === book.id);
      if (!isAlreadyInCart) {
        const newItem = {
          id: book.id,
          title: book.title,
          image: book.image,
          author: book.author,
        };
        const updatedItems = [...cartItems, newItem];
        localStorage.setItem("cartItems", JSON.stringify(updatedItems));
        setItems(updatedItems); // Update state directly to reflect changes immediately
        toast.success(`"${book.title}" added to the cart!`);
      } else {
        toast.warning(`"${book.title}" is already in the cart!`);
      }
    }
  };

  // Function to handle removing an item
  const handleRemove = (id: string) => {
    const storedItems = localStorage.getItem("cartItems");
    const cartItems: CartItem[] = storedItems ? JSON.parse(storedItems) : [];

    const updatedItems = cartItems.filter((item) => item.id !== id);
    localStorage.setItem("cartItems", JSON.stringify(updatedItems));
    setItems(updatedItems); // Update state directly
  };

  // Function to handle checkout
  const handleCheckout = () => {
    toast("Proceeding to checkout");
    router.push(`/borrow`);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        {!isAdd ? (
          <Button variant="outline" size="icon" className="relative" onClick={refreshData}>
            <ShoppingCart className="w-4 h-4" />
            {items.length > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#E02954] text-primary-foreground text-xs flex items-center justify-center">
                {items.length}
              </span>
            )}
          </Button>
        ) : (
          <Button size="lg" onClick={handleAddToCart}>
            Borrow Book
          </Button>
        )}
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Borrowing Cart ({items.length})</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-8rem)] mt-4">
          {items.length > 0 ? (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 py-4">
                <div className="relative w-16 h-24">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="object-cover rounded"
                  />
                </div>
                <Link href={"/collections/book/"+item.id} className="flex-1">
                  <h4 className="font-medium line-clamp-2">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.author}</p>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleRemove(item.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground">
              Your cart is empty.
            </p>
          )}
        </ScrollArea>
        <div className="absolute bottom-0 left-0 w-full p-4 bg-background border-t">
          <Button
            className="w-full"
            disabled={items.length === 0}
            onClick={handleCheckout}
          >
            Proceed to Checkout
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
