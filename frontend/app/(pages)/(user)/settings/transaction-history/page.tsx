"use client";

import { useState, useEffect } from "react";
import { fetchTransactions } from "@/lib/api/transactions";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { Transaction } from "@/types/interfaces";
import React from "react";
import InvoiceComponent from "@/components/user-page/borrow/invoice";
import { Badge } from "@/components/ui/badge";

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [type, setType] = useState<"all" | "borrow" | "return">("all");
    const [status, setStatus] = useState<"all" | "pending" | "approved" | "declined" | "overdue">("all");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedRow, setExpandedRow] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            const userId = localStorage.getItem("userId") || "";
            const data = await fetchTransactions({
                search: search,
                type: type,
                status: status,
                userId: userId,
            });
            setTransactions(data);
        } catch (err) {
            console.error("Error fetching transactions:", err);
            setError("Failed to fetch transactions.");
        } finally {
            setLoading(false);
        }
    };

    const toggleRow = (id: string) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    useEffect(() => {
        fetchData();
    }, [search, type, status]);

    return (
        <div className="flex flex-col h-full">
            <div className="space-y-6 mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Riwayat Transaksi</h1>
                    <p className="text-muted-foreground mt-2">Lihat semua transaksi peminjaman dan pengembalian Anda</p>
                </div>
                <div className="flex flex-row justify-center items-end gap-4">
                    <div className="flex-1">
                        <Label htmlFor="search">Search</Label>
                        <Input
                            id="search"
                            placeholder="Cari berdasarkan invoice atau buku"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="type">Tipe</Label>
                        <Select value={type} onValueChange={(value: "all" | "borrow" | "return") => setType(value)}>
                            <SelectTrigger id="type" className="w-[180px]">
                                <SelectValue placeholder="Pilih tipe" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua</SelectItem>
                                <SelectItem value="borrow">Peminjaman</SelectItem>
                                <SelectItem value="return">Pengembalian</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="status">Status</Label>
                        <Select value={status} onValueChange={(value: "all" | "pending" | "approved" | "declined" | "overdue") => setStatus(value)}>
                            <SelectTrigger id="status" className="w-[180px]">
                                <SelectValue placeholder="Pilih status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="declined">Declined</SelectItem>
                                <SelectItem value="overdue">Overdue</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
            <div className="flex-grow overflow-auto border rounded-md">
                {loading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loader2 className="animate-spin h-8 w-8" />
                    </div>
                ) : error ? (
                    <div className="text-center text-red-500">{error}</div>
                ) : transactions.length === 0 ? (
                    <div className="text-center text-muted-foreground p-8">Belum ada transaksi</div>
                ) : (
                    <Table>
                        <TableCaption>Daftar semua transaksi Anda</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Invoice</TableHead>
                                <TableHead>Tanggal</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Tipe</TableHead>
                                <TableHead>Pembayaran</TableHead>
                                <TableHead>Detail</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.map((transaction) => (
                                <React.Fragment key={transaction.id}>
                                    <TableRow>
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
                                            <p>{new Date(transaction.dateRange.from).toLocaleDateString("id-ID")}</p>
                                            <p className="text-sm text-muted-foreground">
                                                s/d {new Date(transaction.dateRange.to).toLocaleDateString("id-ID")}
                                            </p>
                                        </TableCell>
                                        <TableCell>
                                            <p className="font-medium">
                                                Rp{transaction.totalFee.toLocaleString("id-ID")}
                                            </p>
                                        </TableCell>
                                        <TableCell>
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${
                                                    transaction.status.toLowerCase() === "approved"
                                                        ? "bg-green-100 text-green-800"
                                                        : transaction.status.toLowerCase() === "pending"
                                                        ? "bg-yellow-100 text-yellow-800"
                                                        : transaction.status.toLowerCase() === "declined"
                                                        ? "bg-red-100 text-red-800"
                                                        : "bg-orange-100 text-orange-800"
                                                }`}
                                            >
                                                {transaction.status.toLowerCase()}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            {transaction.type.toLowerCase() === "borrow" ? (
                                                <Badge variant="destructive">Pinjam</Badge>
                                            ) : (
                                                <Badge variant="secondary">Kembali</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="capitalize">{transaction.paymentMethod}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => toggleRow(transaction.id)}
                                            >
                                                {expandedRow === transaction.id ? <ChevronUp /> : <ChevronDown />}
                                            </Button>
                                        </TableCell>
                                    </TableRow>

                                    {expandedRow === transaction.id && (
                                        <TableRow className="bg-muted/50">
                                            <TableCell colSpan={7}>
                                                <div className="p-4">
                                                    <h4 className="font-semibold mb-3">Buku yang Dipinjam:</h4>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        {transaction.items.map((item) => (
                                                            <div key={item.id} className="flex items-center gap-3 p-3 border rounded bg-white">
                                                                <img
                                                                    src={item.image}
                                                                    alt={item.title}
                                                                    className="w-12 h-12 object-cover rounded"
                                                                />
                                                                <div>
                                                                    <p className="font-medium">{item.title}</p>
                                                                    <p className="text-sm text-muted-foreground">{item.author}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </React.Fragment>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    );
}