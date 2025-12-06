import { NextResponse } from 'next/server'
import { books } from '@/app/api/books/data'
import { SimpleBook, CreateUpdateBook } from '@/types/interfaces';

export async function GET(req: Request) {
    const url = new URL(req.url);
    const search = url.searchParams.get('search') || "";
    const category = url.searchParams.get('category') || "";
    const years = url.searchParams.get('years') || "";

    const filteredBooks = books.filter((book: SimpleBook) => {
        const matchesSearch =
            search === "" ||
            book.title.toLowerCase().includes(search.toLowerCase()) ||
            book.author.toLowerCase().includes(search.toLowerCase());

        const matchesCategory =
            category === "" || book.category.toLowerCase() === category.toLowerCase();

        const matchesYear = years === "" || book.year.toString() === years;

        return matchesSearch && matchesCategory && matchesYear;
    });

    return NextResponse.json(filteredBooks);
}

export async function POST(req: Request) {
    try {
        const body: CreateUpdateBook = await req.json(); // Parse body dari request
        // Validasi field wajib
        const requiredFields: (keyof CreateUpdateBook)[] = [
            'title', 'author', 'category', 'year', 'description',
            'image', 'quota', 'rackNumber', 'isbn', 'language',
            'availableCopies', 'lateFee', 'canBorrow'
        ];

        const missingFields = requiredFields.filter((field) => body[field] == null || body[field] === "");
        if (missingFields.length > 0) {
            return NextResponse.json(
                { error: `Field(s) ${missingFields.join(', ')} are required.` },
                { status: 400 }
            );
        }

        // Membuat buku baru berdasarkan interface
        const newBook = {
            ...body,
            id: crypto.randomUUID(),
            rating: body.rating ?? 0, // Berikan default nilai 0 untuk rating jika undefined
            reviews: [], // Tambahkan nilai default untuk reviews
        };

        // Menambahkan buku baru ke koleksi
        books.push(newBook);

        return NextResponse.json(newBook, { status: 201 });
    } catch (error) {
        console.error('Error handling POST request:', error);
        return NextResponse.json(
            { error: 'Failed to add the book. Please try again.' },
            { status: 500 }
        );
    }
}