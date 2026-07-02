import express from "express";

const router = express.Router();

router.get("/popular", async (req, res) => {
    try {
        const response = await fetch(
            "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1",
            {
                headers: {
                    Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
                },
            }
        );

        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: "Gagal ambil data dari TMDB", error: error.message });
    }
});

export default router;