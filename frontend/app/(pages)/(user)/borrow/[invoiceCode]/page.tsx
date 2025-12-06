'use client'

import InvoiceComponent from "@/components/user-page/borrow/invoice"

export default function InvoiceUserPage({ params }: { params: { invoiceCode: string } }) {
    return (
        <>
            <InvoiceComponent invoiceCode={params.invoiceCode}/>       
        </>
    )
}