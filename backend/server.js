import express from "express";
import http from "http";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
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

app.use(express.json());
app.use(cors());

app.use(morgan("dev"));

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/", (req, res) => {
  res.send("ServeLocal API running");
});

app.use("/api/auth", authRoutes);
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
    origin: "*"
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

