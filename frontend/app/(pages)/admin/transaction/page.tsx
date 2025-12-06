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
import { ChevronDown, ChevronUp, Loader2, Download } from 'lucide-react';
import { Transaction } from "@/types/interfaces";
import React from "react";
import InvoiceComponent from "@/components/user-page/borrow/invoice";
import { Badge } from "@/components/ui/badge";

export default function AdminTransactionsPage() {
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
            const data = await fetchTransactions({
                search: search,
                type: type,
                status: status,
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

    const exportToCSV = () => {
        const headers = ["Invoice", "User", "Email", "Date From", "Date To", "Total Fee", "Status", "Type", "Payment"];
        const rows = transactions.map(t => [
            t.invoiceCode,
            t.user.name,
            t.user.email,
            new Date(t.dateRange.from).toLocaleDateString("id-ID"),
            new Date(t.dateRange.to).toLocaleDateString("id-ID"),
            t.totalFee,
            t.status,
            t.type,
            t.paymentMethod
        ]);
        
        const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    useEffect(() => {
        fetchData();
    }, [search, type, status]);

    const stats = {
        total: transactions.length,
        pending: transactions.filter(t => t.status.toLowerCase() === "pending").length,
        approved: transactions.filter(t => t.status.toLowerCase() === "approved").length,
        declined: transactions.filter(t => t.status.toLowerCase() === "declined").length,
        overdue: transactions.filter(t => t.status.toLowerCase() === "overdue").length,
        totalRevenue: transactions
            .filter(t => t.status.toLowerCase() === "approved")
            .reduce((sum, t) => sum + t.totalFee, 0),
    };

    return (
        <div className="flex flex-col h-full">
            <div className="space-y-6 mb-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Riwayat Transaksi</h1>
                        <p className="text-muted-foreground mt-2">Lihat semua transaksi peminjaman dan pengembalian</p>
                    </div>
                    <Button onClick={exportToCSV} variant="outline" className="gap-2">
                        <Download className="h-4 w-4" />
                        Export CSV
                    </Button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    <div className="p-4 border rounded-lg bg-slate-50">
                        <p className="text-sm text-muted-foreground">Total Transaksi</p>
                        <p className="text-2xl font-bold">{stats.total}</p>
                    </div>
                    <div className="p-4 border rounded-lg bg-yellow-50">
                        <p className="text-sm text-muted-foreground">Pending</p>
                        <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                    </div>
                    <div className="p-4 border rounded-lg bg-green-50">
                        <p className="text-sm text-muted-foreground">Approved</p>
                        <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                    </div>
                    <div className="p-4 border rounded-lg bg-red-50">
                        <p className="text-sm text-muted-foreground">Declined</p>
                        <p className="text-2xl font-bold text-red-600">{stats.declined}</p>
                    </div>
                    <div className="p-4 border rounded-lg bg-orange-50">
                        <p className="text-sm text-muted-foreground">Overdue</p>
                        <p className="text-2xl font-bold text-orange-600">{stats.overdue}</p>
                    </div>
                    <div className="p-4 border rounded-lg bg-blue-50">
                        <p className="text-sm text-muted-foreground">Total Revenue</p>
                        <p className="text-xl font-bold text-blue-600">Rp{stats.totalRevenue.toLocaleString("id-ID")}</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-row justify-center items-end gap-4">
                    <div className="flex-1">
                        <Label htmlFor="search">Search</Label>
                        <Input
                            id="search"
                            placeholder="Cari berdasarkan invoice, nama user, atau buku"
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
                    <div className="text-center text-muted-foreground p-8">Tidak ada transaksi</div>
                ) : (
                    <Table>
                        <TableCaption>Total: {transactions.length} transaksi</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Invoice</TableHead>
                                <TableHead>User</TableHead>
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
                                            <div className="flex flex-col">
                                                <span className="font-medium">{transaction.user.name}</span>
                                                <span className="text-xs text-muted-foreground">{transaction.user.email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <p className="text-sm">{new Date(transaction.dateRange.from).toLocaleDateString("id-ID")}</p>
                                            <p className="text-xs text-muted-foreground">
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
                                            <TableCell colSpan={8}>
                                                <div className="p-4">
                                                    <h4 className="font-semibold mb-3">Buku yang Dipinjam:</h4>
                                                    <div className="grid grid-cols-3 gap-3">
                                                        {transaction.items.map((item) => (
                                                            <div key={item.id} className="flex items-center gap-3 p-3 border rounded bg-white">
                                                                <img
                                                                    src={item.image}
                                                                    alt={item.title}
                                                                    className="w-12 h-12 object-cover rounded"
                                                                />
                                                                <div>
                                                                    <p className="font-medium text-sm">{item.title}</p>
                                                                    <p className="text-xs text-muted-foreground">{item.author}</p>
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