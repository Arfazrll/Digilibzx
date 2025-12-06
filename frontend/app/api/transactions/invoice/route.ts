import { NextResponse } from 'next/server';
import { transactions } from '@/app/api/transactions/data';
import { Transaction } from '@/types/interfaces';

export async function GET(req: Request) {
    const url = new URL(req.url);
    const invoiceCode = url.searchParams.get('invoiceCode');

    // Validasi jika invoiceCode tidak ada atau kosong
    if (!invoiceCode) {
        return NextResponse.json(
            { error: 'Invoice code is required' },
            { status: 400 } // Bad Request
        );
    }

    const invoiceResult = transactions.filter((invoiceItem: Transaction) =>
        invoiceItem.invoiceCode.toLowerCase().includes(invoiceCode.toLowerCase())
    );

    return NextResponse.json(invoiceResult[0]);
}