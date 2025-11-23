import React from 'react';
import Tooltip from './Tooltip';
import { formatIndianNumber, parseIndianNumber } from '../utils/taxCalculator';

const HomeLoanSection = ({ interestPaid, setInterestPaid, rentReceived, setRentReceived }) => {
    const calculatedDeduction = Math.max(0, interestPaid - rentReceived);
    const cappedDeduction = Math.min(calculatedDeduction, 200000); // Cap at ₹2L
    const isExceedingCap = calculatedDeduction > 200000;

    const handleInterestChange = (e) => {
        const val = e.target.value;
        if (/^[0-9,]*$/.test(val)) {
            const num = parseIndianNumber(val);
            setInterestPaid(num);
        }
    };

    const handleRentChange = (e) => {
        const val = e.target.value;
        if (/^[0-9,]*$/.test(val)) {
            const num = parseIndianNumber(val);
            setRentReceived(num);
        }
    };

    return (
        <div className="glass-card" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: '600' }}>
                    🏠 Home Loan Interest Exemption
                </h3>
                <Tooltip text="Claim deduction for home loan interest paid. Rent received from the property will be subtracted." />
            </div>

            {/* Exemption Cap Note */}
            <div style={{
                background: 'rgba(255, 149, 0, 0.08)',
                border: '1px solid rgba(255, 149, 0, 0.2)',
                borderRadius: '8px',
                padding: '0.75rem 1rem',
                marginBottom: '1.5rem',
                fontSize: '0.875rem',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
            }}>
                <span style={{ fontSize: '1rem' }}>ℹ️</span>
                <span><strong>Note:</strong> A maximum of ₹2,00,000 is exempted per year under Section 24(b).</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1rem' }}>
                {/* Interest Paid */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <label style={{ fontSize: '0.9375rem', fontWeight: '500', color: 'var(--text-secondary)' }}>
                            Interest Paid (Annual)
                        </label>
                        <Tooltip text="Check your interest certificate from the bank for the exact amount paid during the financial year." />
                    </div>
                    <input
                        type="text"
                        className="input-field"
                        value={interestPaid > 0 ? formatIndianNumber(interestPaid) : ''}
                        onChange={handleInterestChange}
                        placeholder="₹ 0"
                        style={{ width: '100%' }}
                    />
                </div>

                {/* Rent Received */}
                <div>
                    <label style={{ display: 'block', fontSize: '0.9375rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                        Rent Received (Annual)
                    </label>
                    <input
                        type="text"
                        className="input-field"
                        value={rentReceived > 0 ? formatIndianNumber(rentReceived) : ''}
                        onChange={handleRentChange}
                        placeholder="₹ 0"
                        style={{ width: '100%' }}
                    />
                </div>
            </div>

            {/* Total Display */}
            {(interestPaid > 0 || rentReceived > 0) && (
                <div style={{
                    background: 'rgba(0, 122, 255, 0.05)',
                    border: '1px solid rgba(0, 122, 255, 0.2)',
                    borderRadius: '12px',
                    padding: '1rem',
                    marginTop: '1rem'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                            Total:
                        </span>
                        <span style={{ fontSize: '1.25rem', fontWeight: '700', color: isExceedingCap ? 'var(--warning-color)' : 'var(--primary-color)' }}>
                            ₹ {formatIndianNumber(calculatedDeduction)}
                        </span>
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: isExceedingCap ? '0.75rem' : '0' }}>
                        = Interest Paid (₹{formatIndianNumber(interestPaid)}) - Rent Received (₹{formatIndianNumber(rentReceived)})
                    </div>

                    {/* Cap Warning */}
                    {isExceedingCap && (
                        <div style={{
                            background: 'rgba(255, 149, 0, 0.1)',
                            border: '1px solid rgba(255, 149, 0, 0.3)',
                            borderRadius: '8px',
                            padding: '0.75rem',
                            marginTop: '0.75rem'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <span style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.9375rem' }}>
                                    ⚠️ Amount Considered for Tax:
                                </span>
                                <span style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--success-color)' }}>
                                    ₹ 2,00,000
                                </span>
                            </div>
                            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                                Your calculated deduction (₹{formatIndianNumber(calculatedDeduction)}) exceeds the annual limit. Only ₹2,00,000 will be used to reduce your taxable income.
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default HomeLoanSection;
