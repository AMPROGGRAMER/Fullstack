import express from "express";
import Booking from "../models/Booking.js";
import Provider from "../models/Provider.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, async (req, res, next) => {
  try {
    const { providerId, serviceName, date, amount, city, notes } = req.body;
    const provider = await Provider.findById(providerId);
    if (!provider) return res.status(404).json({ message: "Provider not found" });

    const booking = await Booking.create({
      user: req.user._id,
      provider: provider._id,
      serviceName,
      date,
      amount,
      city,
      notes
    });

    res.status(201).json(booking);
  } catch (err) {
    next(err);
  }
});

router.get("/my", protect, async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("provider", "name category city location priceFrom priceUnit emoji")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    next(err);
  }
});

export default router;

