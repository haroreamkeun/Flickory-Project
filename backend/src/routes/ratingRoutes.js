import express from "express";
import { addRating, getMovieRatings, getUserRating } from "../controllers/ratingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addRating);
router.get("/movie/:moveiId", getMovieRatings);
router.get("/movie/:moveiId", protect, getUserRating);

export default router;