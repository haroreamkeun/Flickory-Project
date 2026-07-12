import express from "express";
import { addToWatchlist, getWatchlist, removeFromWatchlist, checkWatchlist } from "../controllers/watchlistControllers.js";
import { protect } from "../middleware/authMiddleware.js";


const router = express.Router();

router.post("/", protect, addToWatchlist);
router.get("/", protect, getWatchlist);
router.delete("/:movieId", protect, removeFromWatchlist);
router.get("/check/:movieId", protect, checkWatchlist);

export default router;