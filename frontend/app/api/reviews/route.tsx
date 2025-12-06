import { NextResponse } from 'next/server';
import { books } from '../books/data';
import { Review } from '@/types/interfaces';

export async function POST(req: Request) {
    try {
        const { bookId, review }: { bookId: string; review: Omit<Review, 'id' | 'date'> } = await req.json();

        // Validasi input
        if (!bookId || !review || !review.author || !review.rating || !review.content) {
            return NextResponse.json({ error: 'BookId and complete review details are required' }, { status: 400 });
        }

        // Cari buku berdasarkan ID
        const book = books.find((book) => book.id.toLowerCase() === bookId.toLowerCase());

        if (!book) {
            return NextResponse.json({ error: 'Book not found' }, { status: 404 });
        }

        // Buat review baru sesuai interface
        const newReview: Review = {
            id: `${Date.now()}`, // Membuat ID unik
            author: review.author,
            date: new Date().toISOString().split('T')[0], // Format tanggal "YYYY-MM-DD"
            rating: review.rating,
            content: review.content,
        };

        book.reviews = book.reviews || []; // Pastikan reviews tidak undefined
        book.reviews.push(newReview);

        return NextResponse.json({ message: 'Review added successfully', review: newReview });
    } catch (error) {
        console.error('Error handling POST request:', error);
        return NextResponse.json({ error: 'Failed to add review' }, { status: 500 });
    }
}
