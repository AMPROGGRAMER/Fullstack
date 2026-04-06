import express from "express";
import { protect, requireRole } from "../middleware/authMiddleware.js";
import {
  createBooking,
  getMyBookings,
  getProviderBookings,
  payBookingWithWallet,
  updateBookingStatus
} from "../controllers/bookingController.js";

const router = express.Router();

// Customer creates a booking
router.post("/", protect, createBooking);

// Customer views their bookings
router.get("/my", protect, getMyBookings);

// Provider views bookings for their services
router.get("/provider", protect, requireRole("provider"), getProviderBookings);

// Customer pays an existing booking using wallet
router.post("/:id/pay/wallet", protect, requireRole("user"), payBookingWithWallet);

// Provider updates booking status (accept/reject/complete/cancel)
router.patch("/:id/status", protect, requireRole("provider"), updateBookingStatus);

export default router;

