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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { FilePlus2, FilePenLine, Trash2, RefreshCcw } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { CreateUpdateBook } from "@/types/interfaces"
import { fetchBooks, addBook, updateBook, deleteBook } from "@/lib/api/books";
import LoadingComponent from "@/components/loading"

export default function BooksPage() {
    const [books, setBooks] = useState<CreateUpdateBook[]>([]);
    const [filter, setFilter] = useState<"all" | "available" | "borrowed">("all");
    const [search, setSearch] = useState("");
    const [editingBook, setEditingBook] = useState<CreateUpdateBook | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    async function loadBooks() {
        setLoading(true);
        try {
            const data = await fetchBooks();
            setBooks(data);
            setError("");
        } catch (err) {
            setError(`Failed to load books: ${err}`);
        } finally {
            setLoading(false);
        }
    }

    // Fetch Books
    useEffect(() => {
        loadBooks();
    }, []);

    if (loading) {
        return <LoadingComponent description="Tunggu bentar, bukunya lagi diambil dari database..." />;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    const filteredBooks = books.filter((book) => {
        const matchesFilter =
            filter === "all" ||
            (filter === "available" && book.canBorrow) ||
            (filter === "borrowed" && !book.canBorrow);
        const matchesSearch =
            book.title.toLowerCase().includes(search.toLowerCase()) ||
            book.author.toLowerCase().includes(search.toLowerCase()) ||
            book.category.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    // Handle Add Book
    const handleAddBook = async (newBook: Omit<CreateUpdateBook, "id">) => {
        try {
            const addedBook = await addBook(newBook);
            setBooks([...books, addedBook]);
            toast.success("Book Added", {
                description: `${newBook.title} has been added successfully.`,
            });
        } catch (err) {
            toast.error("Failed to add book", { description: `${err}` });
        }
    };

    // Handle Edit Book
    const handleEditBook = async (editedBook: CreateUpdateBook) => {
        try {
            const updatedBook = await updateBook(editedBook.id || "", editedBook);
            setBooks((prevBooks) =>
                prevBooks.map((book) => (book.id === updatedBook.id ? updatedBook : book))
            );
            toast.success("Book Updated", {
                description: `${updatedBook.title} has been updated successfully.`,
            });
        } catch (err) {
            toast.error("Failed to update book", { description: `${err}` });
        }
    };

    // Handle Delete Book
    const handleDeleteBook = async (id: string) => {
        toast.info('Yakin buku ini dihapus?', {
            closeButton: true,
            action: {
                label: 'Delete',
                onClick: async () => {
                    try {
                        await deleteBook(id);
                        setBooks(books.filter((book) => book.id !== id));
                        toast.error("Book Deleted", {
                            description: "The book has been deleted successfully.",
                        });
                    } catch (err) {
                        toast.error("Failed to delete book", { description: `${err}` });
                    }
                },
            },
        });
    };

    return (
        <div className="flex flex-col h-full">
            <div className="space-y-6 mb-6">
                <div className="flex flex-row gap-2">
                    <h1 className="text-3xl font-bold">Books Management</h1>
                    <Button variant="ghost" size="icon" onClick={() => loadBooks()}>
                        <RefreshCcw className="h-4 w-4" />
                    </Button>
                </div>
                <div className="flex flex-row justify-center items-end gap-4">
                    <div className="flex-1">
                        <Label htmlFor="search">Search</Label>
                        <Input
                            id="search"
                            placeholder="Search book here..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="filter">Filter</Label>
                        <Select value={filter} onValueChange={(value: "all" | "available" | "borrowed") => setFilter(value)}>
                            <SelectTrigger id="filter" className="w-[180px]">
                                <SelectValue placeholder="Filter books" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Books</SelectItem>
                                <SelectItem value="available">Available</SelectItem>
                                <SelectItem value="borrowed">Borrowed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button>
                                    <FilePlus2 className="mr-2 h-4 w-4" />
                                    Add Book
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl w-full overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>Add New Book</DialogTitle>
                                </DialogHeader>
                                <ScrollArea className="max-h-[70vh] overflow-y-auto">
                                    <BookForm onSubmit={handleAddBook} />
                                    <ScrollBar />
                                </ScrollArea>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>
            <div className="flex-grow overflow-auto border rounded-md">
                <ScrollArea className="h-full w-full">
                    <div className="w-full min-w-max">
                        <Table>
                            <TableCaption>A list of books in the library.</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[250px]">Title</TableHead>
                                    <TableHead>Author</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Available Copies</TableHead>
                                    <TableHead>Rating</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-center">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredBooks.map((book) => (
                                    <TableRow key={book.id}>
                                        <TableCell className="font-medium">{book.title}</TableCell>
                                        <TableCell>{book.author}</TableCell>
                                        <TableCell>{book.category}</TableCell>
                                        <TableCell>{book.availableCopies} / {book.quota}</TableCell>
                                        <TableCell>{book.rating?.toFixed(1)}</TableCell>
                                        <TableCell>{book.canBorrow ? (
                                            <Badge>Available</Badge>
                                        ) : (
                                            <Badge variant="destructive">Borrowed</Badge>
                                        )}</TableCell>
                                        <TableCell className="text-center">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" onClick={() => setEditingBook(book)}>
                                                        <FilePenLine className="h-4 w-4" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-4xl w-full overflow-y-auto">
                                                    <DialogHeader>
                                                        <DialogTitle>Edit Book</DialogTitle>
                                                    </DialogHeader>
                                                    {editingBook && (
                                                        <ScrollArea className="max-h-[70vh] overflow-y-auto">
                                                            <BookForm book={editingBook} onSubmit={handleEditBook} />
                                                            <ScrollBar />
                                                        </ScrollArea>
                                                    )}
                                                </DialogContent>
                                            </Dialog>
                                            <Button variant="ghost" size="icon" onClick={() => handleDeleteBook(book.id || "")}>
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
            {filteredBooks.length === 0 && (
                <p className="text-center text-muted-foreground mt-4">No books found.</p>
            )}
        </div>
    )
}

interface BookFormProps {
    book?: CreateUpdateBook
    onSubmit: (book: CreateUpdateBook | Omit<CreateUpdateBook, 'id'>) => void
}

function BookForm({ book, onSubmit }: BookFormProps) {
    const [formData, setFormData] = useState<Omit<CreateUpdateBook, "id"> | CreateUpdateBook>({
        title: "",
        author: "",
        category: "",
        year: 2022,
        description: "",
        image: "",
        quota: 1,
        rackNumber: "",
        isbn: "",
        language: "",
        availableCopies: 1,
        lateFee: 1000,
        canBorrow: true,
        rating: 0,
        ...(book || {}),
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "year" || name === "quota" || name === "availableCopies" || name === "lateFee"
                ? parseInt(value, 10) || 0
                : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Kolom 1 */}
            <div className="space-y-4">
                <div>
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
                </div>
                <div className="grid grid-cols-3 gap-3">
                    <div className="md:col-span-2">
                        <Label htmlFor="author">Author</Label>
                        <Input id="author" name="author" value={formData.author} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label htmlFor="year">Year</Label>
                        <Input id="year" name="year" type="number" value={formData.year} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label htmlFor="category">Category</Label>
                        <Input id="category" name="category" value={formData.category} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label htmlFor="quota">Quota</Label>
                        <Input id="quota" name="quota" type="number" value={formData.quota} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label htmlFor="rackNumber">Rack Number</Label>
                        <Input id="rackNumber" name="rackNumber" value={formData.rackNumber} onChange={handleChange} required />
                    </div>
                    <div className="md:col-span-2">
                        <Label htmlFor="isbn">ISBN</Label>
                        <Input id="isbn" name="isbn" value={formData.isbn} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label htmlFor="rating">Rating (0 - 5.0)</Label>
                        <Input id="rating" name="rating" value={formData.rating} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label htmlFor="language">Language</Label>
                        <Input id="language" name="language" value={formData.language} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label htmlFor="availableCopies">Available Copies</Label>
                        <Input
                            id="availableCopies"
                            name="availableCopies"
                            type="number"
                            value={formData.availableCopies}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="lateFee">Late Fee</Label>
                        <Input id="lateFee" name="lateFee" type="number" value={formData.lateFee} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label htmlFor="canBorrow">Can Borrow</Label>
                        <Select
                            name="canBorrow"
                            value={formData.canBorrow.toString()}
                            onValueChange={(value) =>
                                setFormData((prev) => ({ ...prev, canBorrow: value === "true" }))
                            }
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="true">Yes</SelectItem>
                                <SelectItem value="false">No</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Kolom 2 */}
            <div className="space-y-4">
                <div>
                    <Label htmlFor="image">Image URL</Label>
                    <Input id="image" name="image" value={formData.image} onChange={handleChange} required />
                </div>
                {/* Preview Gambar */}
                {formData.image && (
                    <div>
                        <Label>Image Preview</Label>
                        <div className="border rounded-md p-2">
                            <img
                                src={formData.image}
                                alt="Preview"
                                className="max-h-40 mx-auto"
                                onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/150")}
                            />
                        </div>
                    </div>
                )}
                <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        className="h-32"
                    />
                </div>
            </div>

            {/* Kolom 3 */}
            <div className="space-y-4">

            </div>

            {/* Tombol Submit */}
            <Button type="submit" className="md:col-span-2">
                Submit
            </Button>
        </form>
    );
}