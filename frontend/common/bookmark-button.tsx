'use client'
import Link from "next/link";
import { toast } from "sonner";
import React, { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";

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

const BookmarkButton = ({ book, customClass, mark }: { book: Book; customClass?: string, mark?: string }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedBookmarks = JSON.parse(localStorage.getItem("bookmarkedBooks") || "[]");
      const isBookAlreadyBookmarked = storedBookmarks.some((storedBook: Book) => storedBook.id === book.id);
      setIsBookmarked(isBookAlreadyBookmarked);
    }
  }, [book]);  

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    const storedBookmarks = JSON.parse(localStorage.getItem("bookmarkedBooks") || "[]");

    if (!isBookmarked) {
      const dateNow = new Date().toLocaleDateString('en-US');
      book.dateAdded = dateNow;
      const updatedBookmarks = [...storedBookmarks, book];
      localStorage.setItem("bookmarkedBooks", JSON.stringify(updatedBookmarks));
      toast.success(
        <div className="flex items-center">
          <Bookmark className="w-8 h-8 mr-2" fill="currentColor" />
          <span>
            {book.title} has been{" "}
            <Link href="/settings/bookmark" className="underline">
              bookmarked!
            </Link>
          </span>
        </div>
      );
    } else {
      const updatedBookmarks = storedBookmarks.filter((books: Book) => books.id !== book.id);
      localStorage.setItem("bookmarkedBooks", JSON.stringify(updatedBookmarks));
      toast.success(
        <div className="flex items-center">
          <Bookmark className="w-8 h-8 mr-2" />
          <span>
            {book.title} has been{" "}
            <Link href="/settings/bookmark" className="underline">
              unbookmarked!
            </Link>
          </span>
        </div>
      );
    }
  };

  return (
    <Button
      className="bg-white border shadow p-2 hover:bg-gray-100 transition flex items-center"
      onClick={handleBookmark}
    >
      <Bookmark
        className="w-6 h-6 text-gray-500"
        fill={isBookmarked ? "currentColor" : "none"}
      />
      {mark && isBookmarked && (
        <span className="text-sm text-gray-500 font-bold hidden sm:flex">{mark}</span>
      )}
    </Button>
  );
};

export default BookmarkButton;