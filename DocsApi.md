# 📚 Digilibz API Documentation - Production Ready

## Table of Contents
1. [Overview](#overview)
2. [Base Configuration](#base-configuration)
3. [Authentication Endpoints](#authentication-endpoints)
4. [User Management Endpoints](#user-management-endpoints)
5. [Book Management Endpoints](#book-management-endpoints)
6. [Transaction Endpoints](#transaction-endpoints)
7. [Review Endpoints](#review-endpoints)
8. [Notification Endpoints](#notification-endpoints)
9. [Statistics Endpoints](#statistics-endpoints)
10. [Error Handling](#error-handling)
11. [Database Schema](#database-schema)

---

## Overview

**Project:** Digilibz - Digital Library Management System  
**Version:** 0.0.1-SNAPSHOT  
**Java Version:** 17  
**Spring Boot Version:** 4.0.0  
**Database:** MySQL  

### Technology Stack
- Spring Boot 4.0.0
- Spring Data JPA
- Spring Security (BCrypt)
- MySQL Connector
- Hibernate Validator
- Lombok
- SpringDoc OpenAPI

---

## Base Configuration

### Server Configuration
```
Default Port: 8080
Context Path: /
Azure Deployment Port: 80
```

### CORS Configuration
**Allowed Origins:**
- `http://localhost:3000`
- `http://localhost:5173`
- `http://localhost:5174`

**Allowed Methods:** GET, POST, PUT, DELETE, OPTIONS, PATCH  
**Allowed Headers:** All (*)  
**Credentials:** Enabled  
**Max Age:** 3600 seconds

### Security
- Password Encoding: BCrypt
- CSRF: Disabled
- All endpoints: Permit All (currently no JWT implementation)

---

## Authentication Endpoints

### 1. User Login

**Endpoint:** `POST /api/auth/login`

**Description:** Authenticate regular user (non-admin)

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "USER",
  "token": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

**Error Responses:**

**401 Unauthorized** - Invalid credentials or admin trying to login:
```json
{
  "error": "Invalid password"
}
```
```json
{
  "error": "Unauthorized: Use admin login page"
}
```

**Validation:**
- Email must exist in database
- Password must match hashed password
- User role must be USER (not ADMIN)
- Returns token (UUID format)

---

### 2. Admin Login

**Endpoint:** `POST /api/auth/login/admin`

**Description:** Authenticate admin user only

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "adminpass123"
}
```

**Success Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "email": "admin@example.com",
  "name": "Admin User",
  "role": "ADMIN",
  "token": "a1b2c3d4-e5f6-7890-abcd-ef1234567891"
}
```

**Error Responses:**

**403 Forbidden** - Non-admin trying to login or invalid credentials:
```json
{
  "error": "Unauthorized: Admin access only"
}
```

**Validation:**
- Email must exist in database
- Password must match hashed password
- User role must be ADMIN
- Returns token (UUID format)

---

## User Management Endpoints

### 3. Register User

**Endpoint:** `POST /api/users/register`

**Description:** Register new user with USER role

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "name": "New User",
  "phone": "08123456789"
}
```

**Validation Rules:**
- `email`: Valid email format, unique
- `password`: Required, not blank
- `name`: Required, not blank
- `phone`: Required, unique

**Success Response (201 Created):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440002",
  "email": "newuser@example.com",
  "password": "$2a$10$encoded_password_hash",
  "name": "New User",
  "role": "USER",
  "phone": "08123456789"
}
```

**Error Responses:**

**400 Bad Request** - Validation error:
```json
{
  "timestamp": "2024-12-26T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "email: Invalid email format; password: Password is required; ",
  "path": "/api/users/register"
}
```

**409 Conflict** - Duplicate email or phone:
```json
{
  "timestamp": "2024-12-26T10:30:00",
  "status": 409,
  "error": "Conflict",
  "message": "Datanya duplikat!",
  "path": "/api/users/register"
}
```

---

### 4. Register Admin

**Endpoint:** `POST /api/users/register/admin`

**Description:** Register new user with ADMIN role

**Request Body:**
```json
{
  "email": "newadmin@example.com",
  "password": "adminpass123",
  "name": "New Admin",
  "phone": "08198765432"
}
```

**Success Response (201 Created):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440003",
  "email": "newadmin@example.com",
  "password": "$2a$10$encoded_password_hash",
  "name": "New Admin",
  "role": "ADMIN",
  "phone": "08198765432"
}
```

**Same validation and error responses as Register User**

---

### 5. Get All Users

**Endpoint:** `GET /api/users`

**Description:** Retrieve all users with optional role filter

**Query Parameters:**
- `role` (optional): Filter by role (ADMIN or USER)

**Examples:**
```
GET /api/users
GET /api/users?role=USER
GET /api/users?role=ADMIN
```

**Success Response (200 OK):**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user1@example.com",
    "name": "User One",
    "role": "USER",
    "phone": "08123456789"
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "email": "admin@example.com",
    "name": "Admin User",
    "role": "ADMIN",
    "phone": "08198765432"
  }
]
```

**Notes:**
- Password is NOT included in response
- Returns empty array if no users found
- Role filter is case-insensitive

---

### 6. Get User by ID

**Endpoint:** `GET /api/users/{id}`

**Description:** Retrieve specific user by ID

**Path Parameters:**
- `id`: User UUID

**Example:**
```
GET /api/users/550e8400-e29b-41d4-a716-446655440000
```

**Success Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "USER",
  "phone": "08123456789"
}
```

**Error Response:**

**404 Not Found:**
```
HTTP Status: 404
Body: (empty)
```

---

### 7. Update User

**Endpoint:** `PUT /api/users/{id}`

**Description:** Update user data

**Path Parameters:**
- `id`: User UUID

**Request Body (all fields optional):**
```json
{
  "email": "newemail@example.com",
  "password": "newpassword123",
  "name": "Updated Name",
  "role": "ADMIN",
  "phone": "08111222333"
}
```

**Success Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "newemail@example.com",
  "password": "$2a$10$new_encoded_password_hash",
  "name": "Updated Name",
  "role": "ADMIN",
  "phone": "08111222333"
}
```

**Error Responses:**

**400 Bad Request** - Email or phone already in use:
```
HTTP Status: 400
Body: null
```

**404 Not Found** - User not found:
```
HTTP Status: 404
Body: null
```

**Validation:**
- If email changed, must be unique
- If phone changed, must be unique
- Password is re-hashed if provided
- Only provided fields are updated

---

### 8. Delete User

**Endpoint:** `DELETE /api/users/{id}`

**Description:** Delete user by ID

**Path Parameters:**
- `id`: User UUID

**Success Response (200 OK):**
```json
{
  "status": "success",
  "message": "User deleted successfully"
}
```

**Error Response:**

**500 Internal Server Error:**
```json
{
  "status": "error",
  "message": "Error details here"
}
```

**Side Effects:**
- Cascades delete to related notifications
- Cascades delete to related reviews
- Cascades delete to related transactions

---

## Book Management Endpoints

### 9. Get All Books

**Endpoint:** `GET /api/books`

**Description:** Retrieve all books with optional filters

**Query Parameters:**
- `search` (optional): Search by title (case-insensitive, partial match)
- `category` (optional): Filter by exact category
- `years` (optional): Filter by publication year

**Examples:**
```
GET /api/books
GET /api/books?search=java
GET /api/books?category=Programming
GET /api/books?years=2023
GET /api/books?search=spring&category=Programming&years=2023
```

**Success Response (200 OK):**
```json
[
  {
    "id": "650e8400-e29b-41d4-a716-446655440000",
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "category": "Programming",
    "year": 2008,
    "description": "A handbook of agile software craftsmanship",
    "image": "https://example.com/images/cleancode.jpg",
    "quota": 10,
    "rackNumber": "A-101",
    "isbn": "978-0132350884",
    "language": "English",
    "availableCopies": 8,
    "lateFee": 5000.00,
    "canBorrow": true,
    "rating": 4.85
  }
]
```

**Field Descriptions:**
- `id`: Unique UUID
- `quota`: Total copies owned
- `availableCopies`: Currently available copies
- `lateFee`: Late fee per day (in Rupiah)
- `canBorrow`: Whether book can be borrowed
- `rating`: Average rating (0.00-5.00)

---

### 10. Get Recommended Books

**Endpoint:** `GET /api/books/recommended`

**Description:** Get random recommended books

**Query Parameters:**
- `max` (optional): Maximum number of books to return

**Examples:**
```
GET /api/books/recommended
GET /api/books/recommended?max=5
```

**Success Response (200 OK):**
```json
[
  {
    "id": "650e8400-e29b-41d4-a716-446655440000",
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "category": "Programming",
    "year": 2008,
    "description": "A handbook of agile software craftsmanship",
    "image": "https://example.com/images/cleancode.jpg",
    "quota": 10,
    "rackNumber": "A-101",
    "isbn": "978-0132350884",
    "language": "English",
    "availableCopies": 8,
    "lateFee": 5000.00,
    "canBorrow": true,
    "rating": 4.85
  }
]
```

**Notes:**
- Returns books in random order
- If `max` not specified, returns all books
- Uses SQL RAND() function for randomization

---

### 11. Get Book by ID

**Endpoint:** `GET /api/books/{id}`

**Description:** Retrieve book details with reviews

**Path Parameters:**
- `id`: Book UUID

**Query Parameters:**
- `max` (optional): Maximum reviews to return (default: 5)

**Example:**
```
GET /api/books/650e8400-e29b-41d4-a716-446655440000?max=10
```

**Success Response (200 OK):**
```json
{
  "id": "650e8400-e29b-41d4-a716-446655440000",
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "category": "Programming",
  "year": 2008,
  "description": "A handbook of agile software craftsmanship",
  "image": "https://example.com/images/cleancode.jpg",
  "quota": 10,
  "rackNumber": "A-101",
  "isbn": "978-0132350884",
  "language": "English",
  "availableCopies": 8,
  "lateFee": 5000.00,
  "canBorrow": true,
  "rating": 4.85,
  "reviews": [
    {
      "id": "750e8400-e29b-41d4-a716-446655440000",
      "bookTitle": "Clean Code",
      "authorName": "John Doe",
      "date": "2024-12-20T10:30:00",
      "rating": 5.0,
      "content": "Excellent book for learning clean coding practices!"
    }
  ]
}
```

**Error Response:**

**404 Not Found:**
```json
{
  "timestamp": "2024-12-26T10:30:00",
  "status": 404,
  "error": "Not Found",
  "message": "No value present",
  "path": "/api/books/650e8400-e29b-41d4-a716-446655440000"
}
```

---

### 12. Add Book

**Endpoint:** `POST /api/books`

**Description:** Create new book

**Request Body:**
```json
{
  "title": "Design Patterns",
  "author": "Gang of Four",
  "category": "Programming",
  "year": 1994,
  "description": "Elements of Reusable Object-Oriented Software",
  "image": "https://example.com/images/designpatterns.jpg",
  "quota": 5,
  "rackNumber": "A-102",
  "isbn": "978-0201633610",
  "language": "English",
  "availableCopies": 5,
  "lateFee": 5000.00,
  "canBorrow": true,
  "rating": 4.75
}
```

**Required Fields:**
- `title`: Unique
- `author`
- `isbn`: Unique

**Success Response (200 OK):**
```json
{
  "id": "650e8400-e29b-41d4-a716-446655440001",
  "title": "Design Patterns",
  "author": "Gang of Four",
  "category": "Programming",
  "year": 1994,
  "description": "Elements of Reusable Object-Oriented Software",
  "image": "https://example.com/images/designpatterns.jpg",
  "quota": 5,
  "rackNumber": "A-102",
  "isbn": "978-0201633610",
  "language": "English",
  "availableCopies": 5,
  "lateFee": 5000.00,
  "canBorrow": true,
  "rating": 4.75
}
```

**Error Response:**

**409 Conflict** - Duplicate title or ISBN:
```json
{
  "timestamp": "2024-12-26T10:30:00",
  "status": 409,
  "error": "Conflict",
  "message": "Datanya duplikat!",
  "path": "/api/books"
}
```

---

### 13. Update Book

**Endpoint:** `PUT /api/books/{id}`

**Description:** Update book details

**Path Parameters:**
- `id`: Book UUID

**Request Body (all fields required):**
```json
{
  "title": "Updated Title",
  "author": "Updated Author",
  "category": "Updated Category",
  "year": 2024,
  "description": "Updated description",
  "image": "https://example.com/new-image.jpg",
  "quota": 15,
  "rackNumber": "B-201",
  "isbn": "978-1234567890",
  "language": "Indonesian",
  "availableCopies": 12,
  "lateFee": 7500.00,
  "canBorrow": false,
  "rating": 4.90
}
```

**Success Response (200 OK):**
```json
{
  "id": "650e8400-e29b-41d4-a716-446655440000",
  "title": "Updated Title",
  "author": "Updated Author",
  "category": "Updated Category",
  "year": 2024,
  "description": "Updated description",
  "image": "https://example.com/new-image.jpg",
  "quota": 15,
  "rackNumber": "B-201",
  "isbn": "978-1234567890",
  "language": "Indonesian",
  "availableCopies": 12,
  "lateFee": 7500.00,
  "canBorrow": false,
  "rating": 4.90
}
```

**Error Response:**

**404 Not Found:**
```
HTTP Status: 404
Body: (empty)
```

---

### 14. Delete Book

**Endpoint:** `DELETE /api/books/{id}`

**Description:** Delete book by ID

**Path Parameters:**
- `id`: Book UUID

**Success Response (200 OK):**
```json
{
  "timestamp": "2024-12-26T10:30:00",
  "status": 200,
  "message": "Book successfully deleted",
  "path": "/api/books/650e8400-e29b-41d4-a716-446655440000"
}
```

**Error Response:**

**404 Not Found:**
```json
{
  "timestamp": "2024-12-26T10:30:00",
  "status": 404,
  "error": "Not Found",
  "message": "No value present",
  "path": "/api/books/650e8400-e29b-41d4-a716-446655440000"
}
```

**Side Effects:**
- Cascades delete to related reviews
- Cascades delete to related transaction items

---

## Transaction Endpoints

### 15. Create Transaction

**Endpoint:** `POST /api/transactions`

**Description:** Create new borrow transaction

**Request Body:**
```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "items": [
    {
      "id": "650e8400-e29b-41d4-a716-446655440000",
      "title": "Clean Code",
      "image": "https://example.com/images/cleancode.jpg",
      "author": "Robert C. Martin"
    },
    {
      "id": "650e8400-e29b-41d4-a716-446655440001",
      "title": "Design Patterns",
      "image": "https://example.com/images/designpatterns.jpg",
      "author": "Gang of Four"
    }
  ],
  "totalFee": 10000,
  "paymentMethod": "Bank Transfer",
  "paymentEvidence": "https://example.com/receipts/payment123.jpg",
  "dateFrom": "2024-12-26",
  "dateTo": "2025-01-09"
}
```

**Field Descriptions:**
- `userId`: User making the transaction
- `items`: Array of books to borrow
- `totalFee`: Total transaction fee (in Rupiah)
- `paymentMethod`: Payment method used
- `paymentEvidence`: URL/path to payment proof
- `dateFrom`: Borrow start date (ISO format)
- `dateTo`: Return due date (ISO format)

**Success Response (200 OK):**
```json
{
  "message": "Transaction successfully created",
  "data": "INV-20241226-A3F"
}
```

**Response Data:**
- Returns generated invoice code format: `INV-YYYYMMDD-XXX`
- XXX is 3-character random alphanumeric

**Automatic Actions:**
1. Sets status to PENDING
2. Sets type to BORROW
3. Generates unique invoice code
4. Creates notification for user
5. Links all books to transaction

**Error Response:**

**500 Internal Server Error:**
```json
{
  "message": "Failed to create transaction",
  "error": "User not found"
}
```

---

### 16. Get Transaction by Invoice

**Endpoint:** `GET /api/transactions/invoice`

**Description:** Retrieve transaction details by invoice code

**Query Parameters:**
- `invoiceCode` (required): Invoice code

**Example:**
```
GET /api/transactions/invoice?invoiceCode=INV-20241226-A3F
```

**Success Response (200 OK):**
```json
{
  "id": "850e8400-e29b-41d4-a716-446655440000",
  "invoiceCode": "INV-20241226-A3F",
  "dateRange": {
    "from": "2024-12-26",
    "to": "2025-01-09"
  },
  "status": "PENDING",
  "type": "BORROW",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "email": "user@example.com",
    "phone": "08123456789",
    "role": "USER"
  },
  "totalFee": 10000.0,
  "paymentMethod": "Bank Transfer",
  "paymentEvidence": "https://example.com/receipts/payment123.jpg",
  "items": [
    {
      "id": "650e8400-e29b-41d4-a716-446655440000",
      "title": "Clean Code",
      "author": "Robert C. Martin",
      "image": "https://example.com/images/cleancode.jpg",
      "lateFee": 5000.00
    },
    {
      "id": "650e8400-e29b-41d4-a716-446655440001",
      "title": "Design Patterns",
      "author": "Gang of Four",
      "image": "https://example.com/images/designpatterns.jpg",
      "lateFee": 5000.00
    }
  ]
}
```

**Status Values:**
- PENDING: Awaiting approval
- APPROVED: Approved by admin
- DECLINED: Rejected by admin
- OVERDUE: Past due date

**Type Values:**
- BORROW: Borrowing books
- RETURN: Returning books

**Error Response:**

**500 Internal Server Error:**
```json
{
  "message": "Failed...",
  "error": "Transaction not found"
}
```

---

### 17. Get Transactions with Filters

**Endpoint:** `GET /api/transactions`

**Description:** Retrieve transactions with multiple filters

**Query Parameters (all optional):**
- `search`: Search by invoice code or user name
- `status`: Filter by status (PENDING, APPROVED, DECLINED, OVERDUE, all)
- `type`: Filter by type (BORROW, RETURN, all)
- `userId`: Filter by specific user ID

**Examples:**
```
GET /api/transactions
GET /api/transactions?status=PENDING
GET /api/transactions?type=BORROW
GET /api/transactions?userId=550e8400-e29b-41d4-a716-446655440000
GET /api/transactions?search=INV-20241226
GET /api/transactions?status=APPROVED&type=BORROW
```

**Success Response (200 OK):**
```json
[
  {
    "id": "850e8400-e29b-41d4-a716-446655440000",
    "invoiceCode": "INV-20241226-A3F",
    "dateRange": {
      "from": "2024-12-26",
      "to": "2025-01-09"
    },
    "status": "PENDING",
    "type": "BORROW",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "John Doe",
      "email": "user@example.com",
      "phone": "08123456789",
      "role": "USER"
    },
    "totalFee": 10000.0,
    "paymentMethod": "Bank Transfer",
    "paymentEvidence": "https://example.com/receipts/payment123.jpg",
    "items": [
      {
        "id": "650e8400-e29b-41d4-a716-446655440000",
        "title": "Clean Code",
        "author": "Robert C. Martin",
        "image": "https://example.com/images/cleancode.jpg",
        "lateFee": 5000.00
      }
    ]
  }
]
```

**Filter Logic:**
- `search`: Searches in invoice code (contains) and user name (case-insensitive)
- `status`: Use "all" to get all statuses
- `type`: Use "all" to get all types
- Multiple filters are combined with AND logic

---

### 18. Update Transaction Status

**Endpoint:** `PUT /api/transactions`

**Description:** Update transaction status and/or type

**Query Parameters:**
- `invoiceCode` (required): Invoice code
- `status` (required): New status (approved, declined, pending, overdue)
- `type` (optional): New type (borrow, return)

**Examples:**
```
PUT /api/transactions?invoiceCode=INV-20241226-A3F&status=approved
PUT /api/transactions?invoiceCode=INV-20241226-A3F&status=approved&type=return
```

**Success Response (200 OK):**
```json
{
  "message": "Status transaksi berhasil diperbarui"
}
```

**Automatic Notification Generation:**

**For BORROW transactions:**
- `approved`: "Borrow Request Approved" (REMINDER)
- `declined`: "Borrow Request Declined" (ALERT)
- `overdue`: "Borrow Request Overdue" (ALERT)
- `pending`: "Borrow Request Pending" (INFO)

**For RETURN transactions:**
- `approved`: "Return Approved" (REMINDER)
- `declined`: "Return Declined" (ALERT)
- `overdue`: "Return Overdue" (ALERT)
- `pending`: "Return Pending" (INFO)

**Error Responses:**

**400 Bad Request** - Invalid status or type:
```json
{
  "message": "Status tidak valid. Gunakan 'approved', 'declined', 'pending', atau 'overdue'"
}
```
```json
{
  "message": "Tipe transaksi tidak valid. Gunakan 'borrow' atau 'return'"
}
```
```json
{
  "message": "Transaksi dengan kode invoice tidak ditemukan"
}
```

**500 Internal Server Error:**
```json
{
  "message": "Gagal memperbarui status transaksi"
}
```

---

## Review Endpoints

### 19. Get Reviews

**Endpoint:** `GET /api/reviews`

**Description:** Get reviews with optional book filter

**Query Parameters:**
- `bookId` (optional): Filter by book ID
- `max` (optional): Maximum reviews to return (default: 5)

**Examples:**
```
GET /api/reviews
GET /api/reviews?bookId=650e8400-e29b-41d4-a716-446655440000
GET /api/reviews?max=10
GET /api/reviews?bookId=650e8400-e29b-41d4-a716-446655440000&max=10
```

**Success Response (200 OK):**
```json
[
  {
    "id": "750e8400-e29b-41d4-a716-446655440000",
    "bookTitle": "Clean Code",
    "authorName": "John Doe",
    "date": "2024-12-20T10:30:00",
    "rating": 5.0,
    "content": "Excellent book for learning clean coding practices!"
  },
  {
    "id": "750e8400-e29b-41d4-a716-446655440001",
    "bookTitle": "Clean Code",
    "authorName": "Jane Smith",
    "date": "2024-12-21T14:15:00",
    "rating": 4.5,
    "content": "Very helpful book, recommended for all developers."
  }
]
```

**Field Descriptions:**
- `id`: Review UUID
- `bookTitle`: Title of reviewed book
- `authorName`: Name of user who wrote review
- `date`: Review creation timestamp
- `rating`: Rating value (0.0-5.0)
- `content`: Review text content

**Notes:**
- If no `bookId` provided, returns reviews for all books
- Returns most recent reviews first
- Pagination handled by `max` parameter

---

### 20. Submit Review

**Endpoint:** `POST /api/reviews`

**Description:** Create new book review

**Request Body:**
```json
{
  "bookId": "650e8400-e29b-41d4-a716-446655440000",
  "review": {
    "authorId": "550e8400-e29b-41d4-a716-446655440000",
    "rating": 5,
    "content": "This book changed my perspective on writing code. Highly recommended!"
  }
}
```

**Field Requirements:**
- `bookId`: Must exist in database
- `authorId`: Must exist in database
- `rating`: Integer 1-5
- `content`: Review text

**Success Response (200 OK):**
```json
{
  "bookId": "650e8400-e29b-41d4-a716-446655440000",
  "author": "550e8400-e29b-41d4-a716-446655440000",
  "rating": 5.0,
  "content": "This book changed my perspective on writing code. Highly recommended!"
}
```

**Automatic Actions:**
- Sets current timestamp as review date
- Links review to book and user

**Error Responses:**

**404 Not Found** - Book not found:
```json
{
  "message": "Book not found with id: 650e8400-e29b-41d4-a716-446655440000"
}
```

**404 Not Found** - User not found:
```json
{
  "message": "User not found with id: 550e8400-e29b-41d4-a716-446655440000"
}
```

---

## Notification Endpoints

### 21. Get User Notifications

**Endpoint:** `GET /api/notifications`

**Description:** Get all notifications for specific user

**Query Parameters:**
- `userId` (required): User ID

**Example:**
```
GET /api/notifications?userId=550e8400-e29b-41d4-a716-446655440000
```

**Success Response (200 OK):**
```json
[
  {
    "id": "950e8400-e29b-41d4-a716-446655440000",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "password": null,
      "name": "John Doe",
      "role": "USER",
      "phone": "08123456789"
    },
    "title": "Transaction Pending",
    "message": "Your transaction with invoice code INV-20241226-A3F is pending and will be reviewed by an admin until approved.",
    "type": "INFO",
    "date": "2024-12-26T10:30:00",
    "read": false
  },
  {
    "id": "950e8400-e29b-41d4-a716-446655440001",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "password": null,
      "name": "John Doe",
      "role": "USER",
      "phone": "08123456789"
    },
    "title": "Borrow Request Approved",
    "message": "Your borrow request with invoice code INV-20241226-A3F has been approved.",
    "type": "REMINDER",
    "date": "2024-12-26T11:00:00",
    "read": true
  }
]
```

**Notification Types:**
- `INFO`: General information
- `REMINDER`: Important reminders
- `ALERT`: Urgent alerts (declined, overdue)

**Notes:**
- Ordered by date (most recent first)
- User password is null in response
- `read` indicates if notification has been read

---

### 22. Update Notification Status

**Endpoint:** `PUT /api/notifications`

**Description:** Mark notification as read

**Query Parameters:**
- `notifId` (required): Notification ID

**Example:**
```
PUT /api/notifications?notifId=950e8400-e29b-41d4-a716-446655440000
```

**Success Response (200 OK):**
```json
{
  "id": "950e8400-e29b-41d4-a716-446655440000",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "password": null,
    "name": "John Doe",
    "role": "USER",
    "phone": "08123456789"
  },
  "title": "Transaction Pending",
  "message": "Your transaction with invoice code INV-20241226-A3F is pending...",
  "type": "INFO",
  "date": "2024-12-26T10:30:00",
  "read": true
}
```

**Error Response:**

**400 Bad Request:**
```json
{
  "error": "Notification with ID 950e8400-e29b-41d4-a716-446655440000 not found"
}
```

---

### 23. Create Notification

**Endpoint:** `POST /api/notifications`

**Description:** Create new notification for user

**Query Parameters:**
- `userId` (required): User ID
- `title` (required): Notification title
- `message` (required): Notification message
- `type` (required): Notification type (INFO, REMINDER, ALERT)

**Example:**
```
POST /api/notifications?userId=550e8400-e29b-41d4-a716-446655440000&title=Custom%20Alert&message=This%20is%20a%20test%20notification&type=INFO
```

**Success Response (200 OK):**
```json
{
  "id": "950e8400-e29b-41d4-a716-446655440002",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "password": null,
    "name": "John Doe",
    "role": "USER",
    "phone": "08123456789"
  },
  "title": "Custom Alert",
  "message": "This is a test notification",
  "type": "INFO",
  "date": "2024-12-26T12:00:00",
  "read": false
}
```

**Automatic Actions:**
- Sets current timestamp
- Sets `read` to false
- Links to specified user

**Error Response:**

**400 Bad Request:**
```json
{
  "error": "User with ID 550e8400-e29b-41d4-a716-446655440000 not found"
}
```

---

### 24. Delete Notification

**Endpoint:** `DELETE /api/notifications/{notifId}`

**Description:** Delete notification by ID

**Path Parameters:**
- `notifId`: Notification UUID

**Example:**
```
DELETE /api/notifications/950e8400-e29b-41d4-a716-446655440000
```

**Success Response (200 OK):**
```json
{
  "message": "Notification deleted successfully"
}
```

**Error Response:**

**400 Bad Request:**
```json
{
  "error": "Notification with ID 950e8400-e29b-41d4-a716-446655440000 not found"
}
```

---

## Statistics Endpoints

### 25. Get Dashboard Statistics

**Endpoint:** `GET /api/statistic`

**Description:** Get comprehensive dashboard statistics

**Query Parameters:**
- `max` (optional): Maximum recent reviews to return (default: 5)

**Example:**
```
GET /api/statistic
GET /api/statistic?max=10
```

**Success Response (200 OK):**
```json
{
  "message": "Data statistik berhasil diambil",
  "data": {
    "totalBook": 150,
    "totalUser": 250,
    "totalTransaction": 500,
    "totalNotifications": 1200,
    "averageReview": 4.35,
    "totalReview": 380,
    "recentReviews": [
      {
        "id": "750e8400-e29b-41d4-a716-446655440000",
        "bookTitle": "Clean Code",
        "authorName": "John Doe",
        "date": "2024-12-26T10:30:00",
        "rating": 5.0,
        "content": "Excellent book!"
      },
      {
        "id": "750e8400-e29b-41d4-a716-446655440001",
        "bookTitle": "Design Patterns",
        "authorName": "Jane Smith",
        "date": "2024-12-25T14:20:00",
        "rating": 4.5,
        "content": "Very informative!"
      }
    ]
  }
}
```

**Statistics Included:**
- `totalBook`: Total number of books in library
- `totalUser`: Total number of users (USER role only, excludes ADMIN)
- `totalTransaction`: Total number of transactions (all statuses)
- `totalNotifications`: Total number of notifications
- `averageReview`: Average rating across all reviews (rounded to 2 decimals)
- `totalReview`: Total number of reviews
- `recentReviews`: Most recent reviews (limited by `max` parameter)

**Notes:**
- `totalUser` counts only USER role, not ADMIN
- `averageReview` returns 0.0 if no reviews exist
- Recent reviews ordered by date (newest first)

---

## Error Handling

### Global Error Response Format

All errors follow this structure:

```json
{
  "timestamp": "2024-12-26T10:30:00",
  "status": 404,
  "error": "Not Found",
  "message": "Detailed error message",
  "path": "/api/endpoint"
}
```

### HTTP Status Codes

**200 OK** - Request successful  
**201 Created** - Resource created successfully  
**400 Bad Request** - Invalid request or validation error  
**401 Unauthorized** - Authentication failed  
**403 Forbidden** - Access denied  
**404 Not Found** - Resource not found  
**409 Conflict** - Duplicate resource  
**500 Internal Server Error** - Server error

### Common Error Scenarios

**Validation Errors (400):**
```json
{
  "timestamp": "2024-12-26T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "email: Invalid email format; password: Password is required; ",
  "path": "/api/users/register"
}
```

**Duplicate Entry (409):**
```json
{
  "timestamp": "2024-12-26T10:30:00",
  "status": 409,
  "error": "Conflict",
  "message": "Datanya duplikat!",
  "path": "/api/users/register"
}
```

**Not Found (404):**
```json
{
  "timestamp": "2024-12-26T10:30:00",
  "status": 404,
  "error": "Not Found",
  "message": "No value present",
  "path": "/api/books/invalid-id"
}
```

**Server Error (500):**
```json
{
  "timestamp": "2024-12-26T10:30:00",
  "status": 500,
  "error": "Internal Server Error",
  "message": "Error details",
  "path": "/api/endpoint"
}
```

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id CHAR(36) PRIMARY KEY NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    role ENUM('ADMIN', 'USER') NOT NULL,
    phone VARCHAR(255) UNIQUE
);
```

### Books Table
```sql
CREATE TABLE books (
    id CHAR(36) PRIMARY KEY NOT NULL,
    title VARCHAR(255) NOT NULL UNIQUE,
    author VARCHAR(255) NOT NULL,
    category VARCHAR(255),
    year INTEGER,
    description TEXT,
    image VARCHAR(255),
    quota INTEGER,
    rack_number VARCHAR(255),
    isbn VARCHAR(255) NOT NULL UNIQUE,
    language VARCHAR(255),
    available_copies INTEGER,
    late_fee DECIMAL(10,2),
    can_borrow BOOLEAN DEFAULT true,
    rating DECIMAL(3,2)
);
```

### Transactions Table
```sql
CREATE TABLE transactions (
    id CHAR(36) PRIMARY KEY NOT NULL,
    user_id CHAR(36) NOT NULL,
    invoice_code VARCHAR(255) NOT NULL UNIQUE,
    date_from DATE NOT NULL,
    date_to DATE NOT NULL,
    total_fee DOUBLE NOT NULL,
    status ENUM('PENDING', 'APPROVED', 'DECLINED', 'OVERDUE') NOT NULL,
    type ENUM('BORROW', 'RETURN') NOT NULL,
    payment_method VARCHAR(255),
    payment_evidence VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Transaction Items Table
```sql
CREATE TABLE transaction_items (
    id CHAR(36) PRIMARY KEY NOT NULL,
    transaction_id CHAR(36) NOT NULL,
    book_id CHAR(36) NOT NULL,
    FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);
```

### Reviews Table
```sql
CREATE TABLE reviews (
    id CHAR(36) PRIMARY KEY NOT NULL,
    book_id CHAR(36) NOT NULL,
    author_id CHAR(36) NOT NULL,
    date TIMESTAMP NOT NULL,
    rating DOUBLE NOT NULL,
    content TEXT NOT NULL,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Notifications Table
```sql
CREATE TABLE notifications (
    id CHAR(36) PRIMARY KEY NOT NULL,
    user_id CHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('INFO', 'REMINDER', 'ALERT') NOT NULL,
    date TIMESTAMP NOT NULL,
    `read` BOOLEAN NOT NULL DEFAULT false,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---


### Environment Configuration
```properties
# Production application.properties template
spring.datasource.url=jdbc:mysql://your-azure-mysql.mysql.database.azure.com:3306/digilibz?useSSL=true
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.jpa.hibernate.ddl-auto=validate
server.port=80
logging.level.root=WARN
logging.level.com.digilibz=INFO
```

## Support & Contact

**Project Repository:** [GitHub URL]  
**Issue Tracking:** [Issues URL]  
**Version:** 0.0.1-SNAPSHOT  
**Last Updated:** December 26, 2024

---
