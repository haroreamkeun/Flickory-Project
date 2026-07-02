import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await api.post("/auth/login", form);
            login(response.data, response.data.token);
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Login gagal");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
            <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md">
                <h1 className="text-white text-3xl font-bold mb-2">Login</h1>
                <p className="text-gray-400 mb-8">Selamat datang kembali di Flickory</p>

                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-gray-400 text-sm mb-1 block">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            placeholder="email@kamu.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-gray-400 text-sm mb-1 block">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-yellow-400 text-gray-900 py-3 rounded-lg font-bold hover:bg-yellow-300 transition-colors disabled:opacity-50 mt-2"
                    >
                        {loading ? "Loading..." : "Login"}
                    </button>
                </form>

                <p className="text-gray-400 text-center mt-6">
                    Belum punya akun?{" "}
                    <Link to="/register" className="text-yellow-400 hover:underline">
                        Daftar
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;