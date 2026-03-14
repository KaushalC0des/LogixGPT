
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";

function Signup() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const getPasswordStrength = (pwd) => {
        if (!pwd) return { level: 0, label: "", color: "" };
        let score = 0;
        if (pwd.length >= 8) score++;
        if (/[A-Z]/.test(pwd)) score++;
        if (/[0-9]/.test(pwd)) score++;
        if (/[^A-Za-z0-9]/.test(pwd)) score++;
        if (score <= 1) return { level: 1, label: "Weak", color: "#ef4444" };
        if (score === 2) return { level: 2, label: "Fair", color: "#f59e0b" };
        if (score === 3) return { level: 3, label: "Good", color: "#2dd4bf" };
        return { level: 4, label: "Strong", color: "#22c55e" };
    };

    const strength = getPasswordStrength(password);

    const handleSignup = async (e) => {
        e.preventDefault();
        if (!username.trim() || !email.trim() || !password.trim()) {
            setError("Please fill in all fields.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }
        setLoading(true);
        setError("");
        try {
            const response = await fetch("http://localhost:5000/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name : username, email, password }),
            });
            const data = await response.json();
            if (!response.ok) {
                setError(data.error || "Signup failed. Please try again.");
            } else {
                localStorage.setItem("token", data.token);
                navigate("/");
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
                        <h1 className="auth-title">Create account</h1>
                        <p className="auth-subtitle">Start chatting with Logix AI today</p>
                    </div>

                    <form className="auth-form" onSubmit={handleSignup}>
                        <div className="input-group">
                            <label className="input-label">Username</label>
                            <div className="input-wrapper">
                                <i className="fa-regular fa-user input-icon"></i>
                                <input
                                    type="text"
                                    className="auth-input"
                                    placeholder="Your name"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    autoComplete="username"
                                />
                            </div>
                        </div>

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
                                    placeholder="Min. 6 characters"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="new-password"
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
                            {password && (
                                <div className="password-strength">
                                    <div className="strength-bars">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div
                                                key={i}
                                                className="strength-bar"
                                                style={{
                                                    background: i <= strength.level ? strength.color : "rgba(255,255,255,0.1)",
                                                    transition: "background 0.3s ease"
                                                }}
                                            ></div>
                                        ))}
                                    </div>
                                    <span className="strength-label" style={{ color: strength.color }}>
                                        {strength.label}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="input-group">
                            <label className="input-label">Confirm Password</label>
                            <div className="input-wrapper">
                                <i className="fa-solid fa-lock input-icon"></i>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="auth-input"
                                    placeholder="Repeat your password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    autoComplete="new-password"
                                />
                                {confirmPassword && (
                                    <span className="match-icon">
                                        {password === confirmPassword
                                            ? <i className="fa-solid fa-check" style={{ color: "#22c55e" }}></i>
                                            : <i className="fa-solid fa-xmark" style={{ color: "#ef4444" }}></i>
                                        }
                                    </span>
                                )}
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
                                    Creating account...
                                </span>
                            ) : (
                                <>
                                    Create account
                                    <i className="fa-solid fa-arrow-right"></i>
                                </>
                            )}
                        </button>
                    </form>

                    <p className="auth-switch">
                        Already have an account?{" "}
                        <Link to="/login" className="auth-link">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Signup;