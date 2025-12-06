export async function fetchReviewsByBookId(bookId: string) {
    // Bersihkan tanda kutip jika ada
    const sanitizedUserId = bookId.replace(/^"|"$/g, "");
    const response = await fetch(`${process.env.API_BASE_URL_PRODUCTION}/reviews?bookId=${sanitizedUserId}`, {
        method: 'GET',
    });

    if (!response.ok) {
        throw new Error('Gagal mengambil data review buku');
    }
    return response.json();
}

/**
 * Mengirimkan review baru untuk buku.
 *
 * @param {string} bookId - ID buku yang ingin ditambahkan review-nya.
 * @param {object} review - Data review yang akan dikirim.
 * @param {string} review.author - Penulis review.
 * @param {number} review.rating - Rating buku.
 * @param {string} review.content - Isi review.
 * @returns {Promise<any>} Respons dari server setelah review berhasil ditambahkan.
 * @throws {Error} Jika permintaan gagal atau respons tidak OK.
 */
export async function submitReview(bookId: string, review: { author: string; rating: number; content: string }): Promise<any> {
    const sanitizedBookId = bookId.replace(/^"|"$/g, "");

    const response = await fetch(`${process.env.API_BASE_URL_PRODUCTION}/reviews`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            bookId: sanitizedBookId,
            review,
        }),
    });

    if (!response.ok) {
        throw new Error('Gagal mengirim review buku');
    }
    return response.json();
}   