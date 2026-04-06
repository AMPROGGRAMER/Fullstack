import express from "express";
import { protect, requireRole, admin } from "../middleware/authMiddleware.js";
import {
  createService,
  deleteService,
  deleteServiceAdmin,
  getProviderServices,
  getPublicServices,
  updateService
} from "../controllers/serviceController.js";

const router = express.Router();

// Public routes
router.get("/", getPublicServices);

// Provider routes
router.get("/my", protect, requireRole("provider"), getProviderServices);
router.post("/", protect, requireRole("provider"), createService);
router.patch("/:id", protect, requireRole("provider"), updateService);
router.delete("/:id", protect, requireRole("provider"), deleteService);

// Admin routes
router.delete("/admin/:id", protect, admin, deleteServiceAdmin);

export default router;
