# UniMaintain

A full-stack university maintenance request system scaffolded as a monorepo.

## Tech stack

- Frontend: React + Vite + TypeScript + TailwindCSS
- Backend: Node.js + Express + TypeScript
- Database: PostgreSQL + Prisma
- Auth: JWT-based authentication
- File upload: Multer + Cloudinary
- Testing: Vitest (frontend), Jest + Supertest (backend)
- Deployment: Docker + Docker Compose

## Structure

- `/frontend` — React Vite application
- `/backend` — Express API and Prisma schema
- `/docker` — Dockerfiles for frontend and backend
- `docker-compose.yml` — local development services

## Getting started

1. Copy `.env.example` to `.env` and fill in your values.
2. Run `npm install` from the project root.
3. Start the full stack:
   - `docker compose up --build -d`
4. Apply database migrations:
   - `docker compose exec backend npx prisma migrate deploy`
5. Seed the database:
   - `docker compose exec backend npx prisma db seed`

## Docker

This repo includes production-ready Docker setup:

- `/frontend/Dockerfile` — multi-stage build, nginx SPA routing
- `/backend/Dockerfile` — Node.js app with Prisma migrate deploy at startup
- `docker-compose.yml` — local development stack with Postgres, backend, frontend, and pgAdmin
- `docker-compose.prod.yml` — production override without pgAdmin, restart policies, and resource limits

### Run locally

```bash
docker compose up --build -d
```

### Production deploy

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## Environment variables

Copy `.env.example` to `.env` and update these values:

- `DATABASE_URL` — PostgreSQL connection string
- `JWT_SECRET` — JWT signing secret
- `CLOUDINARY_URL` — Cloudinary connection string
- `PORT` — backend port (default `4000`)
- `FRONTEND_URL` — public frontend URL
- `NODE_ENV` — `development` or `production`

## GitHub Actions Deployment

A workflow is included at `.github/workflows/deploy.yml` that:

1. Runs backend and frontend tests
2. Builds Docker images
3. Pushes them to Docker Hub
4. SSH deploys to a remote VPS using `docker compose pull` and `docker compose up -d`

## Helper commands

From the repo root:

- `npm run db:up` — start only the PostgreSQL container
- `npm run db:down` — stop all compose services
- `npm run db:migrate` — run migrations inside the backend container
- `npm run db:seed` — seed the database inside the backend container

# 🏫 UniMaintain

