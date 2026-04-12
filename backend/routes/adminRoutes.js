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

// Analytics data for charts
router.get("/analytics", async (req, res, next) => {
  try {
    const now = new Date();
    const last30Days = new Date(now - 30 * 24 * 60 * 60 * 1000);
    const last7Days = new Date(now - 7 * 24 * 60 * 60 * 1000);

    // Bookings by status
    const bookingStatus = await Booking.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    // Bookings trend (last 30 days)
    const bookingsTrend = await Booking.aggregate([
      { $match: { createdAt: { $gte: last30Days } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
          revenue: { $sum: "$amount" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Users by role
    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 }
        }
      }
    ]);

    // Providers by category
    const providersByCategory = await Provider.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 }
        }
      }
    ]);

    // Revenue by category
    const revenueByCategory = await Booking.aggregate([
      { $match: { paymentStatus: "paid" } },
      {
        $lookup: {
          from: "providers",
          localField: "provider",
          foreignField: "_id",
          as: "providerData"
        }
      },
      { $unwind: "$providerData" },
      {
        $group: {
          _id: "$providerData.category",
          revenue: { $sum: "$amount" }
        }
      }
    ]);

    // Top providers by bookings
    const topProviders = await Booking.aggregate([
      {
        $group: {
          _id: "$provider",
          bookings: { $sum: 1 },
          revenue: { $sum: "$amount" }
        }
      },
      { $sort: { bookings: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "providers",
          localField: "_id",
          foreignField: "_id",
          as: "providerInfo"
        }
      },
      { $unwind: "$providerInfo" },
      {
        $project: {
          name: "$providerInfo.name",
          category: "$providerInfo.category",
          bookings: 1,
          revenue: 1
        }
      }
    ]);

    // Recent stats (last 7 days vs previous 7 days)
    const recentStats = await Booking.aggregate([
      {
        $facet: {
          last7Days: [
            { $match: { createdAt: { $gte: last7Days } } },
            { $group: { _id: null, count: { $sum: 1 }, revenue: { $sum: "$amount" } } }
          ],
          previous7Days: [
            { $match: { createdAt: { $gte: new Date(last7Days - 7 * 24 * 60 * 60 * 1000), $lt: last7Days } } },
            { $group: { _id: null, count: { $sum: 1 }, revenue: { $sum: "$amount" } } }
          ]
        }
      }
    ]);

    res.json({
      bookingStatus,
      bookingsTrend,
      usersByRole,
      providersByCategory,
      revenueByCategory,
      topProviders,
      recentStats: {
        last7Days: recentStats[0]?.last7Days[0] || { count: 0, revenue: 0 },
        previous7Days: recentStats[0]?.previous7Days[0] || { count: 0, revenue: 0 }
      }
    });
  } catch (err) {
    next(err);
  }
});

export default router;

