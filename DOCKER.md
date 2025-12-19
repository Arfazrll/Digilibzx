# 🐳 Docker Setup - Digilibz Production

## ✅ Prerequisite

**Install Docker Desktop** dari https://www.docker.com/products/docker-desktop

Setelah install:
1. Restart PowerShell/CMD
2. Verify dengan: `docker --version`

## ⚡ Jalankan Aplikasi (1 Command)

Navigate ke folder project, kemudian jalankan:

```bash
docker compose up --build
```

atau jika Docker versi lama:

```bash
docker-compose up --build
```

## 🌐 Akses

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8080
- **API Docs**: http://localhost:8080/swagger-ui.html
- **Database**: localhost:3306

## 🛑 Stop

```bash
docker compose down
```

atau:

```bash
docker-compose down
```

## 📊 Services

| Service | Port | Status |
|---------|------|--------|
| Frontend (Next.js) | 3000 | ✅ |
| Backend (Spring Boot) | 8080 | ✅ |
| MySQL | 3306 | ✅ |

## 💾 Database

- User: `digilibz_user`
- Password: `digilibz_pass`
- Database: `digilibz`

## 🔧 Files

- `docker-compose.yml` - Orchestration
- `backend/Dockerfile` - Backend image
- `frontend/Dockerfile` - Frontend image
- `backend/.dockerignore` - Build exclusions
- `frontend/.dockerignore` - Build exclusions
- `backend/src/main/resources/application-docker.properties` - DB config

## 🐳 Troubleshooting

### "docker-compose is not recognized"

**Solusi:**

1. Pastikan Docker Desktop sudah terinstall: https://www.docker.com/products/docker-desktop
2. Restart PowerShell/CMD setelah install
3. Jalankan: `docker --version` untuk verify
4. Gunakan command: `docker compose up --build` (tanpa hyphen)

### Verify Installation

```bash
docker --version
docker compose version
```
