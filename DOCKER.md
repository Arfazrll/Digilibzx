# 🐳 Docker Setup - Digilibz Production

## ⚡ Jalankan Aplikasi (1 Command)

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
