import Watchlist from "../models/Watchlist.js";

export const addToWatchlist = async (req, res) => {
    try {
        const { movieId, movieTitle, posterPath } = req.body;
        console.log("Data diterima:", { movieId, movieTitle, posterPath });
        const userId = req.user.id;

        const existing = await Watchlist.findOne({ userId, movieId });
        if (existing) {
            return res.status(400).json({ message: "Film sudah ada di watchlist" });
        }

        const item = await Watchlist.create({ userId, movieId, movieTitle, posterPath });
        res.status(201).json(item);
    } catch (error) {
        console.log("Error:", error.message);
        res.status(500).json({ message: error.message });
    }
};

export const getWatchlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const watchlist = await Watchlist.find({ userId }).sort({ createdAt: -1 });
        res.json(watchlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const removeFromWatchlist = async (req, res) => {
    try {
        const { movieId } = req.params;
        const userId = req.user.id;

        await Watchlist.findOneAndDelete({ userId, movieId });
        res.json({ message: "Film dihapus dari watchlist" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const checkWatchlist = async (req, res) => {
    try {
        const { movieId } = req.params;
        const userId = req.user.id;

        const item = await Watchlist.findOne({ userId, movieId });
        res.json({ isInWatchlist: !!item });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};