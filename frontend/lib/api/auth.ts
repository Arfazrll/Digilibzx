/**
 * Fungsi untuk login user (student atau lecturer).
 *
 * @param {string} email - Email user.
 * @param {string} password - Password user.
 * @returns {Promise<any>} Data user jika login berhasil.
 * @throws {Error} Jika login gagal atau respons tidak OK.
 *
 * Request example: POST http://localhost:8080/api/auth/login
 * Body:
 * {
 *   "email": "example@student.com",
 *   "password": "password123"
 * }
 *
 * Response example:
 * {
 *   "id": "1",
 *   "email": "example@student.com",
 *   "name": "John Doe",
 *   "role": "student",
 *   "token": "jwt-token-here"
 * }
 */
export async function loginUser(email: string, password: string) {
    const response = await fetch(`${process.env.API_BASE_URL_PRODUCTION}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });
    const responseBody = await response.json()
    if (!response.ok) {
        throw new Error(responseBody.error || 'Gagal login user');
    }
    return responseBody;
}

export async function loginUserAdmin(email: string, password: string) {
    const response = await fetch(`${process.env.API_BASE_URL_PRODUCTION}/auth/login/admin`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });
    const responseBody = await response.json()
    if (!response.ok) {
        throw new Error(responseBody.error || 'Gagal login admin');
    }
    return responseBody;
}