> Full-stack university maintenance request management system built with React, Node.js, PostgreSQL, and Docker.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-22.x-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.x-61DAFB.svg)
![PostgreSQL](https://img.shields.io/badge/postgresql-16.x-336791.svg)
![Docker](https://img.shields.io/badge/docker-ready-2496ED.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.x-3178C6.svg)

---

## 📋 Overview

UniMaintain replaces manual, paper-based and WhatsApp-based maintenance reporting with a structured digital platform. Students and staff submit service requests, maintenance officers manage assigned jobs, and administrators oversee the entire system — all from a single, role-aware web application.

**Live Demo:** https://unimaintain.yourdomain.com

---

## ✨ Features

- 🔐 **JWT Authentication** — secure register/login with bcrypt password hashing
- 👥 **Role-Based Access Control** — Student, Staff, Maintenance Officer, and Admin roles
- 📝 **Service Request Lifecycle** — submit, assign, track, and complete maintenance jobs
- 📷 **Image Upload** — attach photographic evidence of faults via Cloudinary
- 🔍 **Search, Filter & Pagination** — across all request listings
- 📊 **Admin Dashboard** — stats overview, user management, officer assignment
- 🔔 **In-App Notifications** — officers notified on assignment, requesters on status change
- 📜 **Audit Trail** — full status history log on every request
- 🐳 **Docker Ready** — one command to spin up the entire stack

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 + Vite | UI framework and build tool |
| TypeScript 5 | Type safety |
| TailwindCSS 3 | Styling |
| React Router v6 | Client-side routing |
| React Query | Server state management |
| React Hook Form + Zod | Form handling and validation |
| Axios | HTTP client |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js 22 + Express | API server |
| TypeScript 5 | Type safety |
| Prisma ORM | Database client and migrations |
| PostgreSQL 16 | Relational database |
| JWT + bcrypt | Authentication and password hashing |
| Multer + Cloudinary | File upload handling |
| Zod | Request validation |

### DevOps
| Technology | Purpose |
|------------|---------|
| Docker + Docker Compose | Containerisation |
| GitHub Actions | CI/CD pipeline |
| Jest + Supertest | Backend testing |
| Vitest + React Testing Library | Frontend testing |

---

## 🚀 Getting Started

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- [Git](https://git-scm.com/)
- A free [Cloudinary](https://cloudinary.com/) account (for image uploads)

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/unimaintain.git
cd unimaintain
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in your values:

```env
DATABASE_URL=postgresql://postgres:password@postgres:5432/unimaintain
JWT_SECRET=your-super-secret-key-at-least-32-chars
JWT_EXPIRES_IN=24h
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
PORT=3000
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### 3. Start the application

```bash
docker compose up --build -d
```

This starts four services: PostgreSQL, the Express API, the React frontend (via nginx), and pgAdmin.

### 4. Run database migrations and seed data

```bash
docker compose exec backend npx prisma migrate deploy
docker compose exec backend npx prisma db seed
```

The seed creates:
- 2 admin accounts
- 3 maintenance officers
- 5 student accounts
- 5 request categories
- 10 sample service requests

### 5. Access the application

| Service | URL |
|---------|-----|
| Frontend | http://localhost |
| Backend API | http://localhost:3000/api |
| pgAdmin | http://localhost:5050 |

### Default Login Credentials (dev only)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@uni.edu | Admin1234! |
| Officer | officer@uni.edu | Officer1234! |
| Student | student@uni.edu | Student1234! |

---

## 🗂 Project Structure

```
unimaintain/
├── frontend/                  # React + Vite application
│   ├── src/
│   │   ├── features/          # Feature modules (auth, requests, admin)
│   │   ├── shared/            # Shared components, hooks, utils
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── Dockerfile
│   └── nginx.conf
│
├── backend/                   # Express API
│   ├── src/
│   │   ├── routes/            # Route handlers
│   │   ├── middleware/        # Auth, role guard, validation
│   │   ├── services/          # Business logic
│   │   └── index.ts
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   ├── migrations/        # Migration history
│   │   └── seed.ts            # Seed data
│   └── Dockerfile
│
├── .github/
│   └── workflows/
│       └── deploy.yml         # CI/CD pipeline
│
├── docker-compose.yml         # Development stack
├── docker-compose.prod.yml    # Production overrides
├── .env.example               # Environment variable template
└── README.md
```

---

## 🧪 Running Tests

### Backend tests

```bash
cd backend
npm test
```

### Frontend tests

```bash
cd frontend
npm test
```

### Run all tests from root

```bash
npm run test:all
```

---

## 🌐 API Reference

Base URL: `http://localhost:3000/api`

All protected routes require: `Authorization: Bearer <token>`

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | `/auth/register` | Public | Register new user |
| POST | `/auth/login` | Public | Login and receive JWT |
| GET | `/auth/me` | Auth | Get current user |
| GET | `/requests` | Auth | List requests (role-filtered) |
| POST | `/requests` | Auth | Submit new request |
| GET | `/requests/:id` | Auth | Get request details |
| PATCH | `/requests/:id` | Auth | Update request status |
| DELETE | `/requests/:id` | Admin | Delete request |
| GET | `/admin/users` | Admin | List all users |
| PATCH | `/admin/users/:id` | Admin | Update user role |
| POST | `/admin/requests/:id/assign` | Admin | Assign officer to request |
| GET | `/admin/reports` | Admin | Get system statistics |
| GET | `/categories` | Auth | List categories |

Full API documentation is available in the [project report](./docs/UniMaintain_Technical_Report.docx).

---

## 🐳 Docker Commands

```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f

# Stop all services
docker compose down

# Reset database (WARNING: deletes all data)
docker compose down -v
docker compose up -d
docker compose exec backend npx prisma migrate deploy
docker compose exec backend npx prisma db seed

# Production deployment
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

---

## ⚙️ CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/deploy.yml`) runs automatically on every push to `main`:

1. ✅ Run backend tests
2. ✅ Run frontend tests
3. 🐳 Build Docker images
4. 📦 Push images to Docker Hub
5. 🚀 SSH into VPS and deploy with `docker compose pull && docker compose up -d`

### Required GitHub Secrets

| Secret | Description |
|--------|-------------|
| `DOCKER_USERNAME` | Docker Hub username |
| `DOCKER_PASSWORD` | Docker Hub access token |
| `VPS_HOST` | Production server IP address |
| `VPS_USER` | SSH user (e.g. `ubuntu`) |
| `VPS_SSH_KEY` | Private SSH key for VPS access |
| `JWT_SECRET` | Production JWT signing secret |
| `DATABASE_URL` | Production database connection string |
| `CLOUDINARY_URL` | Cloudinary API connection string |

---

## 📸 Screenshots

| Student Dashboard | Admin Dashboard |
|---|---|
| *(screenshot)* | *(screenshot)* |

| Submit Request Form | Request Detail |
|---|---|
| *(screenshot)* | *(screenshot)* |

---



## 👤 Author

**Your Name**
- GitHub: Olaitan07
- Email: l.olabanjo5055@miva.edu.ng

---

*Submitted as part of MIT 8333 — Advanced Web Application Development (Virtual Lab)*
