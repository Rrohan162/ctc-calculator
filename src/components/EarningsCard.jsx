import React from 'react';
import { formatIndianNumber, parseIndianNumber } from '../utils/taxCalculator';
import Tooltip from './Tooltip';

const EarningsCard = ({ earnings, grossSalary, ctc, onUpdate, viewMode, performanceBonus }) => {

    const handleChange = (id, field, val) => {
        const updated = earnings.map(e => {
            if (e.id === id) {
                if (field === 'amount') {
                    const parsed = parseIndianNumber(val);
                    const annualAmount = viewMode === 'monthly' ? parsed * 12 : parsed;
                    return { ...e, amount: annualAmount, type: 'manual' };
                } else if (field === 'name') {
                    return { ...e, name: val };
                }
            }
            return e;
        });
        onUpdate(updated);
    };

    const handleAdd = () => {
        const newId = `custom_earning_${Date.now()}`;
        const newEarning = { id: newId, name: 'New Allowance', amount: 0, type: 'manual', taxable: true, disabled: false };
        onUpdate([...earnings, newEarning]);
    };

    const handleToggle = (id, enable) => {
        const updated = earnings.map(e => {
            if (e.id === id) {
                return { ...e, disabled: !enable, amount: enable ? e.amount : 0 };
            }
            return e;
        });
        onUpdate(updated);
    };

    const handleDelete = (id) => {
        handleToggle(id, false);
    };

    const handleEnable = (id) => {
        handleToggle(id, true);
    };

    return (
        <div className="glass-card">
            <div className="flex-row" style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <h3 style={{ margin: 0, color: 'var(--success-color)' }}>Net Salary (yearly)</h3>
                    <Tooltip text="Breakdown of your salary components." />
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem', fontStyle: 'italic' }}>
                    Customise as per your requirements here
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {earnings.map(e => {
                    const displayAmount = viewMode === 'monthly' ? Math.round(e.amount / 12) : Math.round(e.amount);
                    const actuallyDisabled = e.disabled;

                    // Calculate % of CTC
                    const percentage = ctc > 0 ? ((e.amount / ctc) * 100).toFixed(1) : '0.0';

                    return (
                        <div key={e.id} className="flex-row" style={{ background: actuallyDisabled ? 'rgba(255,255,255,0.01)' : 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '8px', opacity: actuallyDisabled ? 0.6 : 1 }}>
                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <input
                                    className="input-field"
                                    value={e.name}
                                    onChange={(ev) => handleChange(e.id, 'name', ev.target.value)}
                                    disabled={actuallyDisabled}
                                    style={{ width: '100%', background: 'transparent', border: 'none', padding: 0, fontSize: '0.95rem', color: actuallyDisabled ? 'var(--text-secondary)' : 'var(--text-primary)' }}
                                />
                                <Tooltip text={e.description || `Explanation for ${e.name}`} />
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                {/* Percentage Badge */}
                                {!actuallyDisabled && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', position: 'relative', group: 'percent' }}>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px', cursor: 'help' }} title={`${percentage}% of Total CTC`}>
                                            {percentage}%
                                        </span>
                                    </div>
                                )}

                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    {!actuallyDisabled && <span style={{ color: 'var(--success-color)', fontWeight: 'bold' }}>+</span>}

                                    {actuallyDisabled ? (
                                        <button className="btn btn-primary" onClick={() => handleEnable(e.id)} style={{ padding: '4px 12px', fontSize: '0.8rem' }}>Add</button>
                                    ) : (
                                        <>
                                            <input
                                                type="text"
                                                className="input-field"
                                                value={formatIndianNumber(displayAmount)}
                                                onChange={(ev) => handleChange(e.id, 'amount', ev.target.value)}
                                                disabled={e.readOnly} // Disable input if readOnly
                                                style={{
                                                    width: '100px',
                                                    textAlign: 'right',
                                                    padding: '0.25rem',
                                                    fontSize: '0.95rem',
                                                    opacity: e.readOnly ? 0.7 : 1,
                                                    cursor: e.readOnly ? 'not-allowed' : 'text'
                                                }}
                                            />
                                            {!e.readOnly && (
                                                <button className="btn btn-icon" onClick={() => handleDelete(e.id)} style={{ color: 'var(--danger-color)', padding: '0.25rem' }} title="Remove">×</button>
                                            )}
                                            {e.readOnly && <span style={{ width: '24px' }}></span>} {/* Spacer for alignment */}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Add New Button Row */}
                {/* Add New Button Row */}
                <button
                    onClick={handleAdd}
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        background: 'transparent',
                        border: '1px dashed var(--border-color)',
                        borderRadius: '8px',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        marginTop: '0.5rem',
                        transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => { e.target.style.borderColor = 'var(--accent-color)'; e.target.style.color = 'var(--accent-color)'; }}
                    onMouseOut={(e) => { e.target.style.borderColor = 'var(--border-color)'; e.target.style.color = 'var(--text-secondary)'; }}
                >
                    + Add New Earning
                </button>
            </div>

            {/* Performance Bonus Display (Separate Row) */}
            {performanceBonus > 0 && (
                <div style={{ marginTop: '0.75rem', marginBottom: '0.75rem' }}>
                    <div className="flex-row" style={{ background: 'rgba(255, 215, 0, 0.05)', padding: '0.75rem', borderRadius: '8px', border: '1px dashed rgba(255, 215, 0, 0.3)' }}>
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: '500' }}>Performance Bonus</span>
                            <Tooltip text="Variable pay/incentive. Displayed separately as requested." />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                                {ctc > 0 ? ((performanceBonus / ctc) * 100).toFixed(1) : '0.0'}%
                            </span>
                            <span style={{ color: 'var(--success-color)', fontWeight: 'bold' }}>+</span>
                            <span style={{ width: '100px', textAlign: 'right', padding: '0.25rem', fontSize: '0.95rem', fontWeight: '500' }}>
                                ₹ {formatIndianNumber(viewMode === 'monthly' ? Math.round(performanceBonus / 12) : Math.round(performanceBonus))}
                            </span>
                            <span style={{ width: '24px' }}></span>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex-row" style={{ marginTop: '0.75rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', fontWeight: 'bold', fontSize: '1.1rem' }}>
                <span>Gross Salary <span style={{ fontSize: '0.8rem', fontWeight: 'normal', color: 'var(--text-secondary)' }}>(Fixed)</span></span>
                <span>₹ {formatIndianNumber(Math.round(viewMode === 'monthly' ? grossSalary / 12 : grossSalary))}</span>
            </div>
        </div>
    );
};

export default EarningsCard;
