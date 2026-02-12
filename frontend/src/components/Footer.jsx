import React from 'react';

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--bg-secondary)',
      color: 'var(--text-secondary)',
      padding: '48px 24px',
      textAlign: 'center',
      marginTop: 'auto',
      borderTop: '1px solid var(--card-border)'
    }}>
      <p style={{
        marginBottom: '20px',
        fontSize: '1rem',
        lineHeight: '1.6'
      }}>
        &copy; 2025 MindRest. Take care of yourself, one day at a time.
      </p>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '24px',
        flexWrap: 'wrap'
      }}>
        <a
          href="#"
          style={{
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            fontSize: '0.95rem',
            transition: 'var(--transition-fast)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          Privacy Policy
        </a>
        <a
          href="#"
          style={{
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            fontSize: '0.95rem',
            transition: 'var(--transition-fast)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          Terms of Service
        </a>
        <a
          href="#"
          style={{
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            fontSize: '0.95rem',
            transition: 'var(--transition-fast)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          Contact Us
        </a>
      </div>
    </footer>
  );
}
