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
                <div className="tooltip-content">
                    {text}
                    {/* Arrow */}
                    <div className="tooltip-arrow"></div>
                </div>
            )}
        </div>
    );
};

export default Tooltip;
