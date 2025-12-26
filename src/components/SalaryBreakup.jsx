import React from 'react';
import { formatIndianNumber, parseIndianNumber } from '../utils/taxCalculator';
import Tooltip from './Tooltip';

const SalaryBreakup = ({ details, taxDetails, regime, onEarningsUpdate, onDeductionsUpdate }) => {
  const { earnings, deductions: allDeductions, grossSalary, employerPF, ctc } = details;
  const { totalTax, standardDeduction } = taxDetails;

  // Combine all deductions including Tax for display
  // We want to show Tax in the list but it's calculated externally.
  // So we display it but it's not editable here directly (it's a result).
  const displayDeductions = [
    ...allDeductions,
    { id: 'tax', name: 'Income Tax', amount: totalTax, isTax: true, isFixed: true }
  ];

  const totalDeductions = displayDeductions.reduce((sum, d) => sum + d.amount, 0);
  const netAnnualSalary = grossSalary - totalDeductions;
  const netMonthlySalary = Math.round(netAnnualSalary / 12);

  // Handlers for Earnings
  const handleEarningChange = (id, field, val) => {
    const updated = earnings.map(e => {
      if (e.id === id) {
        if (field === 'amount') {
          return { ...e, amount: parseIndianNumber(val), type: 'manual' };
        } else if (field === 'name') {
          return { ...e, name: val };
        }
      }
      return e;
    });
    onEarningsUpdate(updated);
  };

  const handleAddEarning = () => {
    const newId = `custom_earning_${Date.now()}`;
    const newEarning = { id: newId, name: 'New Allowance', amount: 0, type: 'manual', taxable: true };
    onEarningsUpdate([...earnings, newEarning]);
  };

  const handleDeleteEarning = (id) => {
    const updated = earnings.filter(e => e.id !== id);
    onEarningsUpdate(updated);
  };

  // Handlers for Deductions
  const handleDeductionChange = (id, field, val) => {
    // We need to find if it's a custom deduction or fixed.
    // Fixed deductions (PF, PT) are calculated in utils, but maybe we want to allow overriding?
    // For now, let's allow editing custom ones.
    // If user edits a fixed one, we might need to convert it to manual?
    // Simplified: Only allow editing name/amount of custom deductions.

    const updated = allDeductions.map(d => {
      if (d.id === id) {
        if (d.isFixed) return d; // Cannot edit fixed for now
        if (field === 'amount') {
          return { ...d, amount: parseIndianNumber(val) };
        } else if (field === 'name') {
          return { ...d, name: val };
        }
      }
      return d;
    });
    onDeductionsUpdate(updated);
  };

  const handleAddDeduction = () => {
    const newId = `custom_deduction_${Date.now()}`;
    const newDeduction = { id: newId, name: 'New Deduction', amount: 0, isFixed: false };
    // We need to pass the full list back? No, onDeductionsUpdate expects the full list?
    // App.jsx filters for custom only. So we should pass [...allDeductions, new]
    onDeductionsUpdate([...allDeductions, newDeduction]);
  };

  const handleDeleteDeduction = (id) => {
    const updated = allDeductions.filter(d => d.id !== id);
    onDeductionsUpdate(updated);
  };

  return (
    <div className="glass-card">
      {/* Net Pay Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>ESTIMATED NET MONTHLY PAY</div>
        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--success-color)', textShadow: '0 0 20px rgba(16, 185, 129, 0.3)' }}>
          ₹ {formatIndianNumber(netMonthlySalary)}
        </div>
        <div style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
          Annual Net: ₹ {formatIndianNumber(Math.round(netAnnualSalary))}
        </div>
      </div>

      <div className="grid-layout" style={{ gap: '2rem' }}>
        {/* Earnings Section */}
        <div>
          <div className="flex-row" style={{ marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, color: 'var(--accent-color)' }}>Earnings</h3>
            <button className="btn btn-icon" onClick={handleAddEarning} title="Add Earning">+</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {earnings.map(e => (
              <div key={e.id} className="flex-row" style={{ background: 'rgba(255,255,255,0.03)', padding: '0.5rem', borderRadius: '8px' }}>
                <input
                  className="input-field"
                  value={e.name}
                  onChange={(ev) => handleEarningChange(e.id, 'name', ev.target.value)}
                  style={{ width: '100%', background: 'transparent', border: 'none', padding: 0, fontSize: '0.95rem' }}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="text"
                    className="input-field"
                    value={formatIndianNumber(e.amount)}
                    onChange={(ev) => handleEarningChange(e.id, 'amount', ev.target.value)}
                    style={{ width: '100px', textAlign: 'right', padding: '0.25rem', fontSize: '0.95rem' }}
                  />
                  <button className="btn btn-icon" onClick={() => handleDeleteEarning(e.id)} style={{ color: 'var(--danger-color)', padding: '0.25rem' }}>×</button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex-row" style={{ marginTop: '1rem', fontWeight: 'bold' }}>
            <span>Gross Salary</span>
            <span>₹ {formatIndianNumber(Math.round(grossSalary))}</span>
          </div>
        </div>

        {/* Deductions Section */}
        <div>
          <div className="flex-row" style={{ marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, color: 'var(--danger-color)' }}>Deductions</h3>
            <button className="btn btn-icon" onClick={handleAddDeduction} title="Add Deduction">+</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {/* Standard Deduction Display */}
            <div className="flex-row" style={{ padding: '0.5rem', color: 'var(--text-secondary)' }}>
              <span>Standard Deduction</span>
              <span>₹ {formatIndianNumber(standardDeduction)}</span>
            </div>

            {displayDeductions.map(d => (
              <div key={d.id} className="flex-row" style={{ background: 'rgba(255,255,255,0.03)', padding: '0.5rem', borderRadius: '8px' }}>
                {d.isFixed ? (
                  <span style={{ flex: 1, fontSize: '0.95rem' }}>{d.name}</span>
                ) : (
                  <input
                    className="input-field"
                    value={d.name}
                    onChange={(ev) => handleDeductionChange(d.id, 'name', ev.target.value)}
                    style={{ width: '100%', background: 'transparent', border: 'none', padding: 0, fontSize: '0.95rem' }}
                  />
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {d.isFixed ? (
                    <span style={{ width: '100px', textAlign: 'right', padding: '0.25rem', fontSize: '0.95rem' }}>
                      ₹ {formatIndianNumber(Math.round(d.amount))}
                    </span>
                  ) : (
                    <input
                      type="text"
                      className="input-field"
                      value={formatIndianNumber(d.amount)}
                      onChange={(ev) => handleDeductionChange(d.id, 'amount', ev.target.value)}
                      style={{ width: '100px', textAlign: 'right', padding: '0.25rem', fontSize: '0.95rem' }}
                    />
                  )}
                  {!d.isFixed && (
                    <button className="btn btn-icon" onClick={() => handleDeleteDeduction(d.id)} style={{ color: 'var(--danger-color)', padding: '0.25rem' }}>×</button>
                  )}
                  {d.isFixed && <span style={{ width: '24px' }}></span>}
                </div>
              </div>
            ))}
          </div>

          <div className="flex-row" style={{ marginTop: '1rem', fontWeight: 'bold' }}>
            <span>Total Deductions</span>
            <span style={{ color: 'var(--danger-color)' }}>-₹ {formatIndianNumber(Math.round(totalDeductions))}</span>
          </div>
        </div>
      </div>

      {/* CTC Footer */}
      <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
        <div className="flex-row" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          <span>Employer PF Contribution</span>
          <span>₹ {formatIndianNumber(Math.round(employerPF))}</span>
        </div>
        <div className="flex-row" style={{ marginTop: '0.5rem', fontSize: '1.1rem', fontWeight: 'bold' }}>
          <span>Total Cost to Company (CTC)</span>
          <span>₹ {formatIndianNumber(Math.round(ctc))}</span>
        </div>
      </div>
    </div>
  );
};

export default SalaryBreakup;
