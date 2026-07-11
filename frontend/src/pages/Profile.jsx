import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function Profile() {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("ratings");
    const [profile, setProfile] = useState(null);
    const [ratings, setRatings] = useState([]);
    const [watchlist, setWatchlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Redirect ke login kalau belum login
    useEffect(() => {
        if (!authLoading && !user) {
            navigate("/login");
        }
    }, [user, authLoading, navigate]);

    // Fetch semua data profile
    useEffect(() => {
        if (!user) return;

        const fetchProfileData = async () => {
            try {
                const [profileRes, ratingsRes, watchlistRes] = await Promise.all([
                    api.get("/profile/me"),
                    api.get("/profile/ratings"),
                    api.get("/profile/watchlist"),
                ]);
                setProfile(profileRes.data);
                setRatings(ratingsRes.data);
                setWatchlist(watchlistRes.data);
            } catch (err) {
                setError("Gagal memuat data profil");
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [user]);

    const handleRemoveWatchlist = async (movieId) => {
        try {
            await api.delete(`/profile/watchlist/${movieId}`);
            setWatchlist((prev) => prev.filter((item) => item.movieId !== movieId));
            // Update stats
            setProfile((prev) => ({
                ...prev,
                stats: { ...prev.stats, watchlistCount: prev.stats.watchlistCount - 1 },
            }));
        } catch {
            alert("Gagal menghapus dari watchlist");
        }
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={i < rating ? "text-yellow-400" : "text-gray-600"}>
                ★
            </span>
        ));
    };

    const getInitials = (username) => {
        return username ? username.charAt(0).toUpperCase() : "?";
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
        });
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Memuat profil...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <p className="text-red-400 text-xl">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 px-6 py-8">
            <div className="max-w-4xl mx-auto">

                {/* Profile Card */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-8">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

                        {/* Avatar Inisial */}
                        <div className="w-20 h-20 rounded-full bg-yellow-400 flex items-center justify-center text-gray-900 text-3xl font-bold flex-shrink-0 select-none">
                            {getInitials(profile?.username)}
                        </div>

                        {/* Info */}
                        <div className="flex-1 text-center sm:text-left">
                            <h1 className="text-white text-2xl font-bold">{profile?.username}</h1>
                            <p className="text-gray-400 mt-1 text-sm">📧 {profile?.email}</p>
                            <p className="text-gray-500 text-sm mt-1">
                                📅 Bergabung sejak {formatDate(profile?.createdAt)}
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-8 sm:gap-6 text-center flex-shrink-0">
                            <div>
                                <p className="text-yellow-400 text-3xl font-bold">
                                    {profile?.stats?.ratingCount ?? 0}
                                </p>
                                <p className="text-gray-400 text-xs mt-1 uppercase tracking-wide">Rating</p>
                            </div>
                            <div className="w-px bg-gray-700 hidden sm:block" />
                            <div>
                                <p className="text-yellow-400 text-3xl font-bold">
                                    {profile?.stats?.watchlistCount ?? 0}
                                </p>
                                <p className="text-gray-400 text-xs mt-1 uppercase tracking-wide">Watchlist</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 mb-6 bg-gray-900 border border-gray-800 rounded-xl p-1 w-fit">
                    <button
                        id="tab-ratings"
                        onClick={() => setActiveTab("ratings")}
                        className={`px-6 py-2 rounded-lg font-medium text-sm transition-colors ${
                            activeTab === "ratings"
                                ? "bg-yellow-400 text-gray-900"
                                : "text-gray-400 hover:text-white"
                        }`}
                    >
                        🎬 Rating Saya
                    </button>
                    <button
                        id="tab-watchlist"
                        onClick={() => setActiveTab("watchlist")}
                        className={`px-6 py-2 rounded-lg font-medium text-sm transition-colors ${
                            activeTab === "watchlist"
                                ? "bg-yellow-400 text-gray-900"
                                : "text-gray-400 hover:text-white"
                        }`}
                    >
                        📋 Watchlist
                    </button>
                </div>

                {/* Tab: Rating Saya */}
                {activeTab === "ratings" && (
                    <div>
                        {ratings.length === 0 ? (
                            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-16 text-center">
                                <p className="text-5xl mb-4">🎬</p>
                                <p className="text-gray-300 text-lg font-medium">Belum ada rating</p>
                                <p className="text-gray-600 text-sm mt-2">
                                    Jelajahi film dan beri rating pertamamu!
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {ratings.map((item) => (
                                    <Link
                                        key={item._id}
                                        to={`/movie/${item.movieId}`}
                                        className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex gap-4 hover:border-gray-700 transition-colors cursor-pointer"
                                    >
                                        {/* Poster */}
                                        <img
                                            src={
                                                item.movie?.posterPath
                                                    ? `https://image.tmdb.org/t/p/w92${item.movie.posterPath}`
                                                    : `https://placehold.co/92x138/1f2937/6b7280?text=?`
                                            }
                                            alt={item.movie?.title}
                                            className="w-12 h-18 object-cover rounded-lg flex-shrink-0"
                                        />
                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0">
                                                    <h3 className="text-white font-semibold truncate hover:text-yellow-400 transition-colors">
                                                        {item.movie?.title}
                                                    </h3>
                                                    <p className="text-gray-500 text-xs mt-0.5">
                                                        {item.movie?.releaseYear}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-1 flex-shrink-0">
                                                    <span className="text-lg leading-none">
                                                        {renderStars(item.rating)}
                                                    </span>
                                                    <span className="text-gray-500 text-xs ml-1">
                                                        {item.rating}/5
                                                    </span>
                                                </div>
                                            </div>
                                            {item.review && (
                                                <p className="text-gray-400 text-sm mt-2 italic line-clamp-2">
                                                    "{item.review}"
                                                </p>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Tab: Watchlist */}
                {activeTab === "watchlist" && (
                    <div>
                        {watchlist.length === 0 ? (
                            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-16 text-center">
                                <p className="text-5xl mb-4">📋</p>
                                <p className="text-gray-300 text-lg font-medium">Watchlist masih kosong</p>
                                <p className="text-gray-600 text-sm mt-2">
                                    Tambahkan film dari halaman detail film!
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                                {watchlist.map((item) => (
                                    <div
                                        key={item._id}
                                        className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-colors flex flex-col justify-between"
                                    >
                                        <Link to={`/movie/${item.movieId}`} className="flex-1 flex flex-col">
                                            <img
                                                src={
                                                    item.posterPath
                                                        ? `https://image.tmdb.org/t/p/w185${item.posterPath}`
                                                        : `https://placehold.co/185x278/1f2937/6b7280?text=?`
                                                }
                                                alt={item.title}
                                                className="w-full aspect-[2/3] object-cover hover:opacity-90 transition-opacity"
                                            />
                                            <div className="p-3 flex-1 flex flex-col justify-between">
                                                <p className="text-white text-xs font-medium line-clamp-2 leading-snug hover:text-yellow-400 transition-colors">
                                                    {item.title}
                                                </p>
                                            </div>
                                        </Link>
                                        <div className="px-3 pb-3">
                                            <button
                                                onClick={() => handleRemoveWatchlist(item.movieId)}
                                                className="w-full text-[10px] text-red-400 hover:text-red-300 hover:bg-red-500/10 py-1 rounded transition-colors"
                                            >
                                                🗑️ Hapus
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Profile;