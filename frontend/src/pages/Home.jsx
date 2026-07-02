import { useState, useEffect } from "react";
import api from "../services/api";
import MovieCard from "../components/MovieCard";

function Home() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await api.get("/movies/popular");
                setMovies(response.data.results);
            } catch (err) {
                setError("Gagal memuat data film");
            } finally {
                setLoading(false);
            }
        };
        fetchMovies();
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
            <p className="text-white text-xl">Loading...</p>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
            <p className="text-red-400 text-xl">{error}</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-950 px-6 py-8">
            <h1 className="text-white text-3xl font-bold mb-8">Film Populer</h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>
        </div>
    );
}

export default Home;