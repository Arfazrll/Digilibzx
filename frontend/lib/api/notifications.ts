/**
 * Mengambil daftar notifikasi berdasarkan ID pengguna.
 *
 * @param {string} userId - ID pengguna yang notifikasinya ingin diambil.
 * @returns {Promise<Notification[]>} Daftar notifikasi yang sesuai dengan ID pengguna.
 * @throws {Error} Jika permintaan gagal atau respons tidak OK.
 * 
 * Request example: GET http://localhost:8080/api/notifications?userId=1
 * 
 * Response example:
 * [{
 *     "id": "1",
 *     "userId": "1",
 *     "title": "New Book Available",
 *     "message": "The book 'The Midnight Library' by Matt Haig is now available in our library.",
 *     "type": "info",
 *     "date": "Nov 15, 2023 at 9:30 AM",
 *     "read": false
 *   }]
 */
export async function fetchNotificationsByUserId(userId: string) {
    // Bersihkan tanda kutip jika ada
    const sanitizedUserId = userId.replace(/^"|"$/g, "");
    const response = await fetch(`${process.env.API_BASE_URL_PRODUCTION}/notifications?userId=${sanitizedUserId}`, {
        method: 'GET',
    });
    if (!response.ok) {
        throw new Error('Gagal mengambil data notifikasi user');
    }
    return response.json();
}

/**
 * Memperbarui status notifikasi menjadi "read" berdasarkan ID.
 *
 * @param {string} id - ID notifikasi yang akan diperbarui.
 * @returns {Promise<Notification>} Data notifikasi yang telah diperbarui.
 * @throws {Error} Jika permintaan gagal atau respons tidak OK.
 * 
 * Request example: PUT http://localhost:8080/api/notifications
 * Body:
 * {
 *   "id": "1"
 * }
 * 
 * Response example:
 * {
 *   "id": "1",
 *   "userId": "1",
 *   "title": "New Book Available",
 *   "message": "The book 'The Midnight Library' by Matt Haig is now available in our library.",
 *   "type": "info",
 *   "date": "Nov 15, 2023 at 9:30 AM",
 *   "read": true
 * }
 */
export async function updateNotificationsStatusById(id: string) {
    // Bersihkan tanda kutip jika ada
    const sanitizedId = id.replace(/^"|"$/g, "");

    const response = await fetch(`${process.env.API_BASE_URL_PRODUCTION}/notifications?notifId=${sanitizedId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Gagal memperbarui status notifikasi');
    }
    return response.json();
}


