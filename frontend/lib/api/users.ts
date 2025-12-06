import { User } from "@/types/interfaces";

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

export async function registerUser(data: User) {
    const response = await fetch(`${process.env.API_BASE_URL_PRODUCTION}/users/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    const responseBody = await response.json();
    if (!response.ok) {
        throw new Error(responseBody.message || "Gagal mendaftarkan user");
    }
    return responseBody;
}

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