import React from 'react';

const RegimeSwitch = ({ regime, setRegime }) => {
    return (
        <div className="input-group">
            <label className="input-label">Tax Regime</label>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                    className={`btn ${regime === 'new' ? 'btn-primary' : ''}`}
                    style={{ flex: 1, background: regime === 'new' ? 'var(--accent-color)' : 'rgba(15, 23, 42, 0.5)' }}
                    onClick={() => setRegime('new')}
                >
                    New Regime (FY 25-26)
                </button>
                <button
                    className={`btn ${regime === 'old' ? 'btn-primary' : ''}`}
                    style={{ flex: 1, background: regime === 'old' ? 'var(--accent-color)' : 'rgba(15, 23, 42, 0.5)' }}
                    onClick={() => setRegime('old')}
                >
                    Old Regime
                </button>
            </div>
        </div>
    );
};

export default RegimeSwitch;
