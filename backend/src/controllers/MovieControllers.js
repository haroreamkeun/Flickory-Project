const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export const getPopularMovies = async (req, res) => {
    try {
        const response = await fetch(
            `${TMDB_BASE_URL}/movie/popular?language=en-US&page=1`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
                }
            }
        );
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch popular movies", error: error.message });
    }
};

export const searchMovies = async (req, res) => {
    try {
        const { q } = req.query;
        const response = await fetch(
            `${TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(q)}&language=en-US&page=1`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
                }
            }
        );
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: "Failed to search movies", error: error.message });
    }
};

export const getMovieDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await fetch(
            `${TMDB_BASE_URL}/movie/${id}?language=en-US`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
                }
            }
        );
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch movie detail", error: error.message });
    }
};