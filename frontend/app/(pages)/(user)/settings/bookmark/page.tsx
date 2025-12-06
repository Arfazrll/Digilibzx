"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { Bookmark } from "lucide-react"

interface Book {
  id: string
  title: string
  author: string
  image: string
  category: string
  year: number
  quota: number
  dateAdded?: string
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Book[]>([]);
  const [selectedBookmarks, setSelectedBookmarks] = useState<Book[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedBookmarks = localStorage.getItem("bookmarkedBooks");
      if (storedBookmarks) {
        setBookmarks(JSON.parse(storedBookmarks));
      }
    }
  }, []);
  
  const toggleBookmarkSelection = (book: Book) => {
    setSelectedBookmarks(prev => 
      prev.includes(book)
        ? prev.filter(books => books !== book)
        : [...prev, book]
    );
  }

  const removeSelectedBookmarks = () => {
    setBookmarks(prev => {
      const updatedBookmarks = prev.filter(book => !selectedBookmarks.includes(book));
      localStorage.setItem("bookmarkedBooks", JSON.stringify(updatedBookmarks));
      return updatedBookmarks;
    });
    toast.success(
      <div className="flex items-center">
        <Bookmark className="w-8 h-8 mr-2" />
        Unbookmarked!
      </div>
    );
  }
  

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Bookmarked Books</h1>
        <Button
          variant="destructive"
          onClick={removeSelectedBookmarks}
          disabled={selectedBookmarks.length === 0}
        >
          Remove Selected
        </Button>
      </div>
      
      {/* Grid for displaying bookmarks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookmarks.length === 0 ? (
          <p className="text-center text-muted-foreground mx-auto w-full">You haven't bookmarked any books yet.</p>
        ) : (
          bookmarks.map((bookmark) => (
            <Card key={bookmark.id} className="flex flex-col">
              <CardContent className="flex-grow p-4">
                <div className="flex items-start space-x-4">
                  <Checkbox
                    checked={selectedBookmarks.includes(bookmark)}
                    onCheckedChange={() => toggleBookmarkSelection(bookmark)}
                  />
                  <img
                    src={bookmark.image}
                    alt={bookmark.title}
                    width={80}
                    height={120}
                    className="object-cover"
                  />
                  <div>
                    <h3 className="font-semibold">{bookmark.title}</h3>
                    <p className="text-sm text-muted-foreground">{bookmark.author}</p>
                    <p className="text-xs text-muted-foreground mt-2">{bookmark.category} • {bookmark.year}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Added on {bookmark.dateAdded}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Link href={`/collections/book/${bookmark.id}`} className="w-full">
                  <Button variant="outline" className="w-full">View Book</Button>
                </Link>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
