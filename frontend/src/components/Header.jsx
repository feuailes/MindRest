import React, { useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeaf, faChevronDown, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import "./Header.css";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const isSanctuaryActive = ["/exercises", "/games", "/journal"].includes(location.pathname);

  // Dropdown hover is handled by CSS

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userName");
    navigate("/");
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* LOGO */}
        <Link to="/" className="logo">
          <img src="/logo.png" alt="MindRest Logo" className="logo-img" />
          <span className="brand-text">
            <span style={{ color: '#264653' }}>Mind</span><span style={{ color: '#E76F51' }}>Rest</span>
          </span>
        </Link>

        {/* NAVIGATION */}
        <nav className="nav-links">


          <Link to="/dashboard" className={location.pathname === "/dashboard" ? "active" : ""}>
            Dashboard
          </Link>

          {/* GROUPED SECTION: SANCTUARY */}
          <div className={`nav-dropdown ${isSanctuaryActive ? "active" : ""}`}>
            <span className="dropdown-label">
              MindHub
            </span>

            <div className="dropdown-menu">
              <Link to="/exercises">Exercises</Link>
              <Link to="/games">Games</Link>
              <Link to="/journal">Journal</Link>
            </div>
          </div>

          <Link to="/about" className={location.pathname === "/about" ? "active" : ""}>
            About
          </Link>
        </nav>

        {/* ACTIONS */}
        <div className="header-actions">
          {localStorage.getItem("token") ? (
            <div className="user-session">
              <Link to="/dashboard" className="header-login-btn">Get Started</Link>
              <button onClick={handleLogout} className="logout-btn" title="Sign Out">
                <FontAwesomeIcon icon={faSignOutAlt} />
              </button>
            </div>
          ) : (
            <Link to="/" className="header-login-btn">Get Started</Link>
          )}
        </div>
      </div>
    </header>
  );
}