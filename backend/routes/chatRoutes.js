import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getMyThreads, getOrCreateThread, getThreadMessages } from "../controllers/chatController.js";

const router = express.Router();

router.use(protect);

router.get("/threads", getMyThreads);
router.post("/thread/:otherUserId", getOrCreateThread);
router.get("/thread/:chatId/messages", getThreadMessages);

export default router;
