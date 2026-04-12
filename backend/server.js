import express from "express";
import http from "http";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { Server as SocketIOServer } from "socket.io";
import path from "path";

import { connectDB } from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

import authRoutes from "./routes/authRoutes.js";
import providerRoutes from "./routes/providerRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import disputeRoutes from "./routes/disputeRoutes.js";
import Chat from "./models/Chat.js";

dotenv.config();
await connectDB();

const app = express();
const server = http.createServer(app);

// Security headers
app.use(helmet({
  contentSecurityPolicy: false, // Disable for development (enable in production)
  crossOriginEmbedderPolicy: false
}));

// Rate limiting for auth routes (prevent brute force) - DISABLED for project demo
// Re-enable after changing these values for production:
// windowMs: 15 * 60 * 1000 (15 minutes), max: 10 (10 attempts)
const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute for demo
  max: 100, // 100 attempts per minute (very lenient for testing)
  message: { message: "Too many attempts, please try again in 1 minute" },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === "GET" // Skip GET requests
});

// General rate limiting - DISABLED for project demo
const generalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 1000, // 1000 requests per minute (very lenient)
  message: { message: "Too many requests, please try again later" },
  skip: (req) => req.method === "GET" // Allow unlimited GET requests
});

app.use(generalLimiter);

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(morgan("dev"));

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development"
  });
});

app.get("/", (req, res) => {
  res.send("ServeLocal API running");
});

// Apply rate limiting to auth routes
app.use("/api/auth", authLimiter, authRoutes);

app.use("/api/providers", providerRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/disputes", disputeRoutes);

const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
  }
});

app.set("io", io);

io.on("connection", (socket) => {
  socket.on("join", ({ userId }) => {
    if (userId) socket.join(`user:${userId}`);
  });

  socket.on("chat:send", async ({ chatId, senderId, text }) => {
    try {
      if (!chatId || !senderId || !text?.trim()) return;
      const chat = await Chat.findById(chatId);
      if (!chat) return;

      const isParticipant = chat.participants.some((p) => String(p) === String(senderId));
      if (!isParticipant) return;

      const msg = { sender: senderId, text: String(text).trim(), createdAt: new Date() };
      chat.messages.push(msg);
      chat.lastMessageAt = new Date();
      await chat.save();

      const recipients = chat.participants.map((p) => String(p));
      for (const uid of recipients) {
        io.to(`user:${uid}`).emit("chat:message", { chatId, message: msg });
      }
    } catch {
      // ignore socket errors
    }
  });
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${PORT}`);
});

