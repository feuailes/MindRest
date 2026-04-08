import React, { useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeaf, faChevronDown, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import "./Header.css";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const closeTimeout = useRef(null);

  const isSanctuaryActive = ["/exercises", "/games", "/journal"].includes(location.pathname);

  const handleMouseEnter = () => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeout.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 300);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userName");
    navigate("/");
  };

  return (
    <header className="header">
      <div className="header-container container">
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
          <div
            className={`nav-dropdown ${isSanctuaryActive ? "active" : ""}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <span className="dropdown-label">
              MindHub <FontAwesomeIcon icon={faChevronDown} className="chevron" />
            </span>

            {dropdownOpen && (
              <div className="dropdown-menu">
                <Link to="/exercises">Exercises</Link>
                <Link to="/games">Games</Link>
                <Link to="/journal">Journal</Link>
              </div>
            )}
          </div>

          <Link to="/about" className={location.pathname === "/about" ? "active" : ""}>
            About
          </Link>
        </nav>

        {/* ACTIONS */}
        <div className="header-actions">
          {localStorage.getItem("token") ? (
            <div className="user-session">
              <span className="user-name">Hello, {localStorage.getItem("userName") || "User"}</span>
              <button onClick={handleLogout} className="logout-btn" title="Sign Out">
                <FontAwesomeIcon icon={faSignOutAlt} /> Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="header-login-btn">Get Started</Link>
          )}
        </div>
      </div>
    </header>
  );
}