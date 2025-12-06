/**
 * Mengambil daftar buku berdasarkan parameter query yang diberikan.
 *
 * @param {Record<string, any>} payload - Parameter query untuk permintaan {search, category, years}.
 * @returns {Promise<any>} Daftar buku yang sesuai dengan parameter query.
 * @throws {Error} Jika permintaan gagal atau respons tidak OK.
 * 
 * Request example: http://localhost:8080/api/books?search="Dunia Sophie"&category="fiksi"&years=1991
 * 
 * Response example:
 [{
    "id": "1",
    "title": "Dunia Sophie",
    "author": "Jostein Gaarder",
    "category": "Fiksi",
    "year": 1991,
    "description": "Buku yang mengulas sejarah filsafat dalam bentuk cerita.",
    "image": "https://example.com/dunia-sophie.jpg",
    "quota": 5
  }]
 */
export async function fetchBooks(payload?: Record<string, any>) {
    const queryString = new URLSearchParams(payload).toString();

    const response = await fetch(`${process.env.API_BASE_URL_PRODUCTION}/books?${queryString}`, {
        method: 'GET',
    });

    if (!response.ok) {
        throw new Error('Gagal mengambil data buku');
    }
    return response.json();
}

/**
 * Mengambil detail sebuah buku berdasarkan ID-nya.
 *
 * @param {string} id - ID unik dari buku yang ingin diambil.
 * @returns {Promise<any>} Detail dari buku yang diminta.
 * @throws {Error} Jika permintaan gagal atau respons tidak OK.
 * 
 * Request example: http://localhost:8080/api/books/1
 * 
 * Response example
 {
  "id": "1",
  "title": "Dunia Sophie",
  "author": "Jostein Gaarder",
  "category": "Fiksi",
  "year": 1991,
  "description": "Buku yang mengulas sejarah filsafat dalam bentuk cerita.",
  "image": "https://example.com/dunia-sophie.jpg",
  "quota": 5,
  "rackNumber": "A1",
  "mainSubject": "Filsafat",
  "isbn": "978-0-14-044913-6",
  "language": "Indonesia",
  "availableCopies": 2,
  "lateFee": 1000,
  "canBorrow": true,
  "rating": 4.5,
  "reviews": [{
      "id": "r1",
      "author": "John Doe",
      "date": "2023-01-01",
      "rating": 5,
      "content": "Buku yang sangat menginspirasi!"
    }]
 }
 */
export async function fetchBookById(id: string) {
    const response = await fetch(`${process.env.API_BASE_URL_PRODUCTION}/books/${id}`, {
        method: 'GET',
    });

    if (!response.ok) {
        throw new Error('Gagal mengambil data buku berdasarkan ID');
    }
    return response.json();
}

/**
 * Mengambil rekomendasi buku dengan jumlah maksimum yang ditentukan.
 *
 * @param {number} max - Jumlah maksimum buku rekomendasi yang diambil.
 * @returns {Promise<any>} Daftar buku rekomendasi.
 * @throws {Error} Jika permintaan gagal atau respons tidak OK.
 * 
 * Request example: http://localhost:8080/api/books/recommended?max=4
 * 
 * Response example
 [{
    "id": "1",
    "title": "Dunia Sophie",
    "author": "Jostein Gaarder",
    "category": "Fiksi",
    "year": 1991,
    "description": "Buku yang mengulas sejarah filsafat dalam bentuk cerita.",
    "image": "https://example.com/dunia-sophie.jpg",
    "quota": 5
  }]
 */
export async function fetchBooksRecommendation(max: number) {
    const response = await fetch(`${process.env.API_BASE_URL_PRODUCTION}/books/recommended?max=${max}`, {
        method: 'GET',
    });

    if (!response.ok) {
        throw new Error('Gagal mengambil rekomendasi buku');
    }
    return response.json();
}

/**
 * Menambahkan buku baru.
 *
 * @param {Book} book - Data buku yang akan ditambahkan.
 * @returns {Promise<any>} Respons dari server setelah menambahkan buku.
 * @throws {Error} Jika permintaan gagal atau respons tidak OK.
 *
 * Request example: http://localhost:8080/api/books
 */
import { CreateUpdateBook } from "@/types/interfaces"
export async function addBook(book: CreateUpdateBook) {
    // console.log(book);
    const response = await fetch(`${process.env.API_BASE_URL_PRODUCTION}/books`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(book),
    });

    if (!response.ok) {
        throw new Error('Gagal menambahkan buku baru');
    }
    return response.json();
}

/**
 * Memperbarui buku berdasarkan ID.
 *
 * @param {string} id - ID buku yang akan diperbarui.
 * @param {Book} updatedBook - Data buku yang diperbarui.
 * @returns {Promise<any>} Respons dari server setelah memperbarui buku.
 * @throws {Error} Jika permintaan gagal atau respons tidak OK.
 *
 * Request example: http://localhost:8080/api/books/:id
 */
export async function updateBook(id: string, updatedBook: CreateUpdateBook) {
    const response = await fetch(`${process.env.API_BASE_URL_PRODUCTION}/books/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedBook),
    });

    if (!response.ok) {
        throw new Error('Gagal memperbarui buku');
    }
    return response.json();
}

/**
 * Menghapus buku berdasarkan ID.
 *
 * @param {string} id - ID buku yang akan dihapus.
 * @returns {Promise<void>} Tidak mengembalikan data jika berhasil.
 * @throws {Error} Jika permintaan gagal atau respons tidak OK.
 *
 * Request example: http://localhost:8080/api/books/:id
 */
export async function deleteBook(id: string): Promise<void> {
    const response = await fetch(`${process.env.API_BASE_URL_PRODUCTION}/books/${id}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error('Gagal menghapus buku');
    }
}



