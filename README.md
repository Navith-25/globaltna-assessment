# GlobalTNA - Service Request Board

A full-stack mini service request board built with Next.js, Express, and MongoDB.

## Live Demo

- **Frontend:** https://globaltna-assessment-rust.vercel.app
- **Backend API:** https://globaltna-assessment-fis2.onrender.com

## Tech Stack

- **Frontend:** Next.js 15 (App Router, TypeScript, Tailwind CSS)
- **Backend:** Node.js + Express
- **Database:** MongoDB Atlas + Mongoose
- **Auth:** JWT (JSON Web Tokens)
- **Testing:** Jest + Supertest

## Features

- Browse all service requests with category and status filters
- Keyword search across title and description (with debounce)
- Post new service requests with client-side and server-side validation
- View full job details
- Update job status (Open / In Progress / Closed)
- Delete jobs
- JWT-based authentication (register/login)
- Only logged-in users can post or delete jobs
- Loading skeletons and toast notifications
- 8 unit tests on API endpoints
- Seed script with 5 sample jobs

## Project Structure

```
globaltna-assessment/
├── backend/
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── JobRequest.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── jobs.js
│   ├── tests/
│   │   └── jobs.test.js
│   ├── seed.js
│   └── server.js
└── frontend/
    ├── app/
    │   ├── auth/
    │   │   ├── login/
    │   │   └── register/
    │   ├── jobs/
    │   │   ├── [id]/
    │   │   └── new/
    │   ├── layout.tsx
    │   └── page.tsx
    ├── components/
    │   └── Navbar.tsx
    ├── context/
    │   └── AuthContext.tsx
    └── lib/
        └── api.ts
```

## Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier)

---

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/globaltna?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key
```

Run the backend:

```bash
npm run dev
```

Optional - seed sample data:

```bash
node seed.js
```

Backend runs on: `http://localhost:5000`

---

### Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env.local` file in the `frontend/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Run the frontend:

```bash
npm run dev
```

Frontend runs on: `http://localhost:3000`

---

## API Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/api/jobs` | No | List all jobs (supports `?category=` `?status=` `?search=`) |
| GET | `/api/jobs/:id` | No | Get single job |
| POST | `/api/jobs` | Yes | Create new job |
| PATCH | `/api/jobs/:id` | No | Update job status |
| DELETE | `/api/jobs/:id` | Yes | Delete job |
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login user |
| GET | `/api/auth/me` | Yes | Get current user |

## Running Tests

```bash
cd backend
npm test
```

All 8 tests pass:
- GET /api/jobs - should return all jobs
- POST /api/jobs - should create a new job
- POST /api/jobs - should fail without required fields
- GET /api/jobs/:id - should return a single job
- GET /api/jobs/:id - should return 404 for invalid id
- PATCH /api/jobs/:id - should update job status
- PATCH /api/jobs/:id - should reject invalid status
- DELETE /api/jobs/:id - should delete the job