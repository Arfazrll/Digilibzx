// review
export interface Review {
    id: string;
    author: string;
    date: string;
    rating: number;
    content: string;
}

// book
export interface Book {
    id: string;
    title: string;
    author: string;
    category: string;
    year: number;
    description: string;
    image: string;
    quota: number;
    rackNumber: string;
    isbn: string;
    language: string;
    availableCopies: number;
    lateFee: number;
    canBorrow: boolean;
    rating: number;
    reviews: Review[];
}

export interface SimpleBook {
    id: string;
    title: string;
    author: string;
    category: string;
    year: number;
    description?: string;
    image: string;
    quota: number;
    canBorrow: boolean;
}

export interface CreateUpdateBook {
    id?: string;
    title: string;
    author: string;
    category: string;
    year: number;
    description: string;
    image: string;
    quota: number;
    rackNumber: string;
    isbn: string;
    language: string;
    availableCopies: number;
    lateFee: number;
    canBorrow: boolean;
    rating?: number;
}

// notification
export interface Notification {
    id: string
    userId: string
    title: string
    message: string
    type: "INFO" | "REMINDER" | "ALERT"
    date: string
    read: boolean
  }

// user
export interface User {
    id?: string,
    email: string,
    password?: string,
    name: string,
    phone?: string,
    role: "admin" | "student" | "lecturer",
    nim?: string,
    nip?: string,
    year?: string,
}

// transaction
export interface BookItems {
    id: string
    title: string
    author: string
    image: string
    lateFee?: number
}

export interface Transaction {
    id: string
    invoiceCode: string
    dateRange: {
        from: string
        to: string
    }
    totalFee: number
    status: "pending" | "approved" | "declined" | "overdue" 
    type: "borrow" | "return"
    paymentMethod: string
    paymentEvidence: string
    items: BookItems[]
    user: {
        id: string
        email: string
        name: string
        phone: string
        role: string
    }
}

export interface newTransaction {
    userId: string
    totalFee: number
    paymentMethod: string
    paymentEvidence: string
    items: BookItems[]
    dateFrom: string
    dateTo: string
}