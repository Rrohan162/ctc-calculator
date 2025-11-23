import React from 'react';
import { formatIndianNumber } from '../utils/taxCalculator';

const CalculationModal = ({ isOpen, onClose, salaryDetails, taxCalculation, ctc, viewMode, homeLoanDeduction }) => {
    if (!isOpen || !salaryDetails || !taxCalculation) return null;

    const { grossSalary, earnings, deductions, employerPF } = salaryDetails;
    const { tax, cess, totalTax, netTaxableIncome, standardDeduction } = taxCalculation;

    // Calculate tax breakdown by slab
    const calculateTaxBreakdown = (taxableIncome) => {
        const slabs = [
            { range: '₹0 - ₹4,00,000', limit: 400000, rate: 0, prevLimit: 0 },
            { range: '₹4,00,001 - ₹8,00,000', limit: 800000, rate: 5, prevLimit: 400000 },
            { range: '₹8,00,001 - ₹12,00,000', limit: 1200000, rate: 10, prevLimit: 800000 },
            { range: '₹12,00,001 - ₹16,00,000', limit: 1600000, rate: 15, prevLimit: 1200000 },
            { range: '₹16,00,001 - ₹20,00,000', limit: 2000000, rate: 20, prevLimit: 1600000 },
            { range: '₹20,00,001 - ₹24,00,000', limit: 2400000, rate: 25, prevLimit: 2000000 },
            { range: 'Above ₹24,00,000', limit: Infinity, rate: 30, prevLimit: 2400000 }
        ];

        const breakdown = [];
        let remainingIncome = taxableIncome;

        for (const slab of slabs) {
            if (remainingIncome <= 0) {
                breakdown.push({ ...slab, taxableAmount: 0, taxOnSlab: 0 });
                continue;
            }

            const taxableInSlab = Math.min(remainingIncome, slab.limit - slab.prevLimit);
            const taxOnSlab = taxableInSlab * (slab.rate / 100);

            breakdown.push({
                ...slab,
                taxableAmount: taxableInSlab,
                taxOnSlab: taxOnSlab
            });

            remainingIncome -= taxableInSlab;
        }

        return breakdown;
    };

    const taxBreakdown = calculateTaxBreakdown(netTaxableIncome);
    const totalDeductions = deductions.reduce((sum, d) => sum + d.amount, 0) + totalTax;
    const netPay = grossSalary - totalDeductions;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{
                        margin: 0,
                        fontSize: '1.75rem',
                        fontWeight: '700',
                        color: 'var(--text-primary)',
                        letterSpacing: '-0.02em'
                    }}>
                        Detailed Calculation
                    </h2>
                    <button
                        onClick={onClose}
                        className="btn-icon"
                        style={{ fontSize: '1.5rem', width: '36px', height: '36px' }}
                    >
                        ×
                    </button>
                </div>

                {/* Section 1: Earnings Breakdown */}
                <div style={{ marginBottom: '2.5rem' }}>
                    <h3 style={{
                        fontSize: '1.25rem',
                        fontWeight: '600',
                        marginBottom: '1rem',
                        color: 'var(--success-color)'
                    }}>
                        1. Earnings Breakdown
                    </h3>
                    <div style={{
                        background: 'rgba(52, 199, 89, 0.05)',
                        borderRadius: '12px',
                        padding: '1rem',
                        border: '1px solid rgba(52, 199, 89, 0.2)'
                    }}>
                        <div className="table-responsive">
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid rgba(0, 0, 0, 0.1)' }}>
                                        <th style={{ textAlign: 'left', padding: '0.75rem', fontWeight: '600', fontSize: '1rem' }}>Component</th>
                                        <th style={{ textAlign: 'right', padding: '0.75rem', fontWeight: '600', fontSize: '1rem' }}>Amount</th>
                                        <th style={{ textAlign: 'right', padding: '0.75rem', fontWeight: '600', fontSize: '1rem' }}>% of CTC</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {earnings.filter(e => !e.disabled && e.amount > 0).map((earning, idx) => (
                                        <tr key={idx} style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.05)' }}>
                                            <td data-label="Component" style={{ padding: '0.75rem', fontSize: '1.0625rem' }}>{earning.name}</td>
                                            <td data-label="Amount" style={{ padding: '0.75rem', textAlign: 'right', fontWeight: '500' }}>
                                                ₹ {formatIndianNumber(Math.round(earning.amount))}
                                            </td>
                                            <td data-label="% of CTC" style={{ padding: '0.75rem', textAlign: 'right', color: 'var(--text-secondary)' }}>
                                                {((earning.amount / ctc) * 100).toFixed(1)}%
                                            </td>
                                        </tr>
                                    ))}
                                    <tr style={{ fontWeight: '600', background: 'rgba(52, 199, 89, 0.1)' }}>
                                        <td data-label="Component" style={{ padding: '0.75rem' }}>Gross Salary</td>
                                        <td data-label="Amount" style={{ padding: '0.75rem', textAlign: 'right' }}>
                                            ₹ {formatIndianNumber(Math.round(grossSalary))}
                                        </td>
                                        <td data-label="% of CTC" style={{ padding: '0.75rem', textAlign: 'right' }}>
                                            {((grossSalary / ctc) * 100).toFixed(1)}%
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Section 2: Deductions */}
                <div style={{ marginBottom: '2.5rem' }}>
                    <h3 style={{
                        fontSize: '1.25rem',
                        fontWeight: '600',
                        marginBottom: '1rem',
                        color: 'var(--danger-color)'
                    }}>
                        2. Deductions
                    </h3>
                    <div style={{
                        background: 'rgba(255, 59, 48, 0.05)',
                        borderRadius: '12px',
                        padding: '1rem',
                        border: '1px solid rgba(255, 59, 48, 0.2)'
                    }}>
                        <div className="table-responsive">
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid rgba(0, 0, 0, 0.1)' }}>
                                        <th style={{ textAlign: 'left', padding: '0.75rem', fontWeight: '600', fontSize: '1rem' }}>Component</th>
                                        <th style={{ textAlign: 'right', padding: '0.75rem', fontWeight: '600', fontSize: '1rem' }}>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.05)' }}>
                                        <td data-label="Component" style={{ padding: '0.75rem', fontSize: '1.0625rem' }}>Standard Deduction</td>
                                        <td data-label="Amount" style={{ padding: '0.75rem', textAlign: 'right', fontWeight: '500' }}>
                                            - ₹ {formatIndianNumber(standardDeduction)}
                                        </td>
                                    </tr>
                                    {deductions.filter(d => !d.disabled && d.amount > 0).map((deduction, idx) => (
                                        <tr key={idx} style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.05)' }}>
                                            <td data-label="Component" style={{ padding: '0.75rem', fontSize: '1.0625rem' }}>{deduction.name}</td>
                                            <td data-label="Amount" style={{ padding: '0.75rem', textAlign: 'right', fontWeight: '500' }}>
                                                - ₹ {formatIndianNumber(Math.round(deduction.amount))}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Section 3: Tax Calculation */}
                <div style={{ marginBottom: '2.5rem' }}>
                    <h3 style={{
                        fontSize: '1.25rem',
                        fontWeight: '600',
                        marginBottom: '1rem',
                        color: 'var(--primary-color)'
                    }}>
                        3. Tax Calculation (New Regime FY 2025-26)
                    </h3>

                    <div style={{ marginBottom: '1rem', padding: '1rem', background: 'rgba(0, 122, 255, 0.05)', borderRadius: '12px', border: '1px solid rgba(0, 122, 255, 0.2)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ fontWeight: '500' }}>Gross Salary:</span>
                            <span>₹ {formatIndianNumber(Math.round(grossSalary))}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ fontWeight: '500' }}>Standard Deduction:</span>
                            <span>- ₹ {formatIndianNumber(standardDeduction)}</span>
                        </div>
                        {homeLoanDeduction > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--primary-color)' }}>
                                <span style={{ fontWeight: '500' }}>🏠 Home Loan Interest:</span>
                                <span>- ₹ {formatIndianNumber(Math.round(homeLoanDeduction))}</span>
                            </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '2px solid rgba(0, 122, 255, 0.2)', fontWeight: '600' }}>
                            <span>Taxable Income:</span>
                            <span>₹ {formatIndianNumber(Math.round(netTaxableIncome))}</span>
                        </div>
                    </div>

                    <div style={{
                        background: 'rgba(0, 122, 255, 0.05)',
                        borderRadius: '12px',
                        padding: '1rem',
                        border: '1px solid rgba(0, 122, 255, 0.2)'
                    }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem' }}>Tax Slab Breakdown:</h4>
                        <div className="table-responsive">
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid rgba(0, 0, 0, 0.1)' }}>
                                        <th style={{ textAlign: 'left', padding: '0.75rem', fontWeight: '600', fontSize: '0.875rem' }}>Income Range</th>
                                        <th style={{ textAlign: 'center', padding: '0.75rem', fontWeight: '600', fontSize: '0.875rem' }}>Rate</th>
                                        <th style={{ textAlign: 'right', padding: '0.75rem', fontWeight: '600', fontSize: '0.875rem' }}>Taxable</th>
                                        <th style={{ textAlign: 'right', padding: '0.75rem', fontWeight: '600', fontSize: '0.875rem' }}>Tax</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {taxBreakdown.map((slab, idx) => (
                                        <tr
                                            key={idx}
                                            style={{
                                                borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                                                background: slab.taxableAmount > 0 ? 'rgba(0, 122, 255, 0.05)' : 'transparent'
                                            }}
                                        >
                                            <td data-label="Income Range" style={{ padding: '0.75rem', fontSize: '1rem' }}>{slab.range}</td>
                                            <td data-label="Rate" style={{ padding: '0.75rem', textAlign: 'center', fontWeight: '500' }}>{slab.rate}%</td>
                                            <td data-label="Taxable Amount" style={{ padding: '0.75rem', textAlign: 'right' }}>
                                                {slab.taxableAmount > 0 ? `₹ ${formatIndianNumber(Math.round(slab.taxableAmount))}` : '-'}
                                            </td>
                                            <td data-label="Tax" style={{ padding: '0.75rem', textAlign: 'right', fontWeight: '500' }}>
                                                {slab.taxOnSlab > 0 ? `₹ ${formatIndianNumber(Math.round(slab.taxOnSlab))}` : '-'}
                                            </td>
                                        </tr>
                                    ))}
                                    <tr style={{ fontWeight: '600', background: 'rgba(0, 122, 255, 0.1)', borderTop: '2px solid rgba(0, 122, 255, 0.3)' }}>
                                        <td data-label="Total" colSpan="3" style={{ padding: '0.75rem' }}>Total Tax</td>
                                        <td data-label="Amount" style={{ padding: '0.75rem', textAlign: 'right' }}>₹ {formatIndianNumber(Math.round(tax))}</td>
                                    </tr>
                                    <tr style={{ fontWeight: '600', background: 'rgba(0, 122, 255, 0.1)' }}>
                                        <td data-label="Cess" colSpan="3" style={{ padding: '0.75rem' }}>Health & Education Cess (4%)</td>
                                        <td data-label="Amount" style={{ padding: '0.75rem', textAlign: 'right' }}>₹ {formatIndianNumber(Math.round(cess))}</td>
                                    </tr>
                                    <tr style={{ fontWeight: '700', background: 'rgba(0, 122, 255, 0.15)', fontSize: '1.05rem' }}>
                                        <td data-label="Final Tax" colSpan="3" style={{ padding: '0.75rem' }}>Total Income Tax</td>
                                        <td data-label="Amount" style={{ padding: '0.75rem', textAlign: 'right', color: 'var(--primary-color)' }}>
                                            ₹ {formatIndianNumber(Math.round(totalTax))}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Section 4: Final Summary */}
                <div className="final-summary-container">
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
                        4. Final Summary
                    </h3>
                    <div className="summary-grid" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className="summary-item">
                            <span className="summary-label">Gross Salary</span>
                            <span className="summary-value">₹ {formatIndianNumber(Math.round(grossSalary))}</span>
                        </div>
                        <div className="summary-item">
                            <span className="summary-label">Total Deductions</span>
                            <span className="summary-value" style={{ color: 'var(--danger-color)' }}>
                                - ₹ {formatIndianNumber(Math.round(totalDeductions))}
                            </span>
                        </div>
                        <div className="summary-item total-row" style={{
                            paddingTop: '0.75rem',
                            borderTop: '2px solid rgba(0, 122, 255, 0.3)',
                            marginTop: '0.5rem'
                        }}>
                            <span className="summary-label" style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>Net Take-Home Pay</span>
                            <span className="summary-value" style={{ color: 'var(--success-color)', fontSize: '1.75rem', fontWeight: '800' }}>
                                ₹ {formatIndianNumber(Math.round(netPay))}
                            </span>
                        </div>
                        <div style={{
                            marginTop: '0.25rem',
                            fontSize: '0.875rem',
                            color: 'var(--text-secondary)',
                            textAlign: 'left'
                        }}>
                            ({viewMode === 'monthly' ? `₹ ${formatIndianNumber(Math.round(netPay / 12))}/month` : 'Annual'})
                        </div>
                    </div>
                </div>

                {/* Close Button */}
                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <button
                        onClick={onClose}
                        className="btn btn-primary"
                        style={{ minWidth: '200px' }}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CalculationModal;
