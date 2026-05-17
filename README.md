# GlobalTNA - Service Request Board

A full-stack mini service request board built with Next.js, Express, and MongoDB.

## Tech Stack

- **Frontend:** Next.js 15 (App Router, TypeScript, Tailwind CSS)
- **Backend:** Node.js + Express
- **Database:** MongoDB Atlas + Mongoose

## Project Structure

```
globaltna-assessment/
├── backend/
└── frontend/
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

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/jobs` | List all jobs (supports `?category=` `?status=` `?search=`) |
| GET | `/api/jobs/:id` | Get single job |
| POST | `/api/jobs` | Create new job |
| PATCH | `/api/jobs/:id` | Update job status |
| DELETE | `/api/jobs/:id` | Delete job |

## Features

- Browse all service requests with category and status filters
- Keyword search across title and description
- Post new service requests with client-side and server-side validation
- View full job details
- Update job status (Open / In Progress / Closed)
- Delete jobs
- Seed script with 5 sample jobs