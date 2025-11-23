import React from 'react';
import { formatIndianNumber, parseIndianNumber } from '../utils/taxCalculator';
import Tooltip from './Tooltip';

const DeductionsCard = ({ deductions, totalDeductions, standardDeduction, onUpdate, viewMode, ctc, pfCapEnabled, onPfCapToggle, homeLoanDeduction, employerPF }) => {

  const handleChange = (id, field, val) => {
    const updated = deductions.map(d => {
      if (d.id === id) {
        // Prevent editing tax amounts directly here
        if (d.isTax) return d;

        if (field === 'amount') {
          const parsed = parseIndianNumber(val);
          // Convert the displayed monthly/annual amount back to annual for storage
          const annualAmount = viewMode === 'monthly' ? parsed * 12 : parsed;
          // Keep isFixed status for gratuity, only change for truly custom deductions
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
        // If enabling, restore original amount if it was disabled.
        // If disabling, set amount to 0.
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

  return (
    <div className="glass-card">
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h3 style={{ margin: 0, color: 'var(--danger-color)' }}>Deductions</h3>
              <Tooltip text="Amounts deducted from your gross salary." />
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem', fontStyle: 'italic' }}>
              Customise as per your requirements here
            </div>
          </div>

          {/* PF Cap Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>
              <input
                type="checkbox"
                checked={pfCapEnabled}
                onChange={(e) => onPfCapToggle(e.target.checked)}
                style={{ cursor: 'pointer' }}
              />
              Cap PF at ₹1,800/mo
            </label>
            <Tooltip text="Statutory PF cap: ₹1,800/month (₹21,600/year). Applies to both Employer and Employee PF." />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {/* Standard Deduction Display */}
        <div className="flex-row" style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>Standard Deduction</span>
            <Tooltip text="Flat deduction allowed for salaried employees. ₹75,000 for New Regime, ₹50,000 for Old." />
          </div>
          <span>- ₹ {formatIndianNumber(viewMode === 'monthly' ? Math.round(standardDeduction / 12) : standardDeduction)}</span>
        </div>

        {deductions.map(d => {
          const displayAmount = viewMode === 'monthly' ? Math.round(d.amount / 12) : Math.round(d.amount);
          const actuallyDisabled = d.disabled;

          // Calculate % of CTC
          const percentage = ctc > 0 ? ((d.amount / ctc) * 100).toFixed(1) : '0.0';

          return (
            <div key={d.id} className="flex-row" style={{ background: actuallyDisabled ? 'rgba(255,255,255,0.01)' : 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '8px', opacity: actuallyDisabled ? 0.6 : 1 }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {d.isFixed ? (
                  <span style={{ fontSize: '0.95rem', color: actuallyDisabled ? 'var(--text-secondary)' : 'var(--text-primary)' }}>{d.name}</span>
                ) : (
                  <input
                    className="input-field"
                    value={d.name}
                    onChange={(ev) => handleChange(d.id, 'name', ev.target.value)}
                    disabled={actuallyDisabled}
                    style={{ width: '100%', background: 'transparent', border: 'none', padding: 0, fontSize: '0.95rem', color: actuallyDisabled ? 'var(--text-secondary)' : 'var(--text-primary)' }}
                  />
                )}
                {/* Always show tooltip if description exists */}
                {d.description && <Tooltip text={d.description} />}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {/* Percentage Badge */}
                {!actuallyDisabled && (
                  d.id === 'gratuity' ? (
                    <span
                      style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px', cursor: 'help' }}
                      title="4.81% of Basic Salary"
                    >
                      4.81% <span style={{ fontSize: '0.7rem' }}>(of Basic)</span>
                    </span>
                  ) : (
                    <span
                      style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px', cursor: 'help' }}
                      title={`${percentage}% of Total CTC`}
                    >
                      {percentage}%
                    </span>
                  )
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {!actuallyDisabled && <span style={{ color: 'var(--danger-color)', fontWeight: 'bold' }}>-</span>}

                  {actuallyDisabled ? (
                    <button className="btn btn-primary" onClick={() => handleEnable(d.id)} style={{ padding: '4px 12px', fontSize: '0.8rem' }}>Add</button>
                  ) : (
                    <>
                      {d.isTax ? (
                        <span style={{ width: '100px', textAlign: 'right', padding: '0.25rem', fontSize: '0.95rem' }}>
                          ₹ {formatIndianNumber(displayAmount)}
                        </span>
                      ) : (
                        <input
                          type="text"
                          className="input-field"
                          value={formatIndianNumber(displayAmount)}
                          onChange={(ev) => handleChange(d.id, 'amount', ev.target.value)}
                          style={{ width: '100px', textAlign: 'right', padding: '0.25rem', fontSize: '0.95rem' }}
                        />
                      )}

                      {!d.isTax && (
                        <button className="btn btn-icon" onClick={() => handleDelete(d.id)} style={{ color: 'var(--danger-color)', padding: '0.25rem' }} title="Remove">×</button>
                      )}
                      {d.isTax && <span style={{ width: '24px' }}></span>} {/* Spacer for alignment */}
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Home Loan Interest Deduction */}
        {homeLoanDeduction > 0 && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.75rem 0',
            borderBottom: '1px solid var(--border-color)',
            background: 'rgba(0, 122, 255, 0.03)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>🏠 Home Loan Interest</span>
              <Tooltip text="Deduction for home loan interest paid (capped at ₹2,00,000/year)." />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: 'var(--danger-color)', fontWeight: 'bold' }}>-</span>
              <span style={{ width: '100px', textAlign: 'right', padding: '0.25rem', fontSize: '0.95rem', fontWeight: '500' }}>
                ₹ {formatIndianNumber(Math.round(viewMode === 'monthly' ? homeLoanDeduction / 12 : homeLoanDeduction))}
              </span>
              <span style={{ width: '24px' }}></span> {/* Spacer for alignment */}
            </div>
          </div>
        )}

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
        <span style={{ color: 'var(--danger-color)' }}>-₹ {formatIndianNumber(Math.round(viewMode === 'monthly' ? totalDeductions / 12 : totalDeductions))}</span>
      </div>
    </div >
  );
};

export default DeductionsCard;
