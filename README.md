# ServeLocal MERN (Fullstack)

This is a MERN version of your `LocalServe.html.html` concept:

- Frontend: React + Vite (`frontend/`)
- Backend: Node.js + Express + MongoDB (Mongoose) (`backend/`)

## Requirements

- Node.js (LTS recommended)
- MongoDB running locally, OR a MongoDB Atlas connection string

## Setup

### 1) Backend

Open a terminal in `servelocal-mern/backend`:

```bash
npm install
```

Create `.env` (copy from `.env.example`) and set your values:

```bash
MONGO_URI=mongodb://127.0.0.1:27017/servelocal
JWT_SECRET=change_this_secret
PORT=5000
```

Run backend:

```bash
npm run dev
```

Backend runs at `http://localhost:5000`.

### 2) Frontend

Open a terminal in `servelocal-mern/frontend`:

```bash
npm install
```

Create `frontend/.env` (copy from `.env.example`):

```bash
VITE_API_URL=http://localhost:5000/api
```

Run frontend:

```bash
npm run dev
```

Frontend runs at `http://localhost:5173`.

## API endpoints (backend)

- `POST /api/auth/register` `{ name, email, password, role }`
- `POST /api/auth/login` `{ email, password }`
- `GET /api/auth/me` (requires `Authorization: Bearer <token>`)
- `GET /api/providers`
- `GET /api/providers/:id`
- `POST /api/providers` (provider role + token)
- `POST /api/bookings` (token)
- `GET /api/bookings/my` (token)
- `GET /api/categories`
- `POST /api/reviews` (token)

## Notes (bringing your HTML UI)

Your big CSS from `LocalServe.html.html` can be pasted into:

- `frontend/src/styles.css`

Then reuse the same class names in React components.

