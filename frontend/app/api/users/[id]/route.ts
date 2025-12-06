import { NextResponse } from "next/server";
import { users } from "@/app/api/users/data";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const userId = params.id;

    // Cari user berdasarkan ID
    const user = users.find((u) => u.id === userId);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Hilangkan password dari respon untuk keamanan
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while processing the request" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    const body = await request.json();

    // Cari user berdasarkan ID
    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Validasi data yang dikirim dari body
    const allowedFields = ["name", "email", "password", "phone", "role", "nim", "nip", "year"];
    const hasInvalidFields = Object.keys(body).some(
      (key) => !allowedFields.includes(key)
    );

    if (hasInvalidFields) {
      return NextResponse.json(
        { error: "Invalid fields in request body" },
        { status: 400 }
      );
    }

    // Gantikan data user lama dengan data baru
    const updatedUser = {
      id: users[userIndex].id, // ID tetap sama
      password: users[userIndex].password, // Password tetap tidak berubah
      ...body, // Data baru menggantikan yang lama
    };

    users[userIndex] = updatedUser;

    // Hilangkan password dari respon untuk keamanan
    const { password, ...userWithoutPassword } = updatedUser;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "An error occurred while updating the user" },
      { status: 500 }
    );
  }
}


export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
      const { id } = params;

      const userIndex = users.findIndex((user) => user.id === id);

      if (userIndex === -1) {
          return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // Hapus user
      const deletedUser = users.splice(userIndex, 1)[0];

      return NextResponse.json(deletedUser);
  } catch (error) {
      console.error('Error deleting user:', error);
      return NextResponse.json(
          { error: 'Failed to delete the user. Please try again.' },
          { status: 500 }
      );
  }
}