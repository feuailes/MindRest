import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeaf } from "@fortawesome/free-solid-svg-icons";
import "./Header.css";

export default function Header() {
  const location = useLocation();

  return (
    <header className="header">
      {/* LEFT SECTION: LOGO */}
      <Link to="/" className="logo">
        <FontAwesomeIcon icon={faLeaf} />
        MindRest
      </Link>

      {/* CENTER SECTION: NAV LINKS */}
      <nav className="nav-links">
        <Link to="/" className={location.pathname === "/" ? "active" : ""}>
          Home
        </Link>
        <Link to="/dashboard" className={location.pathname === "/dashboard" ? "active" : ""}>
          Dashboard
        </Link>
        <Link to="/about" className={location.pathname === "/about" ? "active" : ""}>
          About
        </Link>
        <Link to="/journal" className={location.pathname === "/journal" ? "active" : ""}>
          Journal
        </Link>
      </nav>

      {/* RIGHT SECTION: COLOR SWATCHES */}
      <div className="color-swatches">
        <div className="swatch" style={{ backgroundColor: "#1D4D4F" }}></div>
        <div className="swatch" style={{ backgroundColor: "#B2E2D2" }}></div>
        <div className="swatch" style={{ backgroundColor: "#FFD166" }}></div>
        <div className="swatch" style={{ backgroundColor: "#E76F51" }}></div>
        <div className="swatch" style={{ backgroundColor: "#B8B1FF" }}></div>
      </div>
    </header>
  );
}
