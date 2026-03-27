import React from 'react';

export default function WellnessTips() {
    const tips = [
        "Take 1-minute breaks every hour",
        "Reduce screen brightness at night",
        "Keep a consistent sleep routine"
    ];

    return (
        <section style={{
            padding: '64px 40px',
            marginTop: '60px',
            textAlign: 'center',
            backgroundColor: 'var(--card-bg)',
            borderRadius: '20px',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--card-border)',
        }}>
            <h2 style={{ 
                marginBottom: '40px', 
                fontSize: '2rem',
                fontWeight: 700,
                color: 'var(--text-primary)'
            }}>
                Quick Wellness Tips
            </h2>
            <ul style={{
                listStyle: 'none',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '16px',
                padding: 0
            }}>
                {tips.map((tip, index) => (
                    <li 
                        key={index} 
                        style={{
                            background: 'var(--bg-primary)',
                            padding: '14px 28px',
                            borderRadius: '100px',
                            border: '1px solid var(--card-border)',
                            color: 'var(--text-primary)',
                            fontSize: '1rem',
                            fontWeight: 500,
                            transition: 'var(--transition-fast)',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-2px)";
                            e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "none";
                        }}
                    >
                        {tip}
                    </li>
                ))}
            </ul>
        </section>
    );
}
