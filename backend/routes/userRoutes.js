import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  addWalletFunds,
  getMyFavorites,
  getMyWallet,
  toggleFavoriteProvider,
  updateMyProfile,
  uploadAvatarController
} from "../controllers/userController.js";
import { uploadAvatar } from "../config/upload.js";

const router = express.Router();

router.use(protect);

router.patch("/me", updateMyProfile);
router.post("/upload-avatar", uploadAvatar.single("avatar"), uploadAvatarController);
router.get("/favorites", getMyFavorites);
router.post("/favorites/:providerId/toggle", toggleFavoriteProvider);
router.get("/wallet", getMyWallet);
router.post("/wallet/add", addWalletFunds);

export default router;
