import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { SimpleBook } from "@/types/interfaces"
import { useEffect, useState } from "react"
import { fetchBooksRecommendation } from "@/lib/api/books"
import LoadingComponent from "../loading"

export function RecomendationBook({ title = "Recommended Books" }) {
  const [books, setBooks] = useState<SimpleBook[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Fetch Books
  useEffect(() => {
      async function loadBooks() {
          setLoading(true);
          try {
              const data = await fetchBooksRecommendation(4);
              setBooks(data);
              setError(''); 
          } catch (err) {
              setError(`Failed to load books: ${err}`);
          } finally {
              setLoading(false); 
          }
      }

      loadBooks();
  }, []);

  if (loading) {
      return <LoadingComponent/>; 
  }

  if (error) {
      return <div className="error">{error}</div>;
  }
  return (
    <div className="w-full mt-10 hidden md:block">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="overflow-x-auto whitespace-nowrap">
        {books.map((book) => (
          <Card key={book.id} className="inline-block overflow-hidden w-[200px] mx-2">
            <div className="relative aspect-[3/4]">
              <img
                src={book.image}
                alt={`${book.title} Cover`}
                className="object-cover"
              />
              {book.quota === 0 && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <p className="text-white text-sm font-bold text-center px-2">
                    Currently Unavailable
                  </p>
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <Link href={`/collections/book/${book.id}`} className="hover:underline">
                <h3 className="font-bold truncate">{book.title}</h3>
              </Link>
              <p className="text-sm text-muted-foreground">{book.author}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between">
              <Badge variant="secondary">{book.category}</Badge>
              <Badge variant="outline">{book.year}</Badge>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
