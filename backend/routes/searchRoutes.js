import express from "express";
import { searchProviders } from "../controllers/searchController.js";

const router = express.Router();

// Public search endpoint for providers
router.get("/providers", searchProviders);

export default router;

