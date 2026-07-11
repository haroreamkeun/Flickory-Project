import express from "express";
import {
    getProfile,
    getUserRatings,
    getWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    checkWatchlist,
} from "../controllers/profileController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Semua route profile membutuhkan autentikasi
router.get("/me", protect, getProfile);
router.get("/ratings", protect, getUserRatings);
router.get("/watchlist", protect, getWatchlist);
router.post("/watchlist", protect, addToWatchlist);
router.delete("/watchlist/:movieId", protect, removeFromWatchlist);
router.get("/watchlist/:movieId/check", protect, checkWatchlist);

export default router;
