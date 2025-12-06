import { User } from "@/types/interfaces";

export const users: User[] = [
  {
    id: "1",
    email: "admin@admin.com",
    password: "admin123",
    name: "admin",
    phone: "08123456789",
    role: "admin",
  },
  {
    id: "2",
    email: "user@example.com",
    password: "user12345",
    name: "John Doe",
    phone: "08123456",
    role: "user",
  },
  {
    id: "3",
    email: "user2@example.com",
    password: "user12345",
    name: "Jane Smith",
    phone: "08123457",
    role: "user",
  },
];