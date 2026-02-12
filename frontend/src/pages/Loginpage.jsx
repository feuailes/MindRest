import React, { useState } from "react";
import "./Loginpage.css";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // Dummy login (no backend, just demo)
    if (email.trim() !== "" && password.trim() !== "") {
      navigate("/home");   // redirect after login
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h1 className="title">MindRest</h1>
        <p className="subtitle">Welcome back. Let's check in on how you're feeling.</p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Enter your email"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter your password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="login-btn">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
