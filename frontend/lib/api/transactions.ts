import { newTransaction, Transaction } from "@/types/interfaces";

/**
 * Mengambil data transaksi berdasarkan kode invoice.
 *
 * @param {string} invoiceId - Kode invoice yang ingin diambil datanya.
 * @returns {Promise<any>} Data transaksi yang sesuai dengan kode invoice.
 * @throws {Error} Jika permintaan gagal atau respons tidak OK.
 *
 * Contoh permintaan (request):
 * GET http://localhost:8080/api/transactions/invoice?invoiceCode=INV-20241211-0001
 *
 * Contoh respons (response):
 * {
  "id": "1",
  "invoiceCode": "INV-20241211-0001",
  "dateRange": {
    "from": "2024-12-01",
    "to": "2024-12-15"
  },
  "status": "pending",
  "type": "borrow",
  "user": {
    "id": "123",
    "name": "John Doe",
    "email": "johndoe@example.com",
    "phone": "08123456789",
    "role": "student"
  },
  "totalFee": 50000,
  "paymentMethod": "bank_transfer",
  "paymentEvidence": "http://example.com/evidence.jpg",
  "items": [
    {
      "id": "book-1",
      "title": "Introduction to Programming",
      "quantity": 1,
      "price": 50000
    }
  ]
}
 */
export async function fetchTransactionsByInvoiceId(invoiceId: string) {
    const response = await fetch(`${process.env.API_BASE_URL_PRODUCTION}/transactions/invoice?invoiceCode=${invoiceId}`, {
        method: 'GET',
    });

    if (!response.ok) {
        throw new Error('Gagal mengambil data invoice');
    }
    return response.json();
}

/**
 * Mengambil semua data transaksi berdasarkan filter (opsional).
 *
 * @param {Record<string, any>} [payload] - Filter untuk data transaksi (opsional). 
 *                                          Contoh filter: { status: 'pending', type: 'borrow' }.
 * @returns {Promise<any>} Data transaksi yang sesuai dengan filter (jika disediakan).
 * @throws {Error} Jika permintaan gagal atau respons tidak OK.
 *
 * Contoh permintaan (request):
 * GET http://localhost:8080/api/transactions?status=pending&type=borrow
 *
 * Contoh respons (response):
 * [
  {
    "id": "1",
    "invoiceCode": "INV-20241211-0001",
    "dateRange": {
      "from": "2024-12-01",
      "to": "2024-12-15"
    },
    "status": "pending",
    "type": "borrow",
    "user": {
      "id": "123",
      "name": "John Doe",
      "email": "johndoe@example.com",
      "phone": "08123456789",
      "role": "student"
    },
    "totalFee": 50000,
    "paymentMethod": "bank_transfer",
    "paymentEvidence": "http://example.com/evidence.jpg",
    "items": [
      {
        "id": "book-1",
        "title": "Introduction to Programming",
        "quantity": 1,
        "price": 50000
      }
    ]
  },
]
 */
export async function fetchTransactions(payload?: Record<string, any>) {
    const queryString = new URLSearchParams(payload).toString();

    const response = await fetch(`${process.env.API_BASE_URL_PRODUCTION}/transactions?${queryString}`, {
        method: 'GET',
    });

    if (!response.ok) {
        throw new Error('Gagal mengambil data transaksi');
    }
    return response.json();
}

/**
 * Membuat transaksi baru.
 *
 * @param {newTransaction} data - Data transaksi baru yang ingin dibuat.
 * @returns {Promise<any>} Data transaksi baru yang berhasil dibuat.
 * @throws {Error} Jika permintaan gagal atau respons tidak OK.
 *
 * Contoh permintaan (request):
 * POST http://localhost:8080/api/transactions
 * Body:
 * {
  "userId": "123",
  "totalFee": 50000,
  "paymentMethod": "bank_transfer",
  "paymentEvidence": "http://example.com/evidence.jpg",
  "items": [
    {
      "id": "book-1",
      "title": "Introduction to Programming",
      "quantity": 1,
      "price": 50000
    }
  ],
  "dateFrom": "2024-12-01",
  "dateTo": "2024-12-15"
}
 *
 * Contoh respons (response):
 * {
  "id": "3",
  "invoiceCode": "INV-20241211-0003",
  "dateRange": {
    "from": "2024-12-01",
    "to": "2024-12-15"
  },
  "status": "pending",
  "type": "borrow",
  "user": {
    "id": "123",
    "name": "John Doe",
    "email": "johndoe@example.com",
    "phone": "08123456789",
    "role": "student"
  },
  "totalFee": 50000,
  "paymentMethod": "bank_transfer",
  "paymentEvidence": "http://example.com/evidence.jpg",
  "items": [
    {
      "id": "book-1",
      "title": "Introduction to Programming",
      "quantity": 1,
      "price": 50000
    }
  ]
} 
 *  */
export async function fetchPostTransaction(data: newTransaction) {
  console.log(data)
    const response = await fetch(`${process.env.API_BASE_URL_PRODUCTION}/transactions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    if (!response.ok) {
        throw new Error('Gagal melakukan transaksi');
    }
    return response.json();
}

/**
 * Memperbarui status transaksi berdasarkan kode invoice.
 *
 * @param {string} invoiceCode - Kode invoice transaksi yang ingin diperbarui.
 * @param {string} status - Status baru untuk transaksi (contoh: "approved", "declined").
 * @returns {Promise<any>} Data transaksi yang telah diperbarui.
 * @throws {Error} Jika permintaan gagal atau respons tidak OK.
 *
 * Contoh permintaan (request):
 * PUT http://localhost:8080/api/transactions?invoiceCode=INV-20241211-0001&status=approved
 *
 * Contoh respons (response):
 * {
  "id": "1",
  "invoiceCode": "INV-20241211-0001",
  "dateRange": {
    "from": "2024-12-01",
    "to": "2024-12-15"
  },
  "status": "approved",
  "type": "borrow",
  "user": {
    "id": "123",
    "name": "John Doe",
    "email": "johndoe@example.com",
    "phone": "08123456789",
    "role": "student"
  },
  "totalFee": 50000,
  "paymentMethod": "bank_transfer",
  "paymentEvidence": "http://example.com/evidence.jpg",
  "items": [
    {
      "id": "book-1",
      "title": "Introduction to Programming",
      "quantity": 1,
      "price": 50000
    }
  ]
}
 */
export async function fetchUpdateStatusTransaction(invoiceCode: string, status: string, type?: string) {
  let url = `${process.env.API_BASE_URL_PRODUCTION}/transactions?invoiceCode=${invoiceCode}&status=${status}`;
  if (type) {
      url += `&type=${type}`;
  }

  const response = await fetch(url, {
      method: 'PUT',
  });

  if (!response.ok) {
      throw new Error('Gagal mengupdate status transaksi');
  }
  
  return response.json();
}


