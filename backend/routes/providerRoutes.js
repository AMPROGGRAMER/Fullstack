import express from "express";
import { protect, requireRole } from "../middleware/authMiddleware.js";
import {
  getProviders,
  getProviderById,
  upsertProviderProfile
} from "../controllers/providerController.js";

const router = express.Router();

// List providers with optional category/city/search filters
router.get("/", getProviders);

// Convenience route to fetch by category path segment
router.get("/category/:category", (req, res, next) => {
  // Delegate to the same controller using a normalized query object
  req.query.category = req.params.category;
  return getProviders(req, res, next);
});

// Fetch a single provider profile
router.get("/:id", getProviderById);

// Provider creates/updates their profile
router.post("/", protect, requireRole("provider"), upsertProviderProfile);

export default router;

