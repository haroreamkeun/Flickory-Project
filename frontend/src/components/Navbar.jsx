import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link to="/" className="text-white text-2xl font-bold tracking-tight">
                    🎬 Flickory
                </Link>
                <div className="flex gap-4 items-center">
                    {user ? (
                        <>
                            <Link to="/profile" className="text-gray-300 hover:text-white transition-colors">
                                👤 {user.username}
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 text-white px-4 py-1.5 rounded-full font-medium hover:bg-red-400 transition-colors"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-gray-300 hover:text-white transition-colors">
                                Login
                            </Link>
                            <Link to="/register" className="bg-yellow-400 text-gray-900 px-4 py-1.5 rounded-full font-medium hover:bg-yellow-300 transition-colors">
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;