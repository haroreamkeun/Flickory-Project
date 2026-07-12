import Rating from "../models/Rating.js";

export const addRating = async (req, res) => {
    try {
        const { movieId, rating, review, isSpoiler } = req.body;
        const userId = req.user.id;

        const existingRating = await Rating.findOne({ userId, movieId });
        if (existingRating) {
            existingRating.rating = rating;
            existingRating.review = review;
            existingRating.isSpoiler = isSpoiler || false;
            await existingRating.save();
            return res.json(existingRating);
        }

        const newRating = await Rating.create({ userId, movieId, rating, review, isSpoiler: isSpoiler || false });
        res.status(201).json(newRating);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMovieRatings = async (req, res) => {
    try {
        const { movieId } = req.params;
        const ratings = await Rating.find({ movieId }).populate("userId", "username");
        res.json(ratings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserRating = async (req, res) => {
    try {
        const { movieId } = req.params;
        const userId = req.user.id;
        const rating = await Rating.findOne({ userId, movieId });
        res.json(rating);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteRating = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const rating = await Rating.findById(id);
        if (!rating) {
            return res.status(404).json({ message: "Rating tidak ditemukan" });
        }

        if (rating.userId.toString() !== userId) {
            return res.status(403).json({ message: "Tidak boleh hapus review orang lain" });
        }

        await Rating.findByIdAndDelete(id);
        res.json({ message: "Rating berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const voteRating = async (req, res) => {
    try {
        const { id } = req.params;
        const { type } = req.body;
        const userId = req.user.id;

        const rating = await Rating.findById(id);
        if (!rating) {
            return res.status(404).json({ message: "Rating tidak ditemukan" });
        }

        const alreadyLiked = rating.likes.includes(userId);
        const alreadyDisliked = rating.dislikes.includes(userId);

        if (type === "like") {
            if (alreadyLiked) {
                rating.likes = rating.likes.filter(id => id.toString() !== userId);
            } else {
                rating.likes.push(userId);
                rating.dislikes = rating.dislikes.filter(id => id.toString() !== userId);
            }
        } else if (type === "dislike") {
            if (alreadyDisliked) {
                rating.dislikes = rating.dislikes.filter(id => id.toString() !== userId);
            } else {
                rating.dislikes.push(userId);
                rating.likes = rating.likes.filter(id => id.toString() !== userId);
            }
        }

        await rating.save();
        res.json(rating);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};