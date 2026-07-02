import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        movieId: {
            type: Number,
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        review: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

export default mongoose.model("Rating", ratingSchema);