import { NextResponse } from 'next/server';
import { transactions } from '@/app/api/transactions/data';
import { newTransaction, Transaction } from '@/types/interfaces';

export async function GET(req: Request) {
    const url = new URL(req.url);
    const search = url.searchParams.get('search') || "";
    const status = url.searchParams.get('status') || "";
    const type = url.searchParams.get('type') || "";
    const userId = url.searchParams.get('userId') || "";

    const filteredTransactions = transactions.filter((transaction: Transaction) => {
        const matchesSearch =
            search === "all" ||
            !search ||
            transaction.invoiceCode.toLowerCase().includes(search.toLowerCase()) ||
            transaction.user.name.toLowerCase().includes(search.toLowerCase());

        const matchesStatus =
            status === "all" ||
            !status ||
            transaction.status.toLowerCase() === status.toLowerCase();

        const matchesType =
            type === "all" ||
            !type ||
            transaction.type.toLowerCase() === type.toLowerCase();

        const matchesUser =
            userId === "all" ||
            !userId ||
            transaction.user.id.toLowerCase() === userId.toLowerCase();

        return matchesSearch && matchesStatus && matchesType && matchesUser;
    });

    return NextResponse.json(filteredTransactions);
}

let currentInvoiceNumber = 1; // Simpan ini di database untuk persisten

function generateInvoiceCodeSequential() {
    const prefix = 'INV-';
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const invoiceNumber = String(currentInvoiceNumber).padStart(4, '0'); // Tambahkan 0 di depan jika perlu
    
    currentInvoiceNumber++; // Increment setelah kode dibuat
    return `${prefix}${datePart}-${invoiceNumber}`;
}

export async function POST(req: Request) {    
    try {
        const body: newTransaction = await req.json(); // Parse body dari request
        // Validasi field wajib
        const requiredFields: (keyof newTransaction)[] = [
            'userId',
            'totalFee',
            'paymentMethod',
            'paymentEvidence',
            'items',
            'dateFrom',
            'dateTo',
        ];

        const missingFields = requiredFields.filter((field) => body[field] == null || body[field] === "");
        if (missingFields.length > 0) {
            return NextResponse.json(
                { error: `Field(s) ${missingFields.join(', ')} are required.` },
                { status: 400 }
            );
        }

        // Membuat transaksi baru berdasarkan interface
        const newTransactions: Transaction = {
            id: crypto.randomUUID(),
            invoiceCode: generateInvoiceCodeSequential(),
            dateRange: {
                from: body.dateFrom,
                to: body.dateTo
            },
            status: 'pending',
            type: 'borrow',
            user: {
                id: body.userId,
                email: '',
                name: '',
                phone: '',
                role: ''
            },
            totalFee: body.totalFee,
            paymentMethod: body.paymentMethod,
            paymentEvidence: body.paymentEvidence,
            items: body.items
        };

        // Menambahkan buku baru ke koleksi
        transactions.push(newTransactions);

        return NextResponse.json(newTransactions, { status: 201 });
    } catch (error) {
        console.error('Error handling POST request:', error);
        return NextResponse.json(
            { error: 'Failed to add the book. Please try again.' },
            { status: 500 }
        );
    }
}

export async function PUT(req: Request) {
    try {
        // Parse URL dan parameter dari query string
        const url = new URL(req.url);
        const invoiceCode = url.searchParams.get('invoiceCode');
        const status = url.searchParams.get('status');

        // Validasi parameter wajib
        if (!invoiceCode) {
            return NextResponse.json({ error: 'Invoice code is required' }, { status: 400 });
        }

        if (!status) {
            return NextResponse.json({ error: 'Status is required' }, { status: 400 });
        }

        // Validasi nilai status terhadap union type
        const validStatuses = ["pending", "approved", "declined", "overdue"] as const;
        if (!validStatuses.includes(status as typeof validStatuses[number])) {
            return NextResponse.json(
                { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
                { status: 400 }
            );
        }

        // Cari transaksi berdasarkan invoiceCode
        const transactionIndex = transactions.findIndex(
            (transaction) => transaction.invoiceCode === invoiceCode
        );

        if (transactionIndex === -1) {
            return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
        }

        // Perbarui status transaksi
        transactions[transactionIndex].status = status as "pending" | "approved" | "declined" | "overdue";

        // Kembalikan transaksi yang diperbarui
        return NextResponse.json(transactions[transactionIndex], { status: 200 });
    } catch (error) {
        console.error('Error updating transaction:', error);
        return NextResponse.json(
            { error: 'Failed to update the transaction. Please try again.' },
            { status: 500 }
        );
    }
}

