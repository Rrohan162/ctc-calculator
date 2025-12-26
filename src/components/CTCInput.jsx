import React from 'react';
import { formatIndianNumber, parseIndianNumber } from '../utils/taxCalculator';

const CTCInput = ({ value, onChange }) => {
    const handleChange = (e) => {
        const val = e.target.value;
        // Allow only numbers and commas
        if (/^[0-9,]*$/.test(val)) {
            const num = parseIndianNumber(val);
            onChange(num);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* CTC Input - Primary Focus */}
            <div style={{ textAlign: 'center' }}>
                <label style={{
                    display: 'block',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: 'var(--text-secondary)',
                    marginBottom: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                }}>
                    Gross CTC
                </label>
                <div style={{ position: 'relative', maxWidth: '500px', margin: '0 auto' }}>
                    <span style={{
                        position: 'absolute',
                        left: '1rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        color: 'var(--accent-color)',
                        pointerEvents: 'none'
                    }}>₹</span>
                    <input
                        type="text"
                        className="input-field"
                        value={value > 0 ? formatIndianNumber(value) : ''}
                        onChange={handleChange}
                        placeholder="Enter your CTC"
                        style={{
                            width: '100%',
                            fontSize: '2.5rem',
                            fontWeight: 'bold',
                            textAlign: 'center',
                            padding: '1rem 1rem 1rem 3rem',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '2px solid var(--border-color)',
                            borderRadius: '12px',
                            transition: 'all 0.3s ease'
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = 'var(--accent-color)';
                            e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = 'var(--border-color)';
                            e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default CTCInput;
