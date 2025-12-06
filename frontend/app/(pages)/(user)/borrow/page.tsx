'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Trash2, AlertCircle, CopyIcon } from 'lucide-react'
import { toast } from 'sonner'
import DateRangePicker from "@/components/ui/date-range-picker"
import { DateRange } from 'react-day-picker'
import { useAuthGuard } from '@/common/tokenizer'
import { newTransaction } from '@/types/interfaces'
import { fetchPostTransaction } from '@/lib/api/transactions'
import LoadingComponent from '@/components/loading'

interface CartItem {
    id: string;
    title: string;
    image: string;
    author: string;
}

export default function CheckoutPage() {
    const [items, setItems] = useState<CartItem[]>([]);
    const [dateRange, setDateRange] = useState<DateRange | undefined>(); // State untuk menyimpan tanggal peminjaman
    const [paymentMethod, setPaymentMethod] = useState('bank');
    const [paymentEvidence, setPaymentEvidence] = useState('');
    const [isCopied, setIsCopied] = useState(false);

    const serviceFee = 1000;
    const totalFee = items.length * serviceFee;

    const bankAccount = {
        'norek': '901556823268',
        'nama': 'Gagas Surya Laksana'
    };

    const refreshData = () => {
        const storedItems = localStorage.getItem("cartItems");
        if (storedItems) {
            setItems(JSON.parse(storedItems));
        }
    };

    useEffect(() => {
        refreshData(); // Called once when the component mounts
    }, []);

    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === "cartItems") {
                refreshData();
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    const handleRemove = (id: string) => {
        const updatedItems = items.filter((item) => item.id !== id);
        localStorage.setItem("cartItems", JSON.stringify(updatedItems));
        setItems(updatedItems);
    };

    const copyAccountNumber = () => {
        navigator.clipboard.writeText(bankAccount.norek);
        toast.success("Nomor rekening tersalin!");
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleSubmit = async () => {
        if (!dateRange || !dateRange.from || !dateRange.to) {
            toast.error("Pilih tanggal peminjaman yang valid!");
            return;
        }

        if(paymentEvidence == ''){
            toast.error("Bukti pembayaran harus ada!");
            return;
        }

        if(items.length == 0){
            toast.error("Tambahkan buku!");
            return;
        }

        const payload: newTransaction = {
            userId: localStorage.getItem("userId") || "",
            items,
            totalFee,
            paymentMethod,
            paymentEvidence,
            dateFrom: dateRange.from.toISOString(),
            dateTo: dateRange.to.toISOString(),
        };

        try {
            const response = await fetchPostTransaction(payload)
            if (!response.ok) {
                toast.success("Checkout successful!");
            } else {
                toast.error("Checkout failed!");
            }
            localStorage.removeItem("cartItems");
            window.location.href = `/borrow/${response.data}`;
        } catch (error) {
            toast.error("An error occurred during checkout!");
        }
    };

    const { isLoading } = useAuthGuard();
    if (isLoading) {
        return (
        <div className="flex items-center justify-center h-screen">
            <LoadingComponent/>
        </div>
        );
    }

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6">Checkout</h1>
            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Borrow Summary</CardTitle>
                        <CardDescription>Review your library items</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4">
                            {items.map((item) => (
                                <li key={item.id} className="flex justify-between items-center">
                                    <div className="flex items-center space-x-4">
                                        <img src={item.image} alt={item.title} width={80} height={100} className="object-cover" />
                                        <div>
                                            <a href={`/collections/book/${item.id}`}>
                                                <p className="font-semibold">{item.title}</p>
                                            </a>
                                            <p className="text-sm text-gray-500">{item.author}</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => handleRemove(item.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                    <Separator className="my-4" />
                    <CardFooter className="justify-between">
                        <span className="font-semibold">Service Fee (per book)</span>
                        <span className="font-semibold">Rp{serviceFee.toFixed(2)}</span>
                    </CardFooter>
                    <CardFooter className="justify-between">
                        <span className="font-semibold">Total</span>
                        <span className="font-semibold">Rp{totalFee.toFixed(2)}</span>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Payment Details</CardTitle>
                        <CardDescription>Complete your payment securely</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form>
                            <div className="grid gap-4">
                                {/* <RadioGroup
                                    defaultValue="bank"
                                    className="grid grid-cols-2 gap-4"
                                    onValueChange={(value) => setPaymentMethod(value)}
                                >
                                    <div className="flex items-center">
                                        <RadioGroupItem value="bank" id="bank" className="peer sr-only" />
                                        <Label
                                            htmlFor="bank"
                                            className="flex flex-1 flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:bg-accent [&:has([data-state=checked])]:bg-accent font-bold"
                                        >
                                            Bank Transfer
                                        </Label>
                                    </div>
                                    <div className="flex items-center">
                                        <RadioGroupItem value="qris" id="qris" className="peer sr-only" />
                                        <Label
                                            htmlFor="qris"
                                            className="flex flex-1 flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:bg-accent [&:has([data-state=checked])]:bg-accent"
                                        >
                                            <img src='https://upload.wikimedia.org/wikipedia/commons/e/e1/QRIS_logo.svg' alt="QRIS Code" width={130} height={130} />
                                        </Label>
                                    </div>
                                </RadioGroup> */}

                                {paymentMethod === 'bank' && (
                                    <div className="border p-4 rounded-md mb-4">
                                        <div className="flex items-center">
                                            <span className="font-bold">Bank Name: </span>
                                            <span className="ml-2">Bank Seabank</span>
                                            <img
                                                src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhOFnkSwf9r1o1QuR-QMW-ra_Gcx_0ZDtLl-rQnhXfaqDMN82MQBBR_36Tvuw8qTk_Aih5kb-9j5YUfwb5NOZYe5Aj2jx2VPi0gy1nSJBbBwtceUOPRB0rKKQ2rSFGzDhYGTM_NPOJsXDdnck3GT2kTVfCQgwdHvQFdNKE_dUT5xFIeZO-Awlbx9mNQBg/w295-h320/Sea%20Bank%20Logomark.png" // Replace with actual path to logo
                                                alt="Bank Logo"
                                                className="w-6 h-6 ml-2"
                                            />
                                        </div>

                                        {/* Account Number with Copy Function */}
                                        <div className="mt-2 flex items-center">
                                            <span className="font-bold">Account Number: </span>
                                            <span className="ml-2">{bankAccount.norek}</span>
                                            <button
                                                onClick={copyAccountNumber}
                                                className="ml-2 flex items-center text-sm transition"
                                                type="button"
                                            >
                                                <CopyIcon className="w-4 h-4 mr-1" />
                                                {isCopied ? 'Copied!' : 'Copy'}
                                            </button>
                                        </div>

                                        {/* Account Holder Name */}
                                        <div className="mt-2">
                                            <span className="font-bold">Account Name: </span>
                                            <span>{bankAccount.nama}</span>
                                        </div>
                                        <div className="flex items-start space-x-2 bg-muted p-3 rounded-md mt-4">
                                            <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                                            <p className="text-sm text-muted-foreground">
                                                Make sure to use the correct account details to avoid delays in verification.
                                            </p>
                                        </div>

                                    </div>
                                )}

                                {paymentMethod === 'qris' && (
                                    <div className="flex justify-center">
                                        <img src="https://img.freepik.com/free-vector/scan-me-qr-code_78370-2915.jpg" alt="QRIS Code" width={200} height={200} />
                                    </div>
                                )}

                                <div className="grid gap-2">
                                    <Label htmlFor="evidence">Link bukti pembayaran</Label>
                                    <Input id="evidence" placeholder="Enter url evidence" required onChange={(e) => setPaymentEvidence(e.target.value)}/>
                                </div>

                                <div className="grid gap-2 mt-2">
                                    <Label htmlFor="Date">Tanggal peminjaman (maks. 5 hari)</Label>
                                    <DateRangePicker
                                        onSelect={(range) => {
                                            // Periksa apakah range adalah objek DateRange
                                            if (range && typeof range === "object" && "from" in range && "to" in range) {
                                                setDateRange(range as DateRange);
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" onClick={handleSubmit}>
                            Checkout
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
