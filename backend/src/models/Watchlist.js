import mongoose from "mongoose";

const watchlistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    movieId: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    posterPath: {
        type: String,
        required: true
    }
}, { timestamps: true });

export default mongoose.model("Watchlist", watchlistSchema);