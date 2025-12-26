import React from 'react';

const DisclaimerBanner = () => {
    return (
        <div style={{
            background: 'linear-gradient(135deg, rgba(255, 149, 0, 0.1) 0%, rgba(255, 204, 0, 0.1) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1.5px solid rgba(255, 149, 0, 0.2)',
            borderRadius: '16px',
            padding: '1rem 1.5rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            boxShadow: '0 4px 16px rgba(255, 149, 0, 0.1)'
        }}>
            <div style={{
                fontSize: '1.5rem',
                flexShrink: 0
            }}>
                ⚠️
            </div>
            <div style={{
                flex: 1
            }}>
                <p style={{
                    margin: 0,
                    fontSize: '0.9375rem',
                    color: 'var(--text-primary)',
                    fontWeight: '500',
                    lineHeight: '1.5',
                    letterSpacing: '-0.01em'
                }}>
                    <strong>For informational purposes only.</strong> Actual values may vary <strong>±5%</strong> based on company policies, individual circumstances, and specific salary structures.
                </p>
            </div>
        </div>
    );
};

export default DisclaimerBanner;
