# GlobalTNA - Service Request Board

A full-stack mini service request board built with Next.js, Express, and MongoDB.

## Live Demo

- **Frontend:** https://globaltna-assessment-rust.vercel.app
- **Backend API:** https://globaltna-assessment-fis2.onrender.com

> Note: The free Render instance may take 30-50 seconds to wake up on first load.

## Tech Stack

- **Frontend:** Next.js 15 (App Router, TypeScript, Tailwind CSS)
- **Backend:** Node.js + Express
- **Database:** MongoDB Atlas + Mongoose
- **Auth:** JWT (JSON Web Tokens) - bcryptjs for password hashing
- **Testing:** Jest + Supertest

## Features

- Browse all service requests with category and status filters
- Keyword search across title and description (with debounce)
- Post new service requests with client-side and server-side validation
- View full job details
- Update job status (Open / In Progress / Closed)
- Delete jobs
- JWT-based authentication (register / login)
- Only logged-in users can post or delete jobs
- Guests can browse all jobs freely
- Loading skeletons and toast notifications
- 8 unit tests on API endpoints (all passing)
- Seed script with 10 sample jobs

## Project Structure

```
globaltna-assessment/
├── backend/
│   ├── middleware/
│   │   ├── auth.js           # JWT protect middleware
│   │   └── errorHandler.js   # Global error handler
│   ├── models/
│   │   ├── JobRequest.js     # Job schema + validation
│   │   └── User.js           # User schema + bcrypt hashing
│   ├── routes/
│   │   ├── auth.js           # Register / Login / Me
│   │   └── jobs.js           # CRUD routes (POST + PATCH + DELETE protected)
│   ├── tests/
│   │   └── jobs.test.js      # 8 Jest + Supertest tests
│   ├── .env                  # Environment variables (not committed)
│   ├── seed.js               # Seed script - 10 sample jobs
│   └── server.js             # Express app entry point
└── frontend/
    ├── app/
    │   ├── auth/
    │   │   ├── login/page.tsx
    │   │   └── register/page.tsx
    │   ├── jobs/
    │   │   ├── [id]/page.tsx  # Job detail + status update + delete
    │   │   └── new/page.tsx   # New job form
    │   ├── layout.tsx
    │   └── page.tsx           # Home - job list + search + filters
    ├── components/
    │   └── Navbar.tsx         # Auth-aware navbar
    ├── context/
    │   └── AuthContext.tsx    # JWT auth context
    └── lib/
        └── api.ts             # API helper functions
```

## Required Environment Variables

### Backend (`backend/.env`)

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/globaltna?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key
```

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier)

### Backend Setup

```bash
cd backend
npm install
```

Create `backend/.env` with the variables above, then:

```bash
# Run in development
npm run dev

# Seed 10 sample jobs
node seed.js

# Run tests
npm test
```

Backend runs on: `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install
```

Create `frontend/.env.local` with the variables above, then:

```bash
npm run dev
```

Frontend runs on: `http://localhost:3000`

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/jobs` | No | List all jobs (`?category=` `?status=` `?search=`) |
| GET | `/api/jobs/:id` | No | Get single job |
| POST | `/api/jobs` | ✅ Yes | Create new job |
| PATCH | `/api/jobs/:id` | ✅ Yes | Update job status only |
| DELETE | `/api/jobs/:id` | ✅ Yes | Delete job |
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login user |
| GET | `/api/auth/me` | ✅ Yes | Get current user |

## Running Tests

```bash
cd backend
npm test
```

All 8 tests pass:

```
✅ GET /api/jobs - should return all jobs
✅ POST /api/jobs - should create a new job
✅ POST /api/jobs - should fail without required fields
✅ GET /api/jobs/:id - should return a single job
✅ GET /api/jobs/:id - should return 404 for invalid id
✅ PATCH /api/jobs/:id - should update job status
✅ PATCH /api/jobs/:id - should reject invalid status
✅ DELETE /api/jobs/:id - should delete the job
```