import { User } from "@/types/interfaces";

/**
 * Mengambil semua data pengguna berdasarkan peran (opsional).
 *
 * @param {string} [role] - Peran pengguna yang ingin diambil (opsional). 
 *                          Jika tidak disertakan, semua pengguna akan diambil.
 * @returns {Promise<any>} Data semua pengguna yang sesuai dengan filter peran (jika disediakan).
 * @throws {Error} Jika permintaan gagal atau respons tidak OK.
 *
 * Contoh permintaan (request):
 * GET http://localhost:8080/api/users?role=admin
 *
 * Contoh respons (response):
 * [
 *   {
 *     "id": "1",
 *     "name": "John Doe",
 *     "email": "johndoe@admin.com",
 *     "phone": "08123456789",
 *     "role": "admin"
 *   },
 *   {
 *     "id": "2",
 *     "name": "Jane Doe",
 *     "email": "janedoe@admin.com",
 *     "phone": "08123456788",
 *     "role": "admin"
 *   }
 * ]
 *
 * Jika peran tidak disertakan:
 * GET http://localhost:8080/api/users
 *
 * Contoh respons tanpa filter peran:
 * [
 *   {
 *     "id": "1",
 *     "name": "John Doe",
 *     "email": "johndoe@admin.com",
 *     "phone": "08123456789",
 *     "role": "admin"
 *   },
 *   {
 *     "id": "3",
 *     "name": "Alice Smith",
 *     "email": "alicesmith@student.com",
 *     "phone": "08123456787",
 *     "role": "student"
 *   }
 * ]
 */
export async function fetchAllUsers(role?:string){
    var url = `${process.env.API_BASE_URL_PRODUCTION}/users`;
    if (role) {
        url = `${process.env.API_BASE_URL_PRODUCTION}/users?role=${role}`;
    }
    const response = await fetch(url, {
        method: 'GET',
    });
    const responseBody = await response.json();
    if (!response.ok) {
        throw new Error(responseBody.message || "Gagal mengambil data users");
    }
    return responseBody;
}

/**
 * Mengambil detail user berdasarkan ID-nya.
 *
 * @param {string} id - ID unik dari user yang ingin diambil.
 * @returns {Promise<any>} Detail dari user yang diminta.
 * @throws {Error} Jika permintaan gagal atau respons tidak OK.
 *
 * Request example: http://localhost:8080/api/users/1
 *
 * Response example:
 * {
 *   "email": "admin@admin.com",
 *   "name": "admin",
 *   "phone": "08123456789",
 *   "role": "admin"
 * }
 */
export async function fetchUserById(id: string) {
    const response = await fetch(`${process.env.API_BASE_URL_PRODUCTION}/users/${id}`, {
        method: 'GET',
    });
    const responseBody = await response.json();
    if (!response.ok) {
        throw new Error(responseBody.message || "Gagal mengambil data user berdasarkan ID");
    }
    return responseBody;
}

/**
 * Memperbarui data pengguna berdasarkan ID.
 *
 * @param {string} id - ID unik dari pengguna yang ingin diperbarui.
 * @param {User} data - Objek yang berisi data pengguna baru untuk menggantikan data lama.
 * @returns {Promise<any>} Data pengguna yang diperbarui dari respons API.
 * @throws {Error} Jika permintaan gagal atau respons tidak berhasil (status bukan 2xx).
 *
 * Contoh permintaan (request):
 * PUT http://localhost:8080/api/users/1
 * Body:
 * {
 *   "name": "admin",
 *   "email": "admin@admin.com",
 *   "phone": "08123456789",
 *   "role": "admin"
 *   "nim": "",
 *   "nip": "",
 *   "year": "",
 * }
 *
 * Contoh respons (response):
 * {
 *   "id": "1",
 *   "name": "admin",
 *   "email": "admin@admin.com",
 *   "phone": "08123456789",
 *   "role": "admin"
 * }
 */
