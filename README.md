# Ecommerce — Product API & Dashboard

Monorepo with a **Node.js / Express / MongoDB** backend and a **React / Vite** frontend. Detailed API notes live in [Design Document.md](./Design%20Document.md). Per-app docs: [backend/README.md](./backend/README.md), [frontend/README.md](./frontend/README.md).

---

## Clone the repository

```bash
git clone <your-repository-url> ecommerce
cd ecommerce
```

Replace `<your-repository-url>` with your Git remote.

---

## Prerequisites

- **Node.js** (LTS recommended) and **npm**
- **MongoDB** running locally

---

## Backend — how to run

```bash
cd backend
npm install
```

### Environment variables

Create `backend/.env` (see `backend/.env.example`):

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGO_URI` | Yes | MongoDB connection string (e.g. `mongodb://localhost:27017/ecommerce`) |
| `JWT_SECRET` | Yes | Secret used to sign JWTs (use a long random string in production) |
| `PORT` | No | HTTP port (default `5000`) |
| `NODE_ENV` | No | e.g. `development` |

### Start the API

```bash
npm run dev    # nodemon
# or
npm start      # node
```

API base (default): `http://localhost:5000/api`

### Backend tests

Requires MongoDB for the test database.

```bash
# optional: override test DB
export MONGO_TEST_URI=mongodb://localhost:27017/ecommerce_test

npm test
```

---

## Frontend — how to run

```bash
cd frontend
npm install
```

### Environment variables

Create `frontend/.env.local` (see `frontend/.env.example`):

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | No | Full base URL for the API (default `http://localhost:5000/api`) |

Example:

```env
VITE_API_URL=http://localhost:5000/api
```

### Start the app

```bash
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`). The UI expects the backend to be reachable at `VITE_API_URL`.

### Frontend tests

```bash
npm test -- --run
```

---

## Run both during development

1. Terminal 1: `cd backend && npm run dev` (MongoDB running, `.env` set)  
2. Terminal 2: `cd frontend && npm run dev` (`VITE_API_URL` pointing at the backend)

---

## Docker (backend)

The backend folder includes Docker assets; see [backend/README.md](./backend/README.md) for `docker compose` usage and containerized MongoDB URIs.

---

## Project layout

```txt
ecommerce/
├── Design Document.md   # API, auth, validation, examples, trade-offs, tests
├── README.md            # This file — clone & run both apps
└── Ecommerce.postman_collection.json   # Postman collection 
├── backend/             # Express API
└── frontend/            # React + Vite

```

