import React from 'react';
import Tooltip from './Tooltip';
import { formatIndianNumber } from '../utils/taxCalculator';

const IncentiveSection = ({ bonusAmount, setBonusAmount, realisticPayout, setRealisticPayout, taxOnIncentive, taxFixed = 0, bonusTaxRate = 0 }) => {
    const finalIncentive = (bonusAmount * realisticPayout) / 100;
    const postTaxIncentive = finalIncentive - taxOnIncentive;

    const calculationTooltip = `Tax Calculation Logic:\n` +
        `Annual Bonus (Full): ₹${formatIndianNumber(bonusAmount)}\n` +
        `Applicable Tax Rate: ${Math.round(bonusTaxRate * 100)}%\n` +
        `--------------------------------\n` +
        `Tax on Incentive: ₹${formatIndianNumber(bonusAmount)} × ${Math.round(bonusTaxRate * 100)}% = ₹${formatIndianNumber(Math.round(taxOnIncentive))}\n\n` +
        `Note: Tax is calculated on the full bonus amount, then deducted from your realistic payout.`;

    return (
        <div className="glass-card" style={{ marginBottom: '2rem', marginTop: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: '600' }}>
                    💰 Incentive / Performance Bonus
                </h3>
                <Tooltip text="Your variable pay component. Adjust the realistic payout % based on expected performance." />
            </div>

            <div style={{ marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {/* Bonus Amount Input */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <label style={{ fontSize: '0.9375rem', fontWeight: '500', color: 'var(--text-secondary)' }}>
                            Annual Bonus (CTC)
                        </label>
                        <Tooltip text="Total performance bonus allocated in your CTC." />
                    </div>
                    <input
                        type="text"
                        className="input-field"
                        value={bonusAmount > 0 ? formatIndianNumber(bonusAmount) : ''}
                        onChange={(e) => {
                            const val = e.target.value.replace(/,/g, '');
                            if (!isNaN(val)) setBonusAmount(Number(val));
                        }}
                        placeholder="₹ 0"
                        style={{ width: '100%' }}
                    />
                </div>

                {/* Realistic Payout Input */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <label style={{ fontSize: '0.9375rem', fontWeight: '500', color: 'var(--text-secondary)' }}>
                            Realistic Payout (%)
                        </label>
                        <Tooltip text="Expected payout percentage based on performance. Default is 80%." />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                            type="number"
                            className="input-field"
                            value={realisticPayout}
                            onChange={(e) => setRealisticPayout(Math.min(100, Math.max(0, Number(e.target.value))))}
                            min="0"
                            max="100"
                            style={{ width: '100%' }}
                        />
                        <span style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>%</span>
                    </div>
                </div>
            </div>

            {/* Calculation Breakdown */}
            <div style={{
                background: 'rgba(0, 122, 255, 0.05)',
                border: '1px solid rgba(0, 122, 255, 0.2)',
                borderRadius: '12px',
                padding: '1rem'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Expected Incentive ({realisticPayout}%):</span>
                    <span style={{ fontWeight: '600' }}>₹ {formatIndianNumber(Math.round(finalIncentive))}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Tax on Incentive:</span>
                        <Tooltip text={calculationTooltip} />
                    </div>
                    <span style={{ fontWeight: '600', color: 'var(--danger-color)' }}>- ₹ {formatIndianNumber(Math.round(taxOnIncentive))}</span>
                </div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingTop: '0.75rem',
                    borderTop: '2px solid rgba(0, 122, 255, 0.3)',
                    fontWeight: '700',
                    fontSize: '1.125rem'
                }}>
                    <span>Post-Tax Incentive:</span>
                    <span style={{ color: 'var(--success-color)' }}>₹ {formatIndianNumber(Math.round(postTaxIncentive))}</span>
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem', textAlign: 'center' }}>
                    Monthly: ₹ {formatIndianNumber(Math.round(postTaxIncentive / 12))}/month
                </div>
            </div>
        </div>
    );
};

export default IncentiveSection;
