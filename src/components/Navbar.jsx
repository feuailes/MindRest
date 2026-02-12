import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{
      display: "flex",
      gap: "20px",
      padding: "10px",
      background: "var(--bg-secondary)",
      borderBottom: "1px solid var(--card-hover)"
    }}>
      <Link to="/">Home</Link>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/games">Games</Link>
      <Link to="/about">About</Link>
    </nav>
  );
}
