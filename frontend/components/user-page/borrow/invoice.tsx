'use client'

import { useEffect, useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { FileText, Loader2, Mail, Phone } from 'lucide-react'
import { toast } from 'sonner'
import { fetchTransactionsByInvoiceId } from '@/lib/api/transactions'
import { Transaction } from '@/types/interfaces'
import LoadingComponent from '@/components/loading'
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Link from 'next/link'

export default function InvoiceComponent({ invoiceCode = "" }) {
    const [invoice, setInvoice] = useState<Transaction>()
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [totalAmount, setTotalAmount] = useState(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const invoiceRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await fetchTransactionsByInvoiceId(invoiceCode);

                setTotalAmount(data.items.reduce((sum: any, item: { lateFee: any }) => sum + item.lateFee, 0));
                setInvoice(data);
                setLoading(false);
            } catch (error) {
                setError(`Failed to load invoice: ${error}`);
                console.error("Error fetching Invoice:", error);
                toast.error("Gagal memuat data invoice");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleDownloadPDF = async () => {
        if (!invoiceRef.current) return;
        console.log("ter-click")

        try {
            const canvas = await html2canvas(invoiceRef.current);
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [canvas.width, canvas.height],
            });

            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save(`Invoice_${invoiceCode}.pdf`);
        } catch (error) {
            console.error('Failed to generate PDF:', error);
            toast.error("Gagal mengunduh PDF");
        }
    };

    if (loading) {
        return <LoadingComponent description="Bentarr... Invoicenya lagi di bikinin!"/>
    }
    
    if (!invoice) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p>No invoice data available | #{invoiceCode} not found</p>
            </div>
        );
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="container mx-auto p-4 space-y-8" ref={invoiceRef}>
            <Card className="w-full max-w-4xl mx-auto">
                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-6">
                    <div>
                        <CardTitle className="text-3xl font-bold">Invoice</CardTitle>
                        <CardDescription>Invoice details and payment information</CardDescription>
                    </div>
                    <Badge
                        variant={
                            invoice.status === "approved"
                                ? "default"
                                : invoice.status === "overdue"
                                ? "destructive"
                                : invoice.status === "pending"
                                ? "outline"
                                : "secondary"
                        }
                        className="text-sm px-3 py-1"
                    >
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)} | {invoice.type}
                    </Badge>

                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">Invoice Number</p>
                            <p className="text-lg font-semibold">{invoice.invoiceCode}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">Date Range</p>
                            <p className="text-lg font-semibold">
                                {new Date(invoice.dateRange.from).toLocaleDateString()} - {new Date(invoice.dateRange.to).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">Total Fee</p>
                            <p className="text-lg font-semibold">Rp{invoice.totalFee.toLocaleString()}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">Payment Method</p>
                            <p className="text-lg font-semibold capitalize">{invoice.paymentMethod}</p>
                        </div>
                    </div>

                    <Separator />

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Invoice Items</h3>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Item</TableHead>
                                    <TableHead>Author</TableHead>
                                    <TableHead>Image</TableHead>
                                    <TableHead className="text-right">Fee</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {invoice.items.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">{item.title}</TableCell>
                                        <TableCell>{item.author}</TableCell>
                                        <TableCell>
                                            <img src={item.image} alt={item.title} className="w-16 h-24 object-cover rounded-md" />
                                        </TableCell>
                                        <TableCell className="text-right">Rp{item.lateFee?.toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                                <TableRow>
                                    <TableCell colSpan={3} className="font-bold">Total</TableCell>
                                    <TableCell className="text-right font-bold">Rp{totalAmount.toLocaleString()}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>

                    <Separator />

                    <div>
                        <h3 className="text-lg font-semibold mb-4">User Information</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-center space-x-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span>{invoice.user.email}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span>{invoice.user.phone}</span>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Payment Evidence</h3>
                        <div className="bg-muted p-4 rounded-lg">
                            <div className="flex items-center space-x-2">
                                <FileText className="h-5 w-5 text-muted-foreground" />
                                <a 
                                    href={invoice.paymentEvidence} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-primary hover:underline"
                                >
                                    View Payment Evidence
                                </a>
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={handleDownloadPDF}>
                        Download Invoice
                    </Button>
                    <Button asChild>
                        <Link href="https://wa.me/6281511463282">
                            Contact Admin
                        </Link>
                    </Button>
                </CardFooter>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Invoice Processing</DialogTitle>
                        <DialogDescription>
                            <div className="flex items-center space-x-2 text-muted-foreground">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Your invoice is still being processed. Please check back later.</span>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}