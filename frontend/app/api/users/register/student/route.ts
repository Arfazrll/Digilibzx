import { NextResponse } from "next/server";
import { users } from "@/app/api/users/data";

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: "user";
}

const generateUniqueId = () => Math.random().toString(36).substring(2, 15);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validasi field wajib
    if (!body.name || !body.email || !body.password || !body.nim || !body.year) {
      return NextResponse.json(
        { error: "Field name, email, password, nim, dan year wajib diisi" },
        { status: 400 }
      );
    }

    // Cek duplikasi email
    const existingUser = users.find((user) => user.email === body.email);
    if (existingUser) {
      return NextResponse.json(
        { error: "Email sudah terdaftar" },
        { status: 409 }
      );
    }

    // Buat user baru
    const newUser: User = {
      id: generateUniqueId(),
      name: body.name,
      email: body.email,
      password: body.password,
      phone: body.phone || "",
      role: "user",
    };

    users.push(newUser);

    return NextResponse.json(
      { message: "User berhasil terdaftar", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during user registration:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat registrasi User" },
      { status: 500 }
    );
  }
}