export async function updateUserById(id: string, data: User) {
    console.log(id, data)
    const response = await fetch(`${process.env.API_BASE_URL_PRODUCTION}/users/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    const responseBody = await response.json();
    if (!response.ok) {
        throw new Error(responseBody.message || "Gagal memperbarui data pengguna");
    }
    return responseBody;
}

/**
 * Mendaftarkan mahasiswa baru.
 *
 * @param {User} data - Objek yang berisi data mahasiswa baru yang akan didaftarkan.
 * @returns {Promise<any>} Data mahasiswa yang baru terdaftar.
 * @throws {Error} Jika permintaan gagal atau respons tidak OK.
 *
 * Contoh permintaan (request):
 * POST http://localhost:8080/api/users/register/student
 * Body:
 * {
 *   "name": "John Doe",
 *   "nim": "12345",
 *   "year": "2023",
 *   "phone": "08123456789",
 *   "email": "johndoe@example.com",
 *   "password": "password123"
 * }
 *
 * Contoh respons (response):
 * {
 *   "id": "1",
 *   "name": "John Doe",
 *   "nim": "12345",
 *   "year": "2023",
 *   "email": "johndoe@example.com",
 *   "phone": "08123456789",
 *   "role": "student"
 * }
 */
export async function registerStudent(data: User) {
    const response = await fetch(`${process.env.API_BASE_URL_PRODUCTION}/users/register/student`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    const responseBody = await response.json();
    if (!response.ok) {
        throw new Error(responseBody.message || "Gagal mendaftarkan mahasiswa");
    }
    return responseBody;
}

/**
 * Mendaftarkan dosen baru.
 *
 * @param {User} data - Objek yang berisi data dosen baru yang akan didaftarkan.
 * @returns {Promise<any>} Data dosen yang baru terdaftar.
 * @throws {Error} Jika permintaan gagal atau respons tidak OK.
 *
 * Contoh permintaan (request):
 * POST http://localhost:8080/api/users/register/lecturer
 * Body:
 * {
 *   "name": "Dr. Jane Smith",
 *   "nip": "98765",
 *   "phone": "08123456789",
 *   "email": "janesmith@university.edu",
 *   "password": "password123"
 * }
 *
 * Contoh respons (response):
 * {
 *   "id": "2",
 *   "name": "Dr. Jane Smith",
 *   "nip": "98765",
 *   "email": "janesmith@university.edu",
 *   "phone": "08123456789",
 *   "role": "lecturer"
 * }
 */
export async function registerLecturer(data: User) {
    const response = await fetch(`${process.env.API_BASE_URL_PRODUCTION}/users/register/lecturer`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    const responseBody = await response.json();
    if (!response.ok) {
        throw new Error(responseBody.message || "Gagal mendaftarkan dosen");
    }
    return responseBody;
}

/**
 * Mendaftarkan admin baru.
 *
 * @param {User} data - Objek yang berisi data admin baru yang akan didaftarkan.
 * @returns {Promise<any>} Data admin yang baru terdaftar.
 * @throws {Error} Jika permintaan gagal atau respons tidak OK.
 *
 * Contoh permintaan (request):
 * POST http://localhost:8080/api/users/register/admin
 * Body:
 * {
 *   "name": "John Doe",
 *   "email": "johndoe@admin.com",
 *   "phone": "08123456789",
 *   "password": "password123"
 * }
 *
 * Contoh respons (response):
 * {
 *   "id": "1",
 *   "name": "John Doe",
 *   "email": "johndoe@admin.com",
 *   "phone": "08123456789",
 *   "role": "admin"
 * }
 */
export async function registerAdmin(data: User) {
    const response = await fetch(`${process.env.API_BASE_URL_PRODUCTION}/users/register/admin`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    const responseBody = await response.json();
    if (!response.ok) {
        throw new Error(responseBody.message || "Gagal mendaftarkan admin");
    }
    return responseBody;
}

/**
 * Menghapus pengguna berdasarkan ID.
 *
 * @param {string} id - ID pengguna yang akan dihapus.
 * @returns {Promise<any>} Data pengguna yang telah dihapus.
 * @throws {Error} Jika permintaan gagal atau respons tidak OK.
 *
 * Contoh permintaan (request):
 * DELETE http://localhost:8080/api/users/1
 *
 * Contoh respons (response):
 * {
 *   "message": "User has been deleted successfully."
 * }
 */
export async function deleteUserById(id: string) {
    const response = await fetch(`${process.env.API_BASE_URL_PRODUCTION}/users/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const responseBody = await response.json();
    if (!response.ok) {
        throw new Error(responseBody.message || "Gagal menghapus data pengguna");
    }
    return responseBody;
}