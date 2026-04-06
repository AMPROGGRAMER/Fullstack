import express from "express";
import { protect, requireRole } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import Provider from "../models/Provider.js";
import Booking from "../models/Booking.js";

const router = express.Router();

// All admin routes require admin role
router.use(protect, requireRole("admin"));

// High-level dashboard summary
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

// View all users
router.get("/users", async (req, res, next) => {
  try {
    const users = await User.find({}).select("-password").limit(200);
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// Delete a user
router.delete("/users/:id", async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    next(err);
  }
});

// View all providers
router.get("/providers", async (req, res, next) => {
  try {
    const providers = await Provider.find({}).limit(200);
    res.json(providers);
  } catch (err) {
    next(err);
  }
});

// Approve provider (simple boolean flag on provider document)
router.patch("/providers/:id/approve", async (req, res, next) => {
  try {
    const provider = await Provider.findByIdAndUpdate(
      req.params.id,
      { $set: { approved: true } },
      { new: true }
    );
    if (!provider) return res.status(404).json({ message: "Provider not found" });
    res.json(provider);
  } catch (err) {
    next(err);
  }
});

// Delete provider
router.delete("/providers/:id", async (req, res, next) => {
  try {
    await Provider.findByIdAndDelete(req.params.id);
    res.json({ message: "Provider deleted" });
  } catch (err) {
    next(err);
  }
});

// View all bookings
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

