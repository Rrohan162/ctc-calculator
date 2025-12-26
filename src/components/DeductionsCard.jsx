import React from 'react';
import { formatIndianNumber, parseIndianNumber } from '../utils/taxCalculator';
import Tooltip from './Tooltip';

const DeductionsCard = ({ deductions, totalDeductions, standardDeduction, onUpdate, viewMode, ctc, performanceBonus = 0 }) => {
  const handleChange = (id, field, val) => {
    const updated = deductions.map(d => {
      if (d.id === id) {
        if (d.isTax) return d; // Should not be reachable if hidden, but safe to keep
        if (field === 'amount') {
          const parsed = parseIndianNumber(val);
          const annualAmount = viewMode === 'monthly' ? parsed * 12 : parsed;
          return { ...d, amount: annualAmount };
        } else if (field === 'name') {
          return { ...d, name: val };
        }
      }
      return d;
    });
    onUpdate(updated);
  };

  const handleAdd = () => {
    const newId = `custom_deduction_${Date.now()}`;
    const newDeduction = { id: newId, name: 'New Deduction', amount: 0, isFixed: false, disabled: false };
    onUpdate([...deductions, newDeduction]);
  };

  const handleToggle = (id, enable) => {
    const updated = deductions.map(d => {
      if (d.id === id) {
        return { ...d, disabled: !enable, amount: enable ? (d.originalAmount !== undefined ? d.originalAmount : d.amount) : 0, originalAmount: enable ? undefined : d.amount };
      }
      return d;
    });
    onUpdate(updated);
  };

  const handleDelete = (id) => {
    handleToggle(id, false);
  };

  const handleEnable = (id) => {
    handleToggle(id, true);
  };

  // Filter out Tax for display
  const visibleDeductions = deductions.filter(d => !d.isTax);

  // Calculate total visible deductions (excluding Standard Deduction as it's hidden)
  // And excluding Tax (since it's filtered out).
  // Note: `totalDeductions` prop usually includes everything. We should recalculate sum of visible for display consistency.
  const visibleDeductionsSum = visibleDeductions.reduce((sum, d) => sum + (d.disabled ? 0 : d.amount), 0);

  // Net Salary Calculation based on User Request:
  // "Total deductions from Gross minus Performance which equals to net salary"
  // Interpretation: Net Salary = CTC - Performance Bonus - Sum(Visible Deductions e.g. PF, PT, Gratuity)
  const netSalary = ctc - performanceBonus - visibleDeductionsSum;

  return (
    <div className="glass-card">
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h3 style={{ margin: 0, color: 'var(--danger-color)' }}>Deductions</h3>
            <Tooltip text="Amounts deducted from your gross salary including Employer PF. (Standard Deduction & Tax hidden)" />
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem', fontStyle: 'italic' }}>
            Customise as per your requirements here
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {/* Standard Deduction Removed from View as per request */}

        {visibleDeductions.map(d => {
          const displayAmount = viewMode === 'monthly' ? Math.round(d.amount / 12) : Math.round(d.amount);
          const actuallyDisabled = d.disabled;

          // Calculate % of CTC
          const percentage = ctc > 0 ? ((d.amount / ctc) * 100).toFixed(1) : '0.0';

          return (
            <div key={d.id} className="flex-row" style={{ background: actuallyDisabled ? 'rgba(255,255,255,0.01)' : 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '8px', opacity: actuallyDisabled ? 0.6 : 1 }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  className="input-field"
                  value={d.name}
                  onChange={(ev) => handleChange(d.id, 'name', ev.target.value)}
                  disabled={actuallyDisabled}
                  style={{ width: '100%', background: 'transparent', border: 'none', padding: 0, fontSize: '0.95rem', color: actuallyDisabled ? 'var(--text-secondary)' : 'var(--text-primary)' }}
                />
                {d.description && <Tooltip text={d.description} />}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {!actuallyDisabled && (
                  <span
                    style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px', cursor: 'help' }}
                    title={`${percentage}% of Total CTC`}
                  >
                    {percentage}%
                  </span>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {!actuallyDisabled && <span style={{ color: 'var(--danger-color)', fontWeight: 'bold' }}>-</span>}

                  {actuallyDisabled ? (
                    <button className="btn btn-primary" onClick={() => handleEnable(d.id)} style={{ padding: '4px 12px', fontSize: '0.8rem' }}>Add</button>
                  ) : (
                    <>
                      <input
                        type="text"
                        className="input-field"
                        value={formatIndianNumber(displayAmount)}
                        onChange={(ev) => handleChange(d.id, 'amount', ev.target.value)}
                        style={{ width: '100px', textAlign: 'right', padding: '0.25rem', fontSize: '0.95rem' }}
                      />
                      <button className="btn btn-icon" onClick={() => handleDelete(d.id)} style={{ color: 'var(--danger-color)', padding: '0.25rem' }} title="Remove">×</button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}

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
          onMouseOver={(e) => { e.target.style.borderColor = 'var(--danger-color)'; e.target.style.color = 'var(--danger-color)'; }}
          onMouseOut={(e) => { e.target.style.borderColor = 'var(--border-color)'; e.target.style.color = 'var(--text-secondary)'; }}
        >
          + Add New Deduction
        </button>
      </div>

      <div className="flex-row" style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', fontWeight: 'bold', fontSize: '1.1rem' }}>
        <span>Total Deductions</span>
        <span style={{ color: 'var(--danger-color)' }}>-₹ {formatIndianNumber(Math.round(viewMode === 'monthly' ? visibleDeductionsSum / 12 : visibleDeductionsSum))}</span>
      </div>

      <div className="flex-row" style={{ marginTop: '0.5rem', paddingTop: '0.5rem', fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--accent-color)' }}>
        <span>Net Salary (Pre-Tax)</span>
        <span>₹ {formatIndianNumber(Math.round(viewMode === 'monthly' ? netSalary / 12 : netSalary))}</span>
      </div>
    </div >
  );
};

export default DeductionsCard;
