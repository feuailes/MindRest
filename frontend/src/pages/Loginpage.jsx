import React, { useState } from "react";
import "./Loginpage.css";
import { useNavigate, useLocation } from "react-router-dom";
import { auth, googleProvider } from "../firebase";
import { signInWithPopup } from "firebase/auth";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    if (location.state?.mode === "signup") {
      setIsLogin(false);
    }
  }, [location.state]);

  const handleAction = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Points to your Laravel backend
    const API_BASE = "http://localhost:8000/api";
    const endpoint = isLogin ? "/login" : "/register";

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
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

        const from = location.state?.from || "/dashboard";
        navigate(from, { replace: true });
      } else {
        setError(data.message || "Authentication failed.");
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      console.log("Google User info:", {
        name: user.displayName,
        email: user.email
      });

      // Send to backend
      const response = await fetch("http://localhost:8000/api/google-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name: user.displayName,
          email: user.email
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("token", data.token);
        localStorage.setItem("userName", data.user?.name || "User");
        
        const from = location.state?.from || "/dashboard";
        navigate(from, { replace: true });
      } else {
        setError(data.message || "Google Sign-In failed.");
      }
    } catch (err) {
      console.error("Google Sign-In Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h1 className="title"><span style={{ color: '#264653' }}>Mind</span><span style={{ color: '#E76F51' }}>Rest</span></h1>
        <p className="subtitle">
          {isLogin ? "Welcome back! Enter your credentials." : "Join us to track your digital wellness."}
        </p>

        {error && <div className="error-badge">{error}</div>}

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

          {!isLogin && (
            <div className="input-group">
              <input
                type="password"
                placeholder="Confirm Password"
                className="login-input"
                onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                required
              />
            </div>
          )}

          <button type="submit" className="login-btn" disabled={loading}>
            {(loading && formData.email) ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="social-separator">
          <span>OR</span>
        </div>

        <button 
          className="google-btn" 
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          <img 
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
            alt="Google" 
            className="google-icon"
          />
          {isLogin ? "Sign in with Google" : "Sign up with Google"}
        </button>

        <p className="footer-text">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
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