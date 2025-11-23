import React, { useState } from 'react';

const Tooltip = ({ text }) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div
            className="tooltip-container"
            style={{ position: 'relative', display: 'inline-flex', marginLeft: '0.5rem' }}
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            <div style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                border: '1px solid var(--text-secondary)',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                cursor: 'help',
                fontStyle: 'italic',
                fontFamily: 'serif'
            }}>i</div>

            {isVisible && (
                <div style={{
                    position: 'absolute',
                    bottom: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    marginBottom: '8px',
                    padding: '8px 12px',
                    background: 'rgba(0, 0, 0, 0.9)', // Darker background for better contrast
                    color: 'white',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    width: 'max-content',
                    maxWidth: '220px',
                    textAlign: 'center',
                    zIndex: 1000, // Ensure it's above other elements
                    pointerEvents: 'none',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                    lineHeight: '1.4',
                    backdropFilter: 'blur(4px)'
                }}>
                    {text}
                    {/* Arrow */}
                    <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        borderWidth: '6px',
                        borderStyle: 'solid',
                        borderColor: 'rgba(0, 0, 0, 0.9) transparent transparent transparent'
                    }}></div>
                </div>
            )}
        </div>
    );
};

export default Tooltip;
