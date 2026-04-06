# ServeLocal MERN (Fullstack) - PRODUCTION READY

Complete local service marketplace (Plumber, Electrician, Cleaner, Tutors, etc.) with real-time chat, wallet payments, and role-based dashboards.

- Frontend: React + Vite + Socket.io-client (`frontend/`)
- Backend: Node.js + Express + MongoDB + Socket.io (`backend/`)

## Requirements

- Node.js (LTS recommended)
- MongoDB running locally OR MongoDB Atlas connection string

## Quick Start

### 1) Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT_SECRET
npm run dev
```

Backend runs at `http://localhost:5000`

### 2) Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend runs at `http://localhost:5173`

## Features Implemented

**Authentication**: JWT + bcrypt with roles (user/provider/admin)  
**Booking System**: Full lifecycle (pending → accepted → completed), hybrid wallet payments  
**Wallet**: Add funds, auto-deduct on booking, pay unpaid bookings later  
**Real-time Chat**: Socket.io 1-to-1 chat (users ↔ providers)  
**Notifications**: Booking status updates only (no spam)  
**Reviews**: One review per booking, auto-updates provider rating  
**Favorites**: Add/remove providers  
**Service Management**: Providers CRUD their services  
**Provider Dashboard**: Stats (bookings, completed jobs, rating, earnings)  
**Admin Panel**: Approve providers, manage users/services

## API Endpoints

### Auth
- `POST /api/auth/register` `{ name, email, password, role }`
- `POST /api/auth/login` `{ email, password }`
- `GET /api/auth/me` (Bearer token)

### Users
- `GET /api/users/favorites` - Get favorites
- `POST /api/users/favorites/:id/toggle` - Toggle favorite
- `GET /api/users/wallet` - Get wallet balance & transactions
- `POST /api/users/wallet/add` - Add funds
- `PATCH /api/users/me` - Update profile

### Services
- `GET /api/services` - List services (public)
- `GET /api/services/my` - Provider's services
- `POST /api/services` - Create service (provider)
- `PATCH /api/services/:id` - Update service (provider)
- `DELETE /api/services/:id` - Delete service (provider)

### Bookings
- `POST /api/bookings` - Create booking (wallet auto-deduct)
- `GET /api/bookings/my` - User's bookings
- `GET /api/bookings/provider` - Provider's bookings
- `PATCH /api/bookings/:id/status` - Update status (provider)
- `POST /api/bookings/:id/pay/wallet` - Pay unpaid booking

### Chat
- `GET /api/chat/threads` - Get chat threads
- `POST /api/chat/thread/:userId` - Get/create thread
- `GET /api/chat/thread/:chatId/messages` - Get messages

### Notifications
- `GET /api/notifications/my` - Get notifications
- `PATCH /api/notifications/:id/read` - Mark as read
- `PATCH /api/notifications/read-all` - Mark all read

### Providers
- `GET /api/providers` - List providers
- `GET /api/providers/:id` - Get provider
- `POST /api/providers` - Create/update profile

### Admin
- `GET /api/admin/summary` - Dashboard stats
- `GET /api/admin/users` - List users
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/providers` - List providers
- `PATCH /api/admin/providers/:id/approve` - Approve provider
- `DELETE /api/admin/providers/:id` - Delete provider

## Socket.io Events

**Client → Server**
- `join { userId }` - Join user room
- `chat:send { chatId, senderId, text }` - Send message

**Server → Client**
- `chat:message { chatId, message }` - New message
- `notification:new` - New notification
- `booking:created` - New booking
- `booking:updated` - Booking status changed

## Payment Flow (Hybrid)

1. User creates booking → auto-deducts from wallet if sufficient balance
2. Insufficient balance → booking created as "unpaid"
3. User pays later via Wallet page → `POST /api/bookings/:id/pay/wallet`
4. Provider can only accept after payment is confirmed
5. On completion, provider earnings auto-increase

## Environment Variables

### Backend `.env`
```
MONGO_URI=mongodb://127.0.0.1:27017/servelocal
JWT_SECRET=your_strong_secret
PORT=5000

# Optional
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```

### Frontend `.env`
```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## UI Note

Original CSS/styles from your HTML template were preserved exactly. All pages were wired to real APIs without changing layout, colors, spacing, or structure.

