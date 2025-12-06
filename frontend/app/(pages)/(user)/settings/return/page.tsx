"use client";

import { useState, useEffect } from "react";
import { fetchTransactions, fetchUpdateStatusTransaction } from "@/lib/api/transactions";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { ArrowLeftRight, ChevronDown, ChevronUp, Clock, Loader2 } from 'lucide-react';
import { Transaction } from "@/types/interfaces";
import React from "react";
import InvoiceComponent from "@/components/user-page/borrow/invoice";
import { submitReview } from "@/lib/api/reviews";
import { toast } from "sonner";
import { BookReviewForm } from "@/components/user-page/book-review-form";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function ReturnPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedRow, setExpandedRow] = useState<string | null>(null);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [selectedBookId, setSelectedBookId] = useState('');
    const [userId, setUserId] = useState('');

    const handleReviewSubmit = async (review: any) => {
        try {
            await submitReview(selectedBookId, review);
            toast.success("Review berhasil dikirim!");
            setShowReviewForm(false);
        } catch (err) {
            console.error("Failed to submit review:", err);
            toast.error("Gagal mengirim review. Silakan coba lagi.");
        }
    };

    const handleShowReviewForm = (bookId: string) => {
        if (bookId === selectedBookId && showReviewForm) {
            setShowReviewForm(false);
        } else {
            setSelectedBookId(bookId);
            setShowReviewForm(true);
        }
    };

    const fetchData = async (userId: string) => {
        setLoading(true);
        setError(null);

        try {
            const data = await fetchTransactions({
                search: search,
                type: "all",
                status: "all",
                userId: userId,
            });
            setTransactions(data);
        } catch (err) {
            console.error("Error fetching transactions:", err);
            setError("Gagal memuat data transaksi.");
        } finally {
            setLoading(false);
        }
    };

    const toggleRow = (id: string) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    const getDaysRemaining = (dateTo: string) => {
        const today = new Date();
        const endDate = new Date(dateTo);
        const diffTime = endDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    useEffect(() => {
        const userId: string = localStorage.getItem("userId") || "";
        setUserId(userId);
        fetchData(userId);
    }, [search]);

    const filteredTransactions = transactions.filter((transaction) => {
        const isApprovedBorrow = transaction.status.toLowerCase() === "approved" && transaction.type.toLowerCase() === "borrow";
        const isReturn = transaction.type.toLowerCase() === "return";
        return isApprovedBorrow || isReturn;
    });

    return (
        <div className="flex flex-col h-full">
            <div className="space-y-6 mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Pengembalian Buku</h1>
                    <p className="text-muted-foreground mt-2">Kelola pengembalian buku yang Anda pinjam</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg bg-blue-50">
                        <p className="text-sm text-muted-foreground">Sedang Dipinjam</p>
                        <p className="text-2xl font-bold text-blue-600">
                            {transactions.filter(t => t.status.toLowerCase() === "approved" && t.type.toLowerCase() === "borrow").length}
                        </p>
                    </div>
                    <div className="p-4 border rounded-lg bg-yellow-50">
                        <p className="text-sm text-muted-foreground">Menunggu Approval</p>
                        <p className="text-2xl font-bold text-yellow-600">
                            {transactions.filter(t => t.status.toLowerCase() === "pending" && t.type.toLowerCase() === "return").length}
                        </p>
                    </div>
                    <div className="p-4 border rounded-lg bg-green-50">
                        <p className="text-sm text-muted-foreground">Sudah Dikembalikan</p>
                        <p className="text-2xl font-bold text-green-600">
                            {transactions.filter(t => t.status.toLowerCase() === "approved" && t.type.toLowerCase() === "return").length}
                        </p>
                    </div>
                </div>

                <div className="flex-1">
                    <Label htmlFor="search">Cari</Label>
                    <Input
                        id="search"
                        placeholder="Cari berdasarkan invoice atau judul buku"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex-grow overflow-auto border rounded-md">
                {loading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loader2 className="animate-spin h-8 w-8" />
                    </div>
                ) : error ? (
                    <div className="text-center text-red-500">{error}</div>
                ) : filteredTransactions.length === 0 ? (
                    <div className="text-center text-muted-foreground p-8">
                        Tidak ada buku yang perlu dikembalikan
                    </div>
                ) : (
                    <Table>
                        <TableCaption>Daftar buku yang perlu dikembalikan</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Invoice</TableHead>
                                <TableHead>Periode Pinjam</TableHead>
                                <TableHead>Sisa Waktu</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredTransactions.map((transaction) => {
                                const daysRemaining = getDaysRemaining(transaction.dateRange.to);
                                const isOverdue = daysRemaining < 0;

                                return (
                                <React.Fragment key={transaction.id}>
                                    <TableRow className={isOverdue && transaction.type.toLowerCase() === "borrow" ? "bg-red-50" : ""}>
                                        <TableCell>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="link" className="text-blue-500 underline">
                                                        {transaction.invoiceCode}
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-4xl w-full overflow-y-auto">
                                                    <div className="max-h-[70vh] overflow-y-auto">
                                                        <InvoiceComponent invoiceCode={transaction.invoiceCode} />
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </TableCell>
                                        <TableCell>
                                            <p className="text-sm">{new Date(transaction.dateRange.from).toLocaleDateString("id-ID")}</p>
                                            <p className="text-sm text-muted-foreground">
                                                s/d {new Date(transaction.dateRange.to).toLocaleDateString("id-ID")}
                                            </p>
                                        </TableCell>
                                        <TableCell>
                                            {transaction.type.toLowerCase() === "borrow" && (
                                                <div className="flex items-center gap-2">
                                                    <Clock className={`h-4 w-4 ${isOverdue ? "text-red-500" : daysRemaining <= 3 ? "text-yellow-500" : "text-green-500"}`} />
                                                    <span className={`font-medium ${isOverdue ? "text-red-600" : daysRemaining <= 3 ? "text-yellow-600" : ""}`}>
                                                        {isOverdue ? `Terlambat ${Math.abs(daysRemaining)} hari` : `${daysRemaining} hari lagi`}
                                                    </span>
                                                </div>
                                            )}
                                            {transaction.type.toLowerCase() === "return" && (
                                                <span className="text-sm text-muted-foreground">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <p className="font-medium">
                                                Rp{transaction.totalFee.toLocaleString("id-ID")}
                                            </p>
                                        </TableCell>
                                        <TableCell>
                                            {transaction.type.toLowerCase() === "borrow" ? (
                                                <Badge variant="destructive">Sedang Dipinjam</Badge>
                                            ) : transaction.status.toLowerCase() === "pending" ? (
                                                <Badge variant="secondary">Menunggu Approval</Badge>
                                            ) : (
                                                <Badge variant="default">Sudah Dikembalikan</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => toggleRow(transaction.id)}
                                                >
                                                    {expandedRow === transaction.id ? <ChevronUp /> : <ChevronDown />}
                                                </Button>
                                                {(transaction.type.toLowerCase() === "borrow" && transaction.status.toLowerCase() === "approved") && (
                                                    <Button 
                                                        size="sm"
                                                        className="gap-2"
                                                        onClick={async () => {
                                                            try {
                                                                await fetchUpdateStatusTransaction(transaction.invoiceCode, "pending", "return");
                                                                toast.success(`Permintaan pengembalian untuk ${transaction.invoiceCode} berhasil dikirim`);
                                                                await fetchData(userId);
                                                            } catch (err) {
                                                                console.error("Failed to update status:", err);
                                                                toast.error("Gagal mengirim permintaan. Silakan coba lagi.");
                                                            }
                                                        }}
                                                    >
                                                        <ArrowLeftRight className="h-4 w-4"/>
                                                        Kembalikan
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>

                                    {expandedRow === transaction.id && (
                                        <TableRow className="bg-muted/50">
                                            <TableCell colSpan={6}>
                                                <div className="p-4">
                                                    <h4 className="font-semibold mb-3">Buku yang Dipinjam:</h4>
                                                    <div className="grid grid-cols-1 gap-3">
                                                        {transaction.items.map((item) => (
                                                            <div key={item.id} className="flex flex-col p-3 border rounded bg-white">
                                                                <div className="flex items-center gap-4">
                                                                    <img
                                                                        src={item.image}
                                                                        alt={item.title}
                                                                        className="w-16 h-20 object-cover rounded"
                                                                    />
                                                                    <div className="flex-1">
                                                                        <p className="font-medium text-lg">{item.title}</p>
                                                                        <p className="text-sm text-muted-foreground">oleh {item.author}</p>
                                                                    </div>
                                                                    {(transaction.status.toLowerCase() === "approved" && transaction.type.toLowerCase() === "return") && (
                                                                        <Button
                                                                            onClick={() => handleShowReviewForm(item.id)}
                                                                            variant="outline"
                                                                            className="px-4"
                                                                        >
                                                                            Tulis Review
                                                                        </Button>
                                                                    )}
                                                                </div>
                                                                {showReviewForm && selectedBookId === item.id && (
                                                                    <div className="mt-4">
                                                                        <Separator className="mb-4" />
                                                                        <BookReviewForm
                                                                            bookId={selectedBookId}
                                                                            onSubmit={(reviewData) => {
                                                                                handleReviewSubmit(reviewData);
                                                                            }}
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </React.Fragment>
                            )})}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    );
}