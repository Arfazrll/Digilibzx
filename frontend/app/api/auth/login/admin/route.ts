import { NextResponse } from "next/server";
import { users } from "@/app/api/users/data";
import { User } from "@/types/interfaces";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Cari pengguna berdasarkan email dan password
    const user = users.find(
      (u: User) =>
        u.email === email &&
        u.password === password &&
        (u.role === "admin")
    );    

    if (user) {
      // Hilangkan password dari respon untuk keamanan
      const { password, ...userWithoutPassword } = user;

      return NextResponse.json({
        ...userWithoutPassword,
        token: "jwt-token-here", // Contoh token statis
      });
    }

    // Jika tidak ditemukan, kirim status 401 (Unauthorized)
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  } catch (error) {
    // Tangani error lain
    return NextResponse.json(
      { error: "An error occurred while processing the request" },
      { status: 500 }
    );
  }
}
