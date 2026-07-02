import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import movieRoutes from "./routes/movieRoutes.js";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


app.use("/api/movies", movieRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.json({ message: "Server backend jalan!" });
});

app.listen(PORT, () => {
    console.log(`Server jalan di http://localhost:${PORT}`);
});
