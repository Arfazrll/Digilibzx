import { NextResponse } from "next/server";
import { users } from "@/app/api/users/data";

export async function GET(req: Request) {
  try {
    let result;
    let userRole = null;

    if (process.env.NODE_ENV !== 'production') {
      const url = new URL(req.url);
      userRole = url.searchParams.get("userRole");
    }

    // Jika userRole diberikan, cari berdasarkan role
    if (userRole) {
      result = users.filter((u) => u.role === userRole);
    } else {
      // Jika tidak, kembalikan semua pengguna
      result = users;
    }

    // Jika tidak ada hasil ditemukan
    if (result.length === 0) {
      return NextResponse.json(
        { error: userRole ? `No users found with role '${userRole}'` : "No users found" },
        { status: 404 }
      );
    }

    // Hilangkan password dari setiap pengguna untuk keamanan
    // const sanitizedUsers = result.map(({ password, ...userWithoutPassword }) => userWithoutPassword);

    // return NextResponse.json(sanitizedUsers);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in GET /users:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the request" },
      { status: 500 }
    );
  }
}
