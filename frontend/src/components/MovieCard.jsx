import { useNavigate } from "react-router-dom";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

function MovieCard({ movie }) {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/movie/${movie.id}`)}
            className="cursor-pointer group"
        >
            <div className="relative overflow-hidden rounded-lg">
                <img
                    src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />
            </div>
            <div className="mt-2">
                <h3 className="text-white text-sm font-medium truncate">{movie.title}</h3>
                <p className="text-yellow-400 text-xs mt-1">⭐ {movie.vote_average.toFixed(1)}</p>
            </div>
        </div>
    );
}

export default MovieCard;