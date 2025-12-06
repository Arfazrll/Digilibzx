import { NextResponse } from 'next/server';
import { notifs } from '@/app/api/notifications/data';
import { Notification } from '@/types/interfaces';

export async function GET(req: Request) {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');

    // Validasi jika userId tidak ada atau kosong
    if (!userId) {
        return NextResponse.json(
            { error: 'User ID is required' },
            { status: 400 } // Bad Request
        );
    }

    const notifUser = notifs.filter((notif: Notification) =>
        notif.userId.toLowerCase().includes(userId.toLowerCase())
    );

    return NextResponse.json(notifUser);
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id } = body;

        if (!id) {
            return NextResponse.json(
                { error: 'ID notifikasi diperlukan' },
                { status: 400 }
            );
        }

        // Cari notifikasi berdasarkan ID
        const notifIndex = notifs.findIndex((notif: Notification) => notif.id === id);

        if (notifIndex === -1) {
            return NextResponse.json(
                { error: 'Notifikasi tidak ditemukan' },
                { status: 404 }
            );
        }

        // Update status `read` menjadi `true`
        notifs[notifIndex].read = true;

        return NextResponse.json(
            {
                message: 'Status notifikasi berhasil diperbarui',
                notification: notifs[notifIndex],
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: 'Terjadi kesalahan saat memproses permintaan' },
            { status: 500 }
        );
    }
}