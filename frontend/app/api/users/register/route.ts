import { NextResponse } from "next/server";
import { users } from "@/app/api/users/data";

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  phone?: string; // Opsional
  role: "admin" | "student" | "lecturer";
  nim?: string;
  nip?: string;
  year?: string;
}

const generateUniqueId = () => Math.random().toString(36).substring(2, 15);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || !body.email || !body.password || !body.role) {
      return NextResponse.json(
        { error: "Semua field wajib diisi (name, email, password, role)" },
        { status: 400 }
      );
    }

    const existingUser = users.find((user) => user.email === body.email);
    if (existingUser) {
      return NextResponse.json(
        { error: "Email sudah terdaftar" },
        { status: 409 }
      );
    }

    const newUser: User = {
      id: generateUniqueId(),
      name: body.name,
      email: body.email,
      password: body.password,
      phone: body.phone || "",
      role: body.role,
      nim: body.nim || "",
      nip: body.nip || "",
      year: body.year || "",
    };

    users.push(newUser);

    return NextResponse.json(
      { message: "User berhasil terdaftar", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during user registration:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat registrasi" },
      { status: 500 }
    );
  }
}
