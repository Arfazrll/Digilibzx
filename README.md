<div align="center">

# Digilibzx

### Digital Library Management System with AI-Powered Features

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.0-brightgreen?style=for-the-badge&logo=spring&logoColor=white)](https://spring.io/projects/spring-boot)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=28&duration=3000&pause=1000&color=3B82F6&center=true&vCenter=true&random=false&width=600&lines=Modern+Library+Management;AI-Powered+Book+Summaries;Smart+Borrowing+System;Real-time+Analytics+Dashboard" alt="Typing SVG" />
</p>

[Features](#features) •
[Quick Start](#quick-start) •
[Documentation](#api-documentation) •
[Contributing](#contributing)

---

</div>

## Overview

**Digilibzx** is a modern digital library management system that integrates Artificial Intelligence to provide enhanced user experience. The system is designed to streamline borrowing, returning, and managing book collections with an intuitive and responsive interface.

### Key Advantages

- **AI-Powered Book Summaries** - Automatic book summaries using Google Gemini & OpenAI
- **Real-time Analytics** - Dashboard with interactive data visualization
- **Secure Authentication** - Multi-layered security system with Spring Security
- **Modern UI/UX** - Responsive interface with Tailwind CSS & Shadcn UI
- **Mobile Friendly** - Optimized for all screen sizes
- **Docker Ready** - Easy deployment with containerization

---

## Features

### User Role

#### Collection Management
- Advanced search & filter books
- Browse by category & genre
- Rating & review system
- Bookmark favorite books

#### Borrowing System
- Shopping cart for borrowing
- Unique invoice code per transaction
- Return deadline notifications
- Complete borrowing history

#### AI Features
- Auto-generate book summary
- Smart book recommendations
- AI-powered search

#### Account Management
- Edit user profile
- Real-time notifications
- Personal statistics
- Achievement badges

### Admin Role

#### Dashboard & Analytics
- Real-time borrowing charts
- User activity monitoring
- Popular books statistics
- Trend analysis with Recharts

#### Data Management
- **User Management** - CRUD users & role assignment
- **Book Management** - Manage book collections
- **Category Management** - Organize categories
- **Inventory Control** - Stock management

#### Transaction Validation
- Review borrowing requests
- Approve/reject borrowing
- Process book returns
- Handle overdue management

#### Reporting System
- Export reports to PDF
- Generate analytics reports
- Email automated reports
- Custom date range reports

---

## Technology Stack

<div align="center">

### Frontend
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Shadcn UI](https://img.shields.io/badge/Shadcn%20UI-000000?style=for-the-badge&logo=shadcnui&logoColor=white)

### Backend
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![Java](https://img.shields.io/badge/Java_17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Security](https://img.shields.io/badge/Spring_Security-6DB33F?style=for-the-badge&logo=Spring-Security&logoColor=white)
![Hibernate](https://img.shields.io/badge/Hibernate-59666C?style=for-the-badge&logo=Hibernate&logoColor=white)

### Database & Tools
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=Swagger&logoColor=white)

### AI Integration
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)

</div>

---

## Prerequisites

Before getting started, ensure you have the following installed:

- **Docker Desktop** (v20.10+) & Docker Compose
- **Java JDK 17** (for local development)
- **Node.js** (v18+) & npm/pnpm
- **MySQL** (v8.0+)
- **Google Gemini API Key** or **OpenAI API Key** (for AI features)

---

## Quick Start

### Method 1: Docker (Recommended)

```bash
# Clone repository
git clone https://github.com/username/digilibzx.git
cd digilibzx

# Setup environment variables
cp frontend/.env.example frontend/.env
cp backend/src/main/resources/application.properties.example backend/src/main/resources/application.properties

# Update API Keys in .env
# NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
# OPENAI_API_KEY=your_openai_api_key

# Build & Run containers
docker-compose up --build

# Access application
# Frontend: http://localhost:3000
# Backend: http://localhost:8081
# Swagger: http://localhost:8081/swagger-ui/index.html
```

### Method 2: Manual Installation

#### Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies & build
mvn clean install

# Setup database
mysql -u root -p
CREATE DATABASE digilibz;
exit;

# Update application.properties
# spring.datasource.url=jdbc:mysql://localhost:3306/digilibz
# spring.datasource.username=root
# spring.datasource.password=your_password

# Run application
mvn spring-boot:run

# Backend running at http://localhost:8081
```

#### Frontend Setup

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install
# or
pnpm install

# Setup environment variables
cp .env.example .env

# Update .env
# NEXT_PUBLIC_API_URL=http://localhost:8081
# NEXT_PUBLIC_GEMINI_API_KEY=your_key

# Run development server
npm run dev

# Frontend running at http://localhost:3000
```

---

## Project Structure

```
digilibzx/
│
├── backend/                         # Spring Boot Application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/digilibz/
│   │   │   │   ├── controller/      # REST API Endpoints
│   │   │   │   ├── service/         # Business Logic
│   │   │   │   ├── repository/      # Database Access Layer
│   │   │   │   ├── model/           # Entity Models
│   │   │   │   ├── dto/             # Data Transfer Objects
│   │   │   │   ├── config/          # Configuration Classes
│   │   │   │   └── security/        # Security & Authentication
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── static/
│   │   └── test/                    # Unit & Integration Tests
│   ├── Dockerfile
│   └── pom.xml
│
├── frontend/                        # Next.js Application
│   ├── app/                         # App Router
│   │   ├── (auth)/                  # Authentication routes
│   │   ├── (dashboard)/             # Dashboard routes
│   │   ├── admin/                   # Admin pages
│   │   ├── user/                    # User pages
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/                  # React Components
│   │   ├── ui/                      # Shadcn UI Components
│   │   ├── layout/                  # Layout Components
│   │   └── shared/                  # Shared Components
│   ├── lib/                         # Utilities & Helpers
│   │   ├── api.ts                   # API Client
│   │   ├── utils.ts                 # Helper Functions
│   │   └── validations.ts           # Zod Schemas
│   ├── hooks/                       # Custom React Hooks
│   ├── types/                       # TypeScript Types
│   ├── public/                      # Static Assets
│   ├── .env.example
│   ├── Dockerfile
│   ├── package.json
│   └── tailwind.config.ts
│
├── docker-compose.yml               # Docker Orchestration
├── .gitignore
├── README.md
└── LICENSE
```


## Acknowledgments

Special thanks to the following open-source projects:

- [Next.js](https://nextjs.org/) - The React Framework for Production
- [Spring Boot](https://spring.io/projects/spring-boot) - Java-based Framework
- [Shadcn UI](https://ui.shadcn.com/) - Re-usable Components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS Framework
- [Google Gemini](https://ai.google.dev/) - AI Model Integration
- [Recharts](https://recharts.org/) - Composable Charting Library

---

[Back to Top](#digilibzx)

</div>

