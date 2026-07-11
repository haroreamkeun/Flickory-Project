import User from "../models/User.js";
import Rating from "../models/Rating.js";
import Watchlist from "../models/Watchlist.js";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const fetchMovieDetail = async (movieId) => {
    const response = await fetch(
        `${TMDB_BASE_URL}/movie/${movieId}?language=en-US`,
        {
            headers: {
                Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
            },
        }
    );
    return response.json();
};

// GET /api/profile/me
export const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User tidak ditemukan" });
        }

        const ratingCount = await Rating.countDocuments({ userId });
        const watchlistCount = await Watchlist.countDocuments({ userId });

        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
            stats: {
                ratingCount,
                watchlistCount,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/profile/ratings
export const getUserRatings = async (req, res) => {
    try {
        const userId = req.user.id;
        const ratings = await Rating.find({ userId }).sort({ createdAt: -1 });

        const ratingsWithMovies = await Promise.all(
            ratings.map(async (rating) => {
                try {
                    const movie = await fetchMovieDetail(rating.movieId);
                    return {
                        _id: rating._id,
                        movieId: rating.movieId,
                        rating: rating.rating,
                        review: rating.review,
                        createdAt: rating.createdAt,
                        movie: {
                            title: movie.title || "Unknown",
                            posterPath: movie.poster_path || null,
                            releaseYear: movie.release_date?.split("-")[0] || "",
                        },
                    };
                } catch {
                    return {
                        _id: rating._id,
                        movieId: rating.movieId,
                        rating: rating.rating,
                        review: rating.review,
                        createdAt: rating.createdAt,
                        movie: { title: "Film Tidak Diketahui", posterPath: null, releaseYear: "" },
                    };
                }
            })
        );

        res.json(ratingsWithMovies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/profile/watchlist
export const getWatchlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const watchlist = await Watchlist.find({ userId }).sort({ createdAt: -1 });
        res.json(watchlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST /api/profile/watchlist
export const addToWatchlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { movieId, title, posterPath } = req.body;

        const existing = await Watchlist.findOne({ userId, movieId });
        if (existing) {
            return res.status(400).json({ message: "Film sudah ada di watchlist" });
        }

        const item = await Watchlist.create({ userId, movieId, title, posterPath });
        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE /api/profile/watchlist/:movieId
export const removeFromWatchlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { movieId } = req.params;

        const item = await Watchlist.findOneAndDelete({ userId, movieId: Number(movieId) });
        if (!item) {
            return res.status(404).json({ message: "Film tidak ditemukan di watchlist" });
        }

        res.json({ message: "Film dihapus dari watchlist" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/profile/watchlist/:movieId/check
export const checkWatchlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { movieId } = req.params;
        const item = await Watchlist.findOne({ userId, movieId: Number(movieId) });
        res.json({ inWatchlist: !!item });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
