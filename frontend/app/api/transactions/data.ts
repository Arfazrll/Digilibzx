import { Transaction } from '@/types/interfaces'

export const transactions: Transaction[] = [
    {
        id: '1',
        invoiceCode: "INV-2024-001",
        dateRange: {
            from: '2024-12-01T17:00:00.000Z',
            to: '2024-12-05T17:00:00.000Z',
        },
        totalFee: 2500,
        status: 'approved',
        type: "return",
        paymentMethod: 'bank',
        paymentEvidence: 'https://www.standardbank.co.za/static_file/SBG/Assets/Img/HelpCentre/payments/payBeneficiary_reviewDetails3_720X1280.png',
        items: [
            {
                id: '1',
                title: 'The Psychology of Money',
                author: 'Morgan Housel',
                image: 'https://images-na.ssl-images-amazon.com/images/I/81cpDaCJJCL.jpg',
                lateFee: 500,
            },
            {
                id: '2',
                title: 'Educated',
                author: 'Tara Westover',
                image: 'https://images-na.ssl-images-amazon.com/images/I/81WojUxbbFL.jpg',
                lateFee: 700,
            }
        ],
        user: {
            id: '73029b4f-9165-4541-bed3-4fb5fd0de23b',
            email: 'student@university.com',
            name: 'Jane Doe',
            phone: '0812345678',
            role: 'student'
        }
    },
    {
        id: '2',
        invoiceCode: "INV-2024-002",
        dateRange: {
            from: '2024-12-10T17:00:00.000Z',
            to: '2024-12-14T17:00:00.000Z',
        },
        totalFee: 1800,
        status: 'declined',
        type: "borrow",
        paymentMethod: 'bank',
        paymentEvidence: 'https://www.standardbank.co.za/static_file/SBG/Assets/Img/HelpCentre/payments/payBeneficiary_reviewDetails3_720X1280.png',
        items: [
            {
                id: '3',
                title: 'Sapiens: A Brief History of Humankind',
                author: 'Yuval Noah Harari',
                image: 'https://images-na.ssl-images-amazon.com/images/I/91vFQ0vG9rL.jpg',
                lateFee: 600,
            },
            {
                id: '4',
                title: 'Atomic Habits',
                author: 'James Clear',
                image: 'https://images-na.ssl-images-amazon.com/images/I/71VQ0Q9HwxL.jpg',
                lateFee: 500,
            }
        ],
        user: {
            id: '73029b4f-9165-4541-bed3-4fb5fd0de23b',
            email: 'student@university.com',
            name: 'Jane Doe',
            phone: '0812345678',
            role: 'student'
        }
    },
    {
        id: '3',
        invoiceCode: "INV-2024-003",
        dateRange: {
            from: '2024-12-15T17:00:00.000Z',
            to: '2024-12-19T17:00:00.000Z',
        },
        totalFee: 2000,
        status: 'overdue',
        type: "borrow",
        paymentMethod: 'bank',
        paymentEvidence: 'https://www.standardbank.co.za/static_file/SBG/Assets/Img/HelpCentre/payments/payBeneficiary_reviewDetails3_720X1280.png',
        items: [
            {
                id: '5',
                title: 'Becoming',
                author: 'Michelle Obama',
                image: 'https://images-na.ssl-images-amazon.com/images/I/81OthjkJBuL.jpg',
                lateFee: 900,
            },
            {
                id: '2',
                title: 'Becoming',
                author: 'Michelle Obama',
                image: 'https://images-na.ssl-images-amazon.com/images/I/81OthjkJBuL.jpg',
                lateFee: 900,
            }
        ],
        user: {
            id: '73029b4f-9165-4541-bed3-4fb5fd0de23b',
            email: 'student@university.com',
            name: 'Jane Doe',
            phone: '0812345678',
            role: 'student'
        }
    },
    {
        id: '4',
        invoiceCode: "INV-2024-004",
        dateRange: {
            from: '2024-12-15T17:00:00.000Z',
            to: '2024-12-19T17:00:00.000Z',
        },
        totalFee: 2000,
        status: 'pending',
        type: "borrow",
        paymentMethod: 'bank',
        paymentEvidence: 'https://www.standardbank.co.za/static_file/SBG/Assets/Img/HelpCentre/payments/payBeneficiary_reviewDetails3_720X1280.png',
        items: [
            {
                id: '5',
                title: 'Becoming',
                author: 'Michelle Obama',
                image: 'https://images-na.ssl-images-amazon.com/images/I/81OthjkJBuL.jpg',
                lateFee: 900,
            },
            {
                id: '2',
                title: 'Becoming',
                author: 'Michelle Obama',
                image: 'https://images-na.ssl-images-amazon.com/images/I/81OthjkJBuL.jpg',
                lateFee: 900,
            },
            {
                id: '3',
                title: 'Becoming',
                author: 'Michelle Obama',
                image: 'https://images-na.ssl-images-amazon.com/images/I/81OthjkJBuL.jpg',
                lateFee: 900,
            },
        ],
        user: {
            id: '73029b4f-9165-4541-bed3-4fb5fd0de23b',
            email: 'student@university.com',
            name: 'Jane Doe',
            phone: '0812345678',
            role: 'student'
        }
    }
];
