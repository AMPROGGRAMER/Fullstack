import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getMyNotifications,
  markAllRead,
  markRead
} from "../controllers/notificationController.js";

const router = express.Router();

router.use(protect);

router.get("/my", getMyNotifications);
router.patch("/:id/read", markRead);
router.patch("/read-all", markAllRead);

export default router;
