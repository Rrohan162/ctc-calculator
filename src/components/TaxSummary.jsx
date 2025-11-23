import React from 'react';
import { formatIndianNumber } from '../utils/taxCalculator';

const TaxSummary = ({ calculation }) => {
    if (!calculation) return null;

    const { tax, cess, totalTax, netTaxableIncome, standardDeduction } = calculation;
    const monthlyTax = Math.round(totalTax / 12);

    return (
        <div className="glass-card" style={{ height: 'fit-content' }}>
            <h3 style={{ marginTop: 0 }}>Tax Summary</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="flex-row">
                    <span className="input-label">Standard Deduction</span>
                    <span>₹ {formatIndianNumber(standardDeduction)}</span>
                </div>
                <div className="flex-row">
                    <span className="input-label">Net Taxable Income</span>
                    <span>₹ {formatIndianNumber(netTaxableIncome)}</span>
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', margin: '0.5rem 0' }}></div>

                <div className="flex-row">
                    <span className="input-label">Income Tax</span>
                    <span>₹ {formatIndianNumber(Math.round(tax))}</span>
                </div>
                <div className="flex-row">
                    <span className="input-label">Health & Education Cess (4%)</span>
                    <span>₹ {formatIndianNumber(Math.round(cess))}</span>
                </div>

                <div className="flex-row" style={{ marginTop: '0.5rem', fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--accent-color)' }}>
                    <span>Total Tax (Yearly)</span>
                    <span>₹ {formatIndianNumber(Math.round(totalTax))}</span>
                </div>
                <div className="flex-row" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <span>Monthly Tax</span>
                    <span>₹ {formatIndianNumber(monthlyTax)}</span>
                </div>
            </div>
        </div>
    );
};

export default TaxSummary;
