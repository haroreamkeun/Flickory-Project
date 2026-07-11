import Rating from "../models/Rating.js";

export const addRating = async (req, res) => {
    try {
        const { movieId, rating, review } = req.body;
        const userId = req.user.id;

        const existingRating = await Rating.findOne({ userId, movieId });
        if (existingRating) {
            existingRating.rating = rating;
            existingRating.review = review;
            await existingRating.save();
            return res.json(existingRating);
        }

        const newRating = await Rating.create({ userId, movieId, rating, review });
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