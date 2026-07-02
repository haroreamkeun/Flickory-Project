import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/original";

function MovieDetail() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const response = await api.get(`/movies/${id}`);
                setMovie(response.data);
            } catch (err) {
                setError("Gagal memuat detail film");
            } finally {
                setLoading(false);
            }
        };
        fetchMovie();
    }, [id]);

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
        <div className="min-h-screen bg-gray-950">
            <div
                className="relative h-96 bg-cover bg-center"
                style={{ backgroundImage: `url(${BACKDROP_BASE_URL}${movie.backdrop_path})` }}
            >
                <div className="absolute inset-0 bg-black/60" />
            </div>

            <div className="max-w-5xl mx-auto px-6 -mt-32 relative z-10">
                <div className="flex gap-8">
                    <img
                        src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                        alt={movie.title}
                        className="w-48 rounded-xl shadow-2xl flex-shrink-0"
                    />
                    <div className="pt-32">
                        <h1 className="text-white text-4xl font-bold">{movie.title}</h1>
                        <div className="flex gap-4 mt-3 text-gray-400 text-sm">
                            <span>⭐ {movie.vote_average?.toFixed(1)}</span>
                            <span>📅 {movie.release_date}</span>
                            <span>🕐 {movie.runtime} menit</span>
                        </div>
                        <div className="flex gap-2 mt-3 flex-wrap">
                            {movie.genres?.map((genre) => (
                                <span key={genre.id} className="bg-yellow-400/20 text-yellow-400 px-3 py-1 rounded-full text-xs">
                                    {genre.name}
                                </span>
                            ))}
                        </div>
                        <p className="text-gray-300 mt-4 leading-relaxed">{movie.overview}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MovieDetail;