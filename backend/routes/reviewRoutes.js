import express from "express";
import Review from "../models/Review.js";
import Provider from "../models/Provider.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, async (req, res, next) => {
  try {
    const { providerId, rating, comment } = req.body;
    const provider = await Provider.findById(providerId);
    if (!provider) return res.status(404).json({ message: "Provider not found" });

    const review = await Review.create({
      user: req.user._id,
      provider: provider._id,
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

