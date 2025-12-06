import { NextResponse } from 'next/server';
import { books } from '../data';
import { CreateUpdateBook } from '@/types/interfaces';
 
export async function GET(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    const book = books.find((book) => book.id === id);

    if (book) {
        return NextResponse.json(book);
    } else {
        return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const body: Partial<CreateUpdateBook> = await req.json();

        const bookIndex = books.findIndex((book) => book.id === id);

        if (bookIndex === -1) {
            return NextResponse.json({ error: 'Book not found' }, { status: 404 });
        }

        // Update hanya field yang disediakan dalam body
        const updatedBook = {
            ...books[bookIndex],
            ...body,
            id: books[bookIndex].id, // Pastikan ID tetap
        };

        books[bookIndex] = updatedBook;

        return NextResponse.json(updatedBook);
    } catch (error) {
        console.error('Error updating book:', error);
        return NextResponse.json(
            { error: 'Failed to update the book. Please try again.' },
            { status: 500 }
        );
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        const bookIndex = books.findIndex((book) => book.id === id);

        if (bookIndex === -1) {
            return NextResponse.json({ error: 'Book not found' }, { status: 404 });
        }

        // Hapus buku dari koleksi
        const deletedBook = books.splice(bookIndex, 1)[0];

        return NextResponse.json(deletedBook);
    } catch (error) {
        console.error('Error deleting book:', error);
        return NextResponse.json(
            { error: 'Failed to delete the book. Please try again.' },
            { status: 500 }
        );
    }
}