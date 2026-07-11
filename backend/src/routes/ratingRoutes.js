import express from "express";
import { addRating, getMovieRatings, getUserRating, deleteRating, voteRating } from "../controllers/ratingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addRating);
router.get("/movie/:movieId", getMovieRatings);
router.get("/user/:movieId", protect, getUserRating);
router.delete("/:id", protect, deleteRating);
router.put("/:id/vote", protect, voteRating);

export default router;