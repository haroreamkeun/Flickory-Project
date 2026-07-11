import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import movieRoutes from "./routes/MovieRoutes.js";
import connectDB from "./config/db.js";
import authRoutes from "./routes/AuthRoutes.js";
import ratingRoutes from "./routes/ratingRoutes.js";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


app.use("/api/movies", movieRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/ratings", ratingRoutes);

app.get("/", (req, res) => {
    res.json({ message: "Server backend jalan!" });
});

app.listen(PORT, () => {
    console.log(`Server jalan di http://localhost:${PORT}`);
});
