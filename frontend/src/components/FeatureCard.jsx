import React from 'react';

export default function FeatureCard({ title, description, delay = 0 }) {
    return (
        <div className="glass-panel" style={{
            padding: '32px',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            animation: `fadeIn 0.6s ease-out ${delay}s backwards`,
            height: '100%'
        }}>
            <h3 style={{
                marginBottom: '16px',
                color: 'var(--accent-primary)',
                fontSize: '1.25rem'
            }}>
                {title}
            </h3>
            <p style={{ fontSize: '1rem', lineHeight: '1.6' }}>
                {description}
            </p>
        </div>
    );
}
