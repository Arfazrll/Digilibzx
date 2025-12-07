'use client'
import Link from "next/link";
import { Badge } from "../ui/badge";
import Image from "next/image"
import BookmarkButton from "@/common/bookmark-button";
import { ShareDrawer } from "./share-drawer";
import { verifyToken } from "@/common/tokenizer";
import { useEffect, useState } from 'react';
import { fetchBooks } from '@/lib/api';
import { SimpleBook } from "@/types/interfaces";
import LoadingComponent from "../loading";

export default function BookCollection({ search = "", category = "", years = "" }) {
    const [books, setBooks] = useState<SimpleBook[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    // Fetch Books
    useEffect(() => {
        async function loadBooks() {
            setLoading(true);
            try {
                const data = await fetchBooks({
                    search, category, years
                });
                setBooks(data);
                setError(''); 
            } catch (err) {
                setError(`Failed to load books: ${err}`);
            } finally {
                setLoading(false); 
            }
        }

        loadBooks();
    }, [search, category, years]);

    if (loading) {
        return <LoadingComponent description="Tunggu bentar, bukunya lagi diambil dari database..."/>
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <>
            <div className="flex mb-5">
                <h2 className="text-lg text-gray-700">
                    Menampilkan hasil untuk {" "}
                    {search || category || years
                        ? `${search ? `"${search}"` : ""}${category ? `kategori "${category}"` : ""
                        }${years ? `tahun ${years}` : ""}`
                        : "semua buku"}
                </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6">
                {books.length > 0 ? (
                    books.map((book) => (
                        <div
                            key={book.id}
                            className="relative bg-white shadow-md rounded-lg overflow-hidden max-w-sm hover:shadow-lg hover:-translate-y-1 transition duration-300"
                        >
                            {/* Book Image */}
                            <div className="relative group">
                                <div className="absolute top-2 right-2 flex flex-col gap-2 z-10">
                                    {verifyToken() && <BookmarkButton book={book} />}
                                    <ShareDrawer
                                        title={book.title}
                                        url={typeof window !== 'undefined' ? window.location.href+"/book/"+book.id : ''}
                                    />
                                </div>


                                {/* Book Image */}
                                <img
                                    src={book.image}
                                    alt={`${book.title} Cover`}
                                    className="w-full h-48 md:h-96 object-cover group-hover:opacity-90 transition duration-300"
                                />

                                {/* Year Badge */}
                                <Link href={`/collections?year=${book.year}`}>
                                    <Badge className="absolute bottom-10 left-2" variant="secondary">
                                        {book.year}
                                    </Badge>
                                </Link>

                                {/* Category Badge */}
                                <Link href={`/collections?category=${book.category}`}>
                                    <Badge className="absolute bottom-2 left-2">
                                        {book.category}
                                    </Badge>
                                </Link>

                                {/* Overlay for Out of Quota */}
                                {!book.canBorrow && (
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center backdrop-blur-sm">
                                        <p className="text-white text-lg font-bold">
                                            Unavailable
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Card Content */}
                            <div className="p-4">
                                <Link href={`/collections/book/${book.id}`}>
                                    {/* Title */}
                                    <h2 className="text-lg font-bold text-gray-900 truncate hover:underline transition duration-300">
                                        {book.title}
                                    </h2>
                                    {/* Author */}
                                    <p className="text-sm text-gray-600 mt-1">by {book.author}</p>
                                    {/* Description */}
                                    <p className="text-sm text-gray-600 mt-3 line-clamp-3">{book.description}</p>
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-center col-span-full">
                        <Image src="/assets/dino.png" alt="dino" width={50} height={50} className="mx-auto mt-10 mb-3" />
                        No books match your criteria.
                    </p>
                )}

                {books.length > 0 && (
                    <p className="text-gray-500 text-center col-span-full text-sm">
                        <Image src="/assets/dino.png" alt="dino" width={40} height={40} className="mx-auto mt-10 mb-3" />
                        "Roar! That’s all, folks.<br />I ate the rest of the data... NyamNyam!🍴"
                    </p>
                )}
            </div>
        </>
    );
}