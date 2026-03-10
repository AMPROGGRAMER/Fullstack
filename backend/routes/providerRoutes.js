import express from "express";
import Provider from "../models/Provider.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/providers?category=Plumbing&city=Bengaluru&search=pipe
router.get("/", async (req, res, next) => {
  try {
    const { category, city, search } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (city) filter.city = city;
    if (search) filter.name = { $regex: search, $options: "i" };
    const providers = await Provider.find(filter).sort({ rating: -1 }).limit(200);
    res.json(providers);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const provider = await Provider.findById(req.params.id);
    if (!provider) return res.status(404).json({ message: "Provider not found" });
    res.json(provider);
  } catch (err) {
    next(err);
  }
});

// provider creates/updates their profile
router.post("/", protect, requireRole("provider"), async (req, res, next) => {
  try {
    const existing = await Provider.findOne({ user: req.user._id });
    if (existing) {
      Object.assign(existing, req.body);
      const updated = await existing.save();
      return res.json(updated);
    }
    const created = await Provider.create({ ...req.body, user: req.user._id });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

export default router;

