import React, { useState } from "react";
import "./Loginpage.css";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    gender: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAction = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Points to your Laravel backend
    const endpoint = isLogin ? "/api/login" : "/api/register";

    try {
      const response = await fetch(`http://127.0.0.1:8000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const text = await response.text();
      console.log("RAW RESPONSE:", text);
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Invalid JSON from backend");
      }

      if (response.ok) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("token", data.token);

        const displayName = data.user?.name || formData.name;
        localStorage.setItem("userName", displayName);

        navigate("/dashboard");
      } else {
        setError(data.message || "Authentication failed.");
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h1 className="title">MindRest</h1>
        <p className="subtitle">
          {isLogin ? "Welcome back! Enter your credentials." : "Join us to track your digital wellness."}
        </p>

        {error && <div className="error-badge" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

        <form onSubmit={handleAction}>
          {/* REGISTRATION ONLY FIELDS */}
          {!isLogin && (
            <>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="login-input"
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="input-group">
                <select
                  className="login-input"
                  required
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </>
          )}

          <div className="input-group">
            <input
              type="email"
              placeholder="Email Address"
              className="login-input"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              className="login-input"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        <p className="footer-text">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          {/* This span is the magic button that switches the page */}
          <span
            className="text-link"
            style={{ cursor: 'pointer', color: '#1D4D4F', fontWeight: 'bold' }}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign up" : "Sign in"}
          </span>
        </p>

        <p className="legal-text">
          By signing in, you agree to our <b>Terms of Service</b> and <b>Privacy Policy</b>.
        </p>
      </div>
    </div>
  );
}