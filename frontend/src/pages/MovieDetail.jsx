import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/original";

function SpoilerText({ text }) {
    const [revealed, setRevealed] = useState(false);
    return (
        <div className="relative">
            <p className={`text-gray-300 text-sm ${!revealed ? "blur-sm select-none" : ""}`}>
                {text}
            </p>
            {!revealed && (
                <button
                    onClick={() => setRevealed(true)}
                    className="absolute inset-0 flex items-center justify-center text-yellow-400 text-sm font-medium hover:text-yellow-300"
                >
                    ⚠️ Spoiler — Klik untuk lihat
                </button>
            )}
        </div>
    );
}

function MovieDetail() {
    const { id } = useParams();
    const { user } = useAuth();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [ratings, setRatings] = useState([]);
    const [userRating, setUserRating] = useState(null);
    const [form, setForm] = useState({ rating: 5, review: "", isSpoiler: false });
    const [submitting, setSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [isInWatchlist, setIsInWatchlist] = useState(false);
    const [watchlistLoading, setWatchlistLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [movieRes, ratingsRes] = await Promise.all([
                    api.get(`/movies/${id}`),
                    api.get(`/ratings/movie/${id}`)
                ]);
                setMovie(movieRes.data);
                setRatings(ratingsRes.data);
            } catch (err) {
                setError("Gagal memuat detail film");
                return;
            } finally {
                setLoading(false);
            }

            if (user) {
                try {
                    const userRatingRes = await api.get(`/ratings/user/${id}`);
                    if (userRatingRes.data) {
                        setUserRating(userRatingRes.data);
                        setForm({
                            rating: userRatingRes.data.rating,
                            review: userRatingRes.data.review,
                            isSpoiler: userRatingRes.data.isSpoiler || false
                        });
                    }
                } catch (err) { }

                try {
                    const watchlistRes = await api.get(`/profile/watchlist/${id}/check`);
                    setIsInWatchlist(watchlistRes.data.inWatchlist);
                } catch (err) { }
            }
        };
        fetchData();
    }, [id, user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post("/ratings", {
                movieId: Number(id),
                rating: form.rating,
                review: form.review,
                isSpoiler: form.isSpoiler
            });
            const ratingsRes = await api.get(`/ratings/movie/${id}`);
            setRatings(ratingsRes.data);
            setSubmitSuccess(true);
            setTimeout(() => setSubmitSuccess(false), 3000);
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteRating = async (ratingId) => {
        if (!confirm("Yakin mau hapus review ini?")) return;
        try {
            await api.delete(`/ratings/${ratingId}`);
            const ratingsRes = await api.get(`/ratings/movie/${id}`);
            setRatings(ratingsRes.data);
            setUserRating(null);
            setForm({ rating: 5, review: "", isSpoiler: false });
        } catch (err) {
            console.error(err);
        }
    };

    const handleVote = async (ratingId, type) => {
        if (!user) return;
        try {
            const res = await api.put(`/ratings/${ratingId}/vote`, { type });
            setRatings(ratings.map(r => r._id === ratingId ? res.data : r));
        } catch (err) {
            console.error(err);
        }
    };

    const handleWatchlist = async () => {
        if (!user) return;
        setWatchlistLoading(true);
        try {
            if (isInWatchlist) {
                await api.delete(`/profile/watchlist/${id}`);
                setIsInWatchlist(false);
            } else {
                await api.post("/profile/watchlist", {
                    movieId: Number(id),
                    title: movie.title,
                    posterPath: movie.poster_path
                });
                setIsInWatchlist(true);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setWatchlistLoading(false);
        }
    };

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

                        {user && (
                            <button
                                onClick={handleWatchlist}
                                disabled={watchlistLoading}
                                className={`mt-4 px-6 py-2 rounded-full font-medium text-sm transition-colors disabled:opacity-50 ${isInWatchlist
                                    ? "bg-yellow-400 text-gray-900 hover:bg-yellow-300"
                                    : "border border-gray-600 text-gray-300 hover:border-yellow-400 hover:text-yellow-400"
                                    }`}
                            >
                                {watchlistLoading ? "..." : isInWatchlist ? "✓ Di Watchlist" : "+ Tambah ke Watchlist"}
                            </button>
                        )}
                    </div>
                </div>

                <div className="mt-12 pb-12">
                    <h2 className="text-white text-2xl font-bold mb-6">Rating & Review</h2>

                    {user ? (
                        <form onSubmit={handleSubmit} className="bg-gray-900 rounded-xl p-6 mb-8">
                            <h3 className="text-white font-semibold mb-4">
                                {userRating ? "Edit Rating Kamu" : "Kasih Rating"}
                            </h3>

                            {submitSuccess && (
                                <div className="bg-green-500/10 border border-green-500 text-green-400 px-4 py-3 rounded-lg mb-4">
                                    Rating berhasil disimpan! ✅
                                </div>
                            )}

                            <div className="mb-4">
                                <label className="text-gray-400 text-sm mb-2 block">Rating (1-5)</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setForm({ ...form, rating: star })}
                                            className={`text-3xl transition-transform hover:scale-110 ${star <= form.rating ? "text-yellow-400" : "text-gray-600"}`}
                                        >
                                            ★
                                        </button>
                                    ))}
                                    <span className="text-gray-400 text-sm self-center ml-2">
                                        {form.rating}/5
                                    </span>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="text-gray-400 text-sm mb-2 block">Review (opsional)</label>
                                <textarea
                                    value={form.review}
                                    onChange={(e) => setForm({ ...form, review: e.target.value })}
                                    className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
                                    rows={4}
                                    placeholder="Tulis review kamu..."
                                />
                            </div>

                            <div className="mb-4 flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="isSpoiler"
                                    checked={form.isSpoiler}
                                    onChange={(e) => setForm({ ...form, isSpoiler: e.target.checked })}
                                    className="w-4 h-4 accent-yellow-400"
                                />
                                <label htmlFor="isSpoiler" className="text-gray-400 text-sm cursor-pointer">
                                    ⚠️ Review ini mengandung spoiler
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="bg-yellow-400 text-gray-900 px-6 py-2 rounded-full font-bold hover:bg-yellow-300 transition-colors disabled:opacity-50"
                            >
                                {submitting ? "Menyimpan..." : "Simpan Rating"}
                            </button>
                        </form>
                    ) : (
                        <div className="bg-gray-900 rounded-xl p-6 mb-8 text-center">
                            <p className="text-gray-400">
                                <a href="/login" className="text-yellow-400 hover:underline">Login</a> untuk kasih rating & review
                            </p>
                        </div>
                    )}

                    <div className="space-y-4">
                        {ratings.length === 0 ? (
                            <p className="text-gray-500 text-center">Belum ada review. Jadilah yang pertama!</p>
                        ) : (
                            ratings.map((r) => (
                                <div key={r._id} className="bg-gray-900 rounded-xl p-5">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-white font-medium">
                                                👤 {r.userId?.username || "User"}
                                            </span>
                                            {r.isSpoiler && (
                                                <span className="bg-yellow-400/20 text-yellow-400 text-xs px-2 py-0.5 rounded-full">
                                                    ⚠️ Spoiler
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-yellow-400">
                                                {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                                            </span>
                                            {user && r.userId?._id === user._id && (
                                                <button
                                                    onClick={() => handleDeleteRating(r._id)}
                                                    className="text-red-400 hover:text-red-300 text-sm transition-colors"
                                                >
                                                    🗑️ Hapus
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {r.review && (
                                        <div className="mb-3">
                                            {r.isSpoiler ? (
                                                <SpoilerText text={r.review} />
                                            ) : (
                                                <p className="text-gray-300 text-sm">{r.review}</p>
                                            )}
                                        </div>
                                    )}

                                    <div className="flex gap-4 mt-2">
                                        <button
                                            onClick={() => handleVote(r._id, "like")}
                                            className={`flex items-center gap-1 text-sm transition-colors ${user && r.likes?.includes(user._id)
                                                ? "text-green-400"
                                                : "text-gray-500 hover:text-green-400"
                                                }`}
                                        >
                                            👍 {r.likes?.length || 0}
                                        </button>
                                        <button
                                            onClick={() => handleVote(r._id, "dislike")}
                                            className={`flex items-center gap-1 text-sm transition-colors ${user && r.dislikes?.includes(user._id)
                                                ? "text-red-400"
                                                : "text-gray-500 hover:text-red-400"
                                                }`}
                                        >
                                            👎 {r.dislikes?.length || 0}
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MovieDetail;