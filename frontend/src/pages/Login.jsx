
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email.trim() || !password.trim()) {
            setError("Please fill in all fields.");
            return;
        }
        setLoading(true);
        setError("");
        try {
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (!response.ok) {
                setError(data.error || "Login failed. Please try again.");
            } else {
                localStorage.setItem("token", data.token);
                window.location.href = "/chat";
            }
        } catch (err) {
            setError("Could not connect to server.");
        }
        setLoading(false);
    };

    return (
        <div className="auth-page">
            <div className="auth-bg">
                <div className="auth-glow glow-1"></div>
                <div className="auth-glow glow-2"></div>
                <div className="auth-grid"></div>
            </div>

            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-brand">
                        <div className="auth-logo">
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                                <circle cx="16" cy="16" r="15" stroke="#2dd4bf" strokeWidth="1.5"/>
                                <circle cx="16" cy="16" r="6" fill="#2dd4bf" opacity="0.15"/>
                                <circle cx="16" cy="16" r="3" fill="#2dd4bf"/>
                                <line x1="16" y1="4" x2="16" y2="10" stroke="#2dd4bf" strokeWidth="1.5" strokeLinecap="round"/>
                                <line x1="16" y1="22" x2="16" y2="28" stroke="#2dd4bf" strokeWidth="1.5" strokeLinecap="round"/>
                                <line x1="4" y1="16" x2="10" y2="16" stroke="#2dd4bf" strokeWidth="1.5" strokeLinecap="round"/>
                                <line x1="22" y1="16" x2="28" y2="16" stroke="#2dd4bf" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                        </div>
                        <span className="auth-brand-name">Logix</span>
                    </div>

                    <div className="auth-header">
                        <h1 className="auth-title">Welcome back</h1>
                        <p className="auth-subtitle">Sign in to continue your conversations</p>
                    </div>

                    <form className="auth-form" onSubmit={handleLogin}>
                        <div className="input-group">
                            <label className="input-label">Email</label>
                            <div className="input-wrapper">
                                <i className="fa-regular fa-envelope input-icon"></i>
                                <input
                                    type="email"
                                    className="auth-input"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Password</label>
                            <div className="input-wrapper">
                                <i className="fa-solid fa-lock input-icon"></i>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="auth-input"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex={-1}
                                >
                                    <i className={showPassword ? "fa-regular fa-eye-slash" : "fa-regular fa-eye"}></i>
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="auth-error">
                                <i className="fa-solid fa-circle-exclamation"></i>
                                {error}
                            </div>
                        )}

                        <button type="submit" className="auth-btn" disabled={loading}>
                            {loading ? (
                                <span className="btn-loading">
                                    <span className="spinner"></span>
                                    Signing in...
                                </span>
                            ) : (
                                <>
                                    Sign in
                                    <i className="fa-solid fa-arrow-right"></i>
                                </>
                            )}
                        </button>
                    </form>

                    <p className="auth-switch">
                        Don't have an account?{" "}
                        <Link to="/signup" className="auth-link">Create one</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;