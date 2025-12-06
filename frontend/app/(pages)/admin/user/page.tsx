"use client"

import { useEffect, useState } from "react"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { FilePlus2, FilePenLine, Trash2, RefreshCcw } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { User } from "@/types/interfaces"
import { deleteUserById, fetchAllUsers, registerAdmin, registerUser, updateUserById } from "@/lib/api/users"
import LoadingComponent from "@/components/loading"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [search, setSearch] = useState("");
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    async function loadUsers() {
        setLoading(true);
        try {
            const data = await fetchAllUsers();
            setUsers(data);
            setError("");
        } catch (err) {
            setError(`Failed to load users: ${err}`);
        } finally {
            setLoading(false);
        }
    }
    
    useEffect(() => {
        loadUsers();
    }, []);

    if (loading) {
        return <LoadingComponent description="Tunggu bentar, data user lagi diambil dari database..."/>;
    }
    if (error) {
        return <div className="error">{error}</div>;
    }
    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            (user.id?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
            (user.name?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
            (user.email?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
            (user.phone?.toLowerCase().includes(search.toLowerCase()) ?? false);
        return matchesSearch;
    });

    const handleAddUser = async (newUser: Omit<User, "id">) => {
        try {
            setLoading(true)
            let addedUser;
            switch (newUser.role) {
                case "user":
                    addedUser = await registerUser(newUser);
                    break;
                case "admin":
                    addedUser = await registerAdmin(newUser);
                    break;
                default:
                    throw new Error("Invalid role specified");
            }

            await loadUsers();

            toast.success("User Added", {
                description: `${newUser.name} has been added successfully as ${newUser.role}.`,
            });
        } catch (err) {
            console.error(err);
            toast.error("Failed to add user", { description: `${err}` });
        } finally {
            setLoading(false);
        }
    };

    const handleEditUser = async (editedUser: User) => {
        try {
            setLoading(true)
            if (!editedUser.id) {
                throw new Error("User ID is missing or invalid");
            }

            const { id, ...rest } = editedUser;

            const sanitizedUser = {
                ...rest,
                phone: editedUser.phone || "",
            };

            const updatedUser = await updateUserById(id, sanitizedUser);

            await loadUsers();

            toast.success("User Updated", {
                description: `${updatedUser.name} has been updated successfully.`,
            });
        } catch (err) {
            console.error("Error updating user:", err);
            toast.error("Failed to update user", { description: `${err}` });
        } finally {
            setLoading(false)
        }
    };

    const handleDeleteUser = async (id: string) => {
        toast.info('Yakin user ini dihapus?', {
            closeButton: true,
            action: {
                label: 'Delete',
                onClick: async () => {
                    try {
                        setLoading(true);
                        await deleteUserById(id);
                        await loadUsers();
                        toast.success("User Deleted", {
                            description: "The User has been deleted successfully.",
                        });
                    } catch (err) {
                        toast.error("Failed to delete user", { description: `${err}` });
                    } finally {
                        setLoading(false);
                    }
                },
            },
        });
    };    

    function truncateText(text: any, maxLength: number) {
        if (text.length > maxLength) {
            return text.slice(0, maxLength) + '...';
        }
        return text;
    }

    return (
        <div className="flex flex-col h-full">
            <div className="space-y-6 mb-6">
                <div className="flex flex-row gap-2">
                    <h1 className="text-3xl font-bold">User Management</h1>
                    <Button variant="ghost" size="icon" onClick={() => loadUsers()}>
                        <RefreshCcw className="h-4 w-4" />
                    </Button>
                </div>
                <div className="flex flex-row justify-center items-end gap-4">
                    <div className="flex-1">
                        <Label htmlFor="search">Search</Label>
                        <Input
                            id="search"
                            placeholder="Search user here..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button>
                                    <FilePlus2 className="mr-2 h-4 w-4" />
                                    Add User
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-xl w-full overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>Add New User</DialogTitle>
                                </DialogHeader>
                                <ScrollArea className="max-h-[70vh] overflow-y-auto">
                                    <UserForm onSubmit={handleAddUser} />
                                    <ScrollBar />
                                </ScrollArea>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
                {["USER", "ADMIN"].map((item) => (  // ✅ Gunakan UPPERCASE
                    <div key={item} className="flex-1 basis-1/2 overflow-auto">
                        <Badge className="uppercase mb-3">{item}</Badge>
                        <div className="border rounded-md">
                            <ScrollArea className="h-full w-full">
                                <div className="w-full min-w-max">
                                    <Table>
                                        <TableCaption>A list of {item.toLowerCase()} in the library.</TableCaption>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[40px]">ID</TableHead>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Email</TableHead>
                                                <TableHead>Phone</TableHead>
                                                <TableHead className="text-center">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredUsers.filter((u) => u.role === item).map((user) => (  // ✅ Sekarang match!
                                                <TableRow key={user.id}>
                                                    <TableCell className="font-medium">{truncateText(user.id, 5)}</TableCell>
                                                    <TableCell>{user.name}</TableCell>
                                                    <TableCell>{user.email}</TableCell>
                                                    <TableCell>{user.phone}</TableCell>
                                                    <TableCell className="text-center">
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button variant="ghost" size="icon" onClick={() => setEditingUser(user)}>
                                                                    <FilePenLine className="h-4 w-4" />
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent className="max-w-xl w-full overflow-y-auto">
                                                                <DialogHeader>
                                                                    <DialogTitle>Edit user [{item.toLowerCase()}]</DialogTitle>
                                                                </DialogHeader>
                                                                {editingUser && (
                                                                    <ScrollArea className="max-h-[70vh] overflow-y-auto">
                                                                        <UserForm user={editingUser} onSubmit={handleEditUser} />
                                                                        <ScrollBar />
                                                                    </ScrollArea>
                                                                )}
                                                            </DialogContent>
                                                        </Dialog>
                                                        <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(user.id || "")}>
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                                <ScrollBar orientation="horizontal" />
                            </ScrollArea>
                        </div>
                    </div>
                ))}
            </div>
            {filteredUsers.length === 0 && (
                <p className="text-center text-muted-foreground mt-4">No user found.</p>
            )}
        </div>
    )
}

interface UserFormProps {
    user?: User
    onSubmit: (user: User | Omit<User, 'id'>) => void
}

function UserForm({ user, onSubmit }: UserFormProps) {
    const [formData, setFormData] = useState<Omit<User, "id"> | User>({
        id: "",
        email: "",
        password: "",
        name: "",
        phone: "",
        role: "user",
        ...(user || {}),
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleTabChange = (selectedTab: string) => {
        setFormData((prevData) => ({
            ...prevData,
            role: selectedTab as "user" | "admin",
        }));
    };

    return (
        <>
            {!user && (
                <Tabs defaultValue="user" className="w-full" onValueChange={handleTabChange}>
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="user">User</TabsTrigger>
                        <TabsTrigger value="admin">Admin</TabsTrigger>
                    </TabsList>
                    <TabsContent value="user">
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 p-2 space-y-4">
                            <div>
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                            </div>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" value={formData.email} onChange={handleChange} required />
                            </div>
                            <div>
                                <Label htmlFor="phone">Phone</Label>
                                <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
                            </div>
                            <div>
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" name="password" value={formData.password} onChange={handleChange} required />
                            </div>
                            <Button type="submit" className="mt-5">Submit</Button>
                        </form>
                    </TabsContent>
                    <TabsContent value="admin">
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 p-2 space-y-4">
                            <div>
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                            </div>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" value={formData.email} onChange={handleChange} required />
                            </div>
                            <div>
                                <Label htmlFor="phone">Phone</Label>
                                <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
                            </div>
                            <div>
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" name="password" value={formData.password} onChange={handleChange} required />
                            </div>
                            <Button type="submit" className="mt-5">Submit</Button>
                        </form>
                    </TabsContent>
                </Tabs>
            )}

            {user && (
                <form onSubmit={handleSubmit} className="grid grid-cols-1 p-2 space-y-4">
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" name="password" value={formData.password} onChange={handleChange} />
                    </div>
                    <Button type="submit" className="mt-5">Submit</Button>
                </form>
            )}
        </>
    );
}