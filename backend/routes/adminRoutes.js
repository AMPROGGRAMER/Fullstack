import express from "express";
import { protect, requireRole } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import Provider from "../models/Provider.js";
import Booking from "../models/Booking.js";

const router = express.Router();

// All admin routes require admin role
router.use(protect, requireRole("admin"));

router.get("/summary", async (req, res, next) => {
  try {
    const [users, providers, bookings] = await Promise.all([
      User.countDocuments(),
      Provider.countDocuments(),
      Booking.countDocuments()
    ]);

    const byStatus = await Booking.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      counts: { users, providers, bookings },
      bookingStatus: byStatus
    });
  } catch (err) {
    next(err);
  }
});

router.get("/users", async (req, res, next) => {
  try {
    const users = await User.find({}).select("-password").limit(200);
    res.json(users);
  } catch (err) {
    next(err);
  }
});

router.get("/providers", async (req, res, next) => {
  try {
    const providers = await Provider.find({}).limit(200);
    res.json(providers);
  } catch (err) {
    next(err);
  }
});

router.get("/bookings", async (req, res, next) => {
  try {
    const bookings = await Booking.find({})
      .populate("user", "name email")
      .populate("provider", "name category city")
      .sort({ createdAt: -1 })
      .limit(300);
    res.json(bookings);
  } catch (err) {
    next(err);
  }
});

export default router;

