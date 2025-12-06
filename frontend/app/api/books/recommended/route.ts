import { NextResponse } from 'next/server';
import { books } from '@/app/api/books/data';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const maxParam = searchParams.get('max');
    const max = maxParam ? parseInt(maxParam, 10) : 4; // Default max = 4

    // Validasi input
    if (isNaN(max) || max <= 0) {
        return NextResponse.json({ error: "Invalid 'max' parameter" }, { status: 400 });
    }

    // Ambil sejumlah buku acak hingga jumlah maksimum
    const shuffledBooks = books.sort(() => Math.random() - 0.5);
    const limitedBooks = shuffledBooks.slice(0, max);

    return NextResponse.json(limitedBooks);
}
