import express from "express";
import { getPopularMovies, getMovieDetail, searchMovies } from "../controllers/MovieControllers.js";

const router = express.Router();

router.get("/popular", getPopularMovies);
router.get("/search", searchMovies);
router.get("/:id", getMovieDetail);

export default router;