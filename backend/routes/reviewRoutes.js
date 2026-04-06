import express from "express";
import Review from "../models/Review.js";
import Provider from "../models/Provider.js";
import Booking from "../models/Booking.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all reviews (admin only)
router.get("/all", protect, admin, async (req, res, next) => {
  try {
    const reviews = await Review.find()
      .sort({ createdAt: -1 })
      .populate("user", "name")
      .populate("provider", "name")
      .populate("booking", "serviceName");
    res.json(reviews);
  } catch (err) {
    next(err);
  }
});

// Hide a review (admin only)
router.patch("/:id/hide", protect, admin, async (req, res, next) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, { hidden: true }, { new: true });
    if (!review) return res.status(404).json({ message: "Review not found" });
    res.json(review);
  } catch (err) {
    next(err);
  }
});

// Delete a review (admin only)
router.delete("/:id", protect, admin, async (req, res, next) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });
    res.json({ message: "Review deleted" });
  } catch (err) {
    next(err);
  }
});

router.get("/my", protect, async (req, res, next) => {
  try {
    const reviews = await Review.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("provider", "name category")
      .populate("booking", "serviceName");
    res.json(reviews);
  } catch (err) {
    next(err);
  }
});

router.get("/provider/my", protect, async (req, res, next) => {
  try {
    const provider = await Provider.findOne({ user: req.user._id });
    if (!provider) return res.status(404).json({ message: "Provider profile not found" });
    
    const reviews = await Review.find({ provider: provider._id })
      .sort({ createdAt: -1 })
      .populate("user", "name");
    res.json(reviews);
  } catch (err) {
    next(err);
  }
});

router.post("/", protect, async (req, res, next) => {
  try {
    const { providerId, bookingId, rating, comment } = req.body;
    if (!bookingId) return res.status(400).json({ message: "bookingId is required" });

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (String(booking.user) !== String(req.user._id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const resolvedProviderId = providerId || booking.provider;
    const provider = await Provider.findById(resolvedProviderId);
    if (!provider) return res.status(404).json({ message: "Provider not found" });

    if (String(booking.provider) !== String(provider._id)) {
      return res.status(400).json({ message: "Booking does not match provider" });
    }

    if (!(["completed", "confirmed", "accepted"].includes(booking.status))) {
      return res.status(400).json({ message: "Cannot review this booking yet" });
    }

    const exists = await Review.findOne({ booking: booking._id });
    if (exists) return res.status(400).json({ message: "Review already submitted" });

    const review = await Review.create({
      user: req.user._id,
      provider: provider._id,
      booking: booking._id,
      rating,
      comment
    });

    const stats = await Review.aggregate([
      { $match: { provider: provider._id } },
      {
        $group: {
          _id: "$provider",
          avg: { $avg: "$rating" },
          count: { $sum: 1 }
        }
      }
    ]);

    if (stats.length) {
      provider.rating = stats[0].avg;
      provider.ratingCount = stats[0].count;
      await provider.save();
    }

    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
});

export default router;

