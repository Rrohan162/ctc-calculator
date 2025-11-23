import React from 'react';
import { formatIndianNumber } from '../utils/taxCalculator';
import Tooltip from './Tooltip';

const NetPayCard = ({ netMonthly, monthlyIncentive, monthlyBase }) => {
    return (
        <div className="glass-card" style={{ marginBottom: '2rem', textAlign: 'center', padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <h2 style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '1.125rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Monthly Take-Home
                </h2>
                <Tooltip text="Your estimated monthly in-hand salary after all deductions and taxes." />
            </div>

            {/* Main Monthly Amount */}
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ fontSize: '3.5rem', fontWeight: '800', color: 'var(--text-primary)', lineHeight: '1' }}>
                    ₹ {formatIndianNumber(Math.round(netMonthly))}
                </div>
                <div style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                    per month
                </div>
            </div>

            {/* Visual Split */}
            <div style={{
                background: 'rgba(255, 255, 255, 0.5)',
                borderRadius: '16px',
                padding: '1.25rem',
                display: 'grid',
                gridTemplateColumns: '1fr 1px 1fr',
                gap: '1rem',
                alignItems: 'center'
            }}>
                {/* Base Salary */}
                <div style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem', fontWeight: '500' }}>
                        Base Salary
                        <Tooltip text="In your bank account per month" />
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                        ₹ {formatIndianNumber(Math.round(monthlyBase))}
                    </div>
                </div>

                {/* Divider */}
                <div style={{ width: '1px', height: '40px', background: 'var(--border-color)' }}></div>

                {/* Incentive */}
                <div style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', fontSize: '0.875rem', color: 'var(--success-color)', marginBottom: '0.25rem', fontWeight: '600' }}>
                        + Incentive
                        <Tooltip text="In your bank account at the end of the year" />
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--success-color)' }}>
                        ₹ {formatIndianNumber(Math.round(monthlyIncentive))} <span style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--success-color)', opacity: 0.9 }}>(Monthly)</span>
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--success-color)', marginTop: '0.25rem', opacity: 0.9 }}>
                        × 12 = ₹ {formatIndianNumber(Math.round(monthlyIncentive * 12))} <span style={{ fontSize: '0.8rem', fontWeight: '500' }}>(Yearly)</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NetPayCard;
