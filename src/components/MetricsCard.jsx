import React from 'react';
import { formatIndianNumber } from '../utils/taxCalculator';
import Tooltip from './Tooltip';

const MetricsCard = ({ ctc, totalTax, netAnnualSalary, performanceBonus, deductions = [], employerPF = 0 }) => {
    // Calculate percentages
    // In Hand (Fixed) = Net Annual Salary - Performance Bonus (approx)
    const fixedInHand = Math.max(0, netAnnualSalary - performanceBonus);

    // Calculate residual for "Other Deductions" (PF, PT, Gratuity, Insurance, etc.)
    const otherDeductions = ctc - totalTax - fixedInHand - performanceBonus;

    const taxPercentage = ctc > 0 ? ((totalTax / ctc) * 100).toFixed(1) : '0.0';
    const inHandPercentage = ctc > 0 ? ((fixedInHand / ctc) * 100).toFixed(1) : '0.0';
    const performancePercentage = ctc > 0 ? ((performanceBonus / ctc) * 100).toFixed(1) : '0.0';
    const otherPercentage = ctc > 0 ? ((otherDeductions / ctc) * 100).toFixed(1) : '0.0';

    // Construct detailed tooltip for Deductions
    const deductionBreakdown = [
        { label: 'Employer PF', amount: employerPF },
        ...deductions.map(d => ({ label: d.name, amount: d.amount || 0 }))
    ].filter(d => d.amount > 0);

    // Format tooltip text
    const deductionTooltip = deductionBreakdown.length > 0
        ? `Includes: \n${deductionBreakdown.map(d => `${d.label}: ₹${formatIndianNumber(Math.round(d.amount))}`).join('\n')} `
        : 'Remaining components: PF, Professional Tax, Gratuity, Insurance, etc.';

    const metrics = [
        {
            label: 'Income Tax',
            percentage: taxPercentage,
            amount: Math.round(totalTax),
            color: 'var(--danger-color)',
            tooltip: 'Total income tax as a percentage of your CTC.'
        },
        {
            label: 'In Hand (Fixed)',
            percentage: inHandPercentage,
            amount: Math.round(fixedInHand),
            color: 'var(--success-color)',
            tooltip: 'Your fixed take-home pay (Net Salary minus Performance Bonus).'
        },
        {
            label: 'Performance Bonus',
            percentage: performancePercentage,
            amount: Math.round(performanceBonus),
            color: 'var(--accent-color)',
            tooltip: 'Performance-based bonus as a percentage of your CTC.'
        },
        {
            label: 'PF & Deductions',
            percentage: otherPercentage,
            amount: Math.round(otherDeductions),
            color: '#888888', // Neutral color for deductions
            tooltip: deductionTooltip
        }
    ];

    return (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>CTC Breakdown</h3>
                <Tooltip text="Key percentages showing how your CTC is distributed." />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
                {metrics.map((metric, index) => (
                    <div
                        key={index}
                        style={{
                            background: 'rgba(255,255,255,0.03)',
                            padding: '1rem',
                            borderRadius: '8px',
                            borderLeft: `3px solid ${metric.color} `,
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                        onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                {metric.label}
                            </span>
                            <Tooltip text={metric.tooltip} />
                        </div>

                        <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: metric.color, marginBottom: '0.25rem' }}>
                            {metric.percentage}%
                        </div>

                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                            ₹ {formatIndianNumber(metric.amount)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MetricsCard;
