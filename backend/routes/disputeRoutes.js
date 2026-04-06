import express from "express";
import Dispute from "../models/Dispute.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get my disputes (user sees their own, admin sees all)
router.get("/my", protect, async (req, res, next) => {
  try {
    const query = req.user.role === "admin" ? {} : { user: req.user._id };
    const disputes = await Dispute.find(query)
      .sort({ createdAt: -1 })
      .populate("user", "name")
      .populate("booking", "serviceName");
    res.json(disputes);
  } catch (err) {
    next(err);
  }
});

// Create a dispute
router.post("/", protect, async (req, res, next) => {
  try {
    const { bookingId, reason } = req.body;
    if (!bookingId || !reason) {
      return res.status(400).json({ message: "bookingId and reason are required" });
    }
    
    const dispute = await Dispute.create({
      user: req.user._id,
      booking: bookingId,
      reason,
      status: "open"
    });
    
    const populated = await Dispute.findById(dispute._id)
      .populate("user", "name")
      .populate("booking", "serviceName");
    
    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
});

// Resolve a dispute (admin only)
router.patch("/:id/resolve", protect, admin, async (req, res, next) => {
  try {
    const dispute = await Dispute.findByIdAndUpdate(
      req.params.id,
      { status: "resolved", resolvedAt: new Date() },
      { new: true }
    );
    if (!dispute) return res.status(404).json({ message: "Dispute not found" });
    res.json(dispute);
  } catch (err) {
    next(err);
  }
});

export default router;
