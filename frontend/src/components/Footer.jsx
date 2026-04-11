import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerWrapper = {
    width: '100%',
    borderTop: '1px solid #eaeaea', // border-t
    background: '#ffffff', // bg-white
    padding: '40px 0', // py-6 (desktop scales to 32px/py-8)
    marginTop: 'auto'
  };

  const container = {
    width: '100%',
    padding: '0 24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
  };

  const textSecondary = {
    fontSize: '0.875rem',
    color: 'rgba(34, 34, 34, 0.6)',
    textAlign: 'center'
  };

  const navLinks = {
    display: 'flex',
    gap: '16px',
  };

  const linkItem = {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: 'rgba(34, 34, 34, 0.6)',
    textDecoration: 'none',
    transition: 'color 0.2s ease',
  };

  // Hover Effect
  const handleHover = (e, isEnter) => {
    e.target.style.color = isEnter ? '#1D4D4F' : 'rgba(34, 34, 34, 0.6)';
  };

  return (
    <footer style={footerWrapper}>
      <div style={{
        ...container,
        maxWidth: '1400px',
        margin: '0 auto',
        flexDirection: window.innerWidth > 768 ? 'row' : 'column'
      }}>

        {/* Logo Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <img 
            src="/logo.png" 
            alt="MindRest Logo" 
            style={{
              height: '30px',
              width: 'auto',
              objectFit: 'contain',
              mixBlendMode: 'multiply',
              filter: 'contrast(1.2) brightness(1.1)',
              transform: 'translateY(1px)'
            }} 
          />
          <div style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '1.2rem',
            fontWeight: '800',
            letterSpacing: '-0.8px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <span style={{ color: '#264653' }}>Mind</span><span style={{ color: '#E76F51' }}>Rest</span>
          </div>
        </div>

        {/* Copyright Section */}
        <p style={textSecondary}>
          © {currentYear} MindRest. All rights reserved.
        </p>

        {/* Navigation Links */}
        <nav style={navLinks}>
          <Link to="/about" style={linkItem} onMouseEnter={(e) => handleHover(e, true)} onMouseLeave={(e) => handleHover(e, false)}>About</Link>
          <Link to="/contact" style={linkItem} onMouseEnter={(e) => handleHover(e, true)} onMouseLeave={(e) => handleHover(e, false)}>Contact</Link>
          <Link to="/feedback" style={linkItem} onMouseEnter={(e) => handleHover(e, true)} onMouseLeave={(e) => handleHover(e, false)}>Feedback</Link>
          <Link to="/resources" style={linkItem} onMouseEnter={(e) => handleHover(e, true)} onMouseLeave={(e) => handleHover(e, false)}>Resources</Link>
        </nav>

      </div>
    </footer>
  );
}