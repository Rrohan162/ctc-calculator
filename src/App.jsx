import React, { useState, useEffect } from 'react';
import CTCInput from './components/CTCInput';
import NetPayCard from './components/NetPayCard';
import EarningsCard from './components/EarningsCard';
import DeductionsCard from './components/DeductionsCard';
import MetricsCard from './components/MetricsCard';
import DisclaimerBanner from './components/DisclaimerBanner';
import CalculationModal from './components/CalculationModal';
import HomeLoanSection from './components/HomeLoanSection';
import IncentiveSection from './components/IncentiveSection';
import { DEFAULT_EARNINGS, calculateBreakup } from './utils/salaryComponents';
import { calculateTax, formatIndianNumber } from './utils/taxCalculator';

function App() {
  const [ctc, setCtc] = useState(0);
  const [earningsInput, setEarningsInput] = useState(DEFAULT_EARNINGS);
  const [customDeductions, setCustomDeductions] = useState([]);
  const [viewMode, setViewMode] = useState('yearly'); // 'yearly' or 'monthly'
  const [pfCapEnabled, setPfCapEnabled] = useState(true); // PF cap toggle - default ON
  const [salaryDetails, setSalaryDetails] = useState(null);
  const [taxCalculation, setTaxCalculation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Calculation modal state
  const [homeLoanInterest, setHomeLoanInterest] = useState(0); // Home loan interest paid
  const [rentReceived, setRentReceived] = useState(0); // Rent received from property
  const [realisticPayout, setRealisticPayout] = useState(80); // Realistic incentive payout %
  const [bonusAmount, setBonusAmount] = useState(0); // Separate state for bonus amount

  useEffect(() => {
    const details = calculateBreakup(ctc, earningsInput, customDeductions, pfCapEnabled, bonusAmount);
    setSalaryDetails(details);
  }, [ctc, earningsInput, customDeductions, pfCapEnabled, bonusAmount]);

  useEffect(() => {
    if (!salaryDetails) return;

    const { grossSalary, deductions: allDeductions } = salaryDetails;

    // Always use New regime (FY 2025-26)
    const regime = 'new';
    const standardDeduction = 75000;

    let taxableIncome = grossSalary - standardDeduction;

    // Add home loan interest deduction (interest - rent received), capped at ₹2L
    const homeLoanDeduction = Math.min(Math.max(0, homeLoanInterest - rentReceived), 200000);
    taxableIncome -= homeLoanDeduction;

    let netTaxableForTax = Math.max(0, taxableIncome);

    const taxResult = calculateTax(netTaxableForTax, regime);
    setTaxCalculation(taxResult);

  }, [salaryDetails, homeLoanInterest, rentReceived]);

  const handleEarningsUpdate = (updatedEarnings) => {
    setEarningsInput(updatedEarnings);
  };

  const handleDeductionsUpdate = (updatedDeductions) => {
    const customOnly = updatedDeductions.filter(d => !d.isFixed);
    setCustomDeductions(customOnly);
  };

  // Only calculate these when we have data
  let displayDeductions = [];
  let totalDeductions = 0;
  let netAnnualSalary = 0;
  let netMonthlySalary = 0;
  let performanceBonus = 0;
  let grossSalary = 0;
  let earnings = [];
  let allDeductions = [];
  let employerPF = 0;
  let totalTax = 0;
  let standardDeduction = 0;
  let monthlyBase = 0;
  let monthlyIncentive = 0;
  let taxOnIncentive = 0;
  let taxFixed = 0;
  let taxRealistic = 0;
  let bonusTaxRate = 0;

  if (salaryDetails && taxCalculation) {
    grossSalary = salaryDetails.grossSalary;
    allDeductions = salaryDetails.deductions;
    earnings = salaryDetails.earnings;
    employerPF = salaryDetails.employerPF;
    totalTax = taxCalculation.totalTax;
    standardDeduction = taxCalculation.standardDeduction;

    // Calculate performance bonus and realistic incentive
    // performanceBonus is now from state 'bonusAmount', not earnings array
    performanceBonus = bonusAmount;
    const realisticIncentive = (performanceBonus * realisticPayout) / 100;

    // Calculate Base Net Pay (0% bonus scenario)
    // We need to calculate tax on fixed pay first
    const grossOnlyFixed = grossSalary - performanceBonus;
    const regime = 'new';
    const homeLoanDeduction = Math.min(Math.max(0, homeLoanInterest - rentReceived), 200000);
    const taxableFixed = Math.max(0, grossOnlyFixed - standardDeduction - homeLoanDeduction);
    const taxFixedResult = calculateTax(taxableFixed, regime);
    taxFixed = taxFixedResult.totalTax;

    // Calculate tax on incentive (Simplified Logic as per User Request)
    // 1. Check if overall CTC is above 24 Lakh
    // 2. If yes, apply 30% tax on the FULL bonus amount
    // 3. If no, apply the applicable slab rate (estimated)

    bonusTaxRate = 0;

    if (ctc > 2400000) {
      bonusTaxRate = 0.30;
    } else {
      // Fallback to approximate slab rates for < 24L
      // New Regime FY 25-26: 
      // 20-24L: 25%, 16-20L: 20%, 12-16L: 15%, 8-12L: 10%, 4-8L: 5%
      // We use the rate corresponding to the gross salary level
      if (grossSalary > 2000000) bonusTaxRate = 0.25;
      else if (grossSalary > 1600000) bonusTaxRate = 0.20;
      else if (grossSalary > 1200000) bonusTaxRate = 0.15;
      else if (grossSalary > 800000) bonusTaxRate = 0.10;
      else if (grossSalary > 400000) bonusTaxRate = 0.05;
      else bonusTaxRate = 0;
    }

    // 2. Calculate Tax on Full Bonus
    // "Take the annual bonus amount (without the realistic payout %) and apply the tax %"
    const taxOnFullBonus = performanceBonus * bonusTaxRate;

    // 3. Calculate Post Tax Incentive
    // "Realistic payout (80%) MINUS Tax on Full Bonus (30%)"
    // Note: taxOnIncentive here represents the tax amount to be deducted
    taxOnIncentive = taxOnFullBonus;

    // Post Tax = (Bonus * Payout%) - TaxOnFullBonus
    const postTaxIncentive = realisticIncentive - taxOnIncentive;

    displayDeductions = [
      ...allDeductions,
      { id: 'tax', name: 'Income Tax', amount: totalTax, isTax: true, isFixed: true }
    ];

    totalDeductions = displayDeductions.reduce((sum, d) => sum + d.amount, 0);

    // Calculate Base Net Pay (0% bonus scenario)
    // We need to subtract deductions that are fixed (PF, PT, etc)
    // Note: 'allDeductions' includes PF, PT, Gratuity. 
    // Gratuity is not deducted from monthly pay usually, but here it is in the deductions list.
    // We'll assume all items in 'allDeductions' reduce the in-hand pay for this calculation.
    const deductionsFixed = allDeductions.reduce((sum, d) => sum + d.amount, 0);
    const baseNetPay = grossOnlyFixed - deductionsFixed - taxFixed;

    // Calculate Realistic Incentive Net Pay
    const realisticBonusNet = postTaxIncentive;

    netAnnualSalary = Math.round(baseNetPay + realisticBonusNet);
    netMonthlySalary = Math.round(netAnnualSalary / 12);

    monthlyBase = baseNetPay / 12;
    monthlyIncentive = realisticBonusNet / 12;
  }

  return (
    <div className="app-container">
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: '800',
          background: 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin: 0,
          letterSpacing: '-0.03em'
        }}>
          CTC Calculator
        </h1>
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '1rem',
          fontWeight: '500',
          marginTop: '0.5rem'
        }}>
          FY 2025-26 • New Tax Regime
        </p>
      </header>

      {/* Disclaimer Banner */}
      <DisclaimerBanner />

      {/* Top Section: Input & Controls */}
      <div className="glass-card" style={{ marginBottom: '2rem', padding: '2rem' }}>
        <CTCInput
          value={ctc}
          onChange={setCtc}
        />
      </div>

      {/* Detailed Breakdown (Only visible if CTC > 0) */}
      {ctc > 0 && (
        <>
          {/* Incentive Section - Moved here as requested */}
          <IncentiveSection
            bonusAmount={bonusAmount}
            setBonusAmount={setBonusAmount}
            realisticPayout={realisticPayout}
            setRealisticPayout={setRealisticPayout}
            taxOnIncentive={taxOnIncentive}
            taxFixed={taxFixed}
            bonusTaxRate={bonusTaxRate}
          />

          <NetPayCard
            netMonthly={netMonthlySalary}
            netAnnual={netAnnualSalary}
            monthlyIncentive={monthlyIncentive}
            monthlyBase={monthlyBase}
          />

          <MetricsCard
            ctc={ctc}
            totalTax={totalTax}
            netAnnualSalary={netAnnualSalary}
            performanceBonus={performanceBonus}
            deductions={allDeductions}
            employerPF={employerPF}
          />

          {/* Spacer */}
          <div style={{ height: '2rem' }}></div>

          {/* Home Loan Interest Section */}
          <HomeLoanSection
            interestPaid={homeLoanInterest}
            setInterestPaid={setHomeLoanInterest}
            rentReceived={rentReceived}
            setRentReceived={setRentReceived}
          />

          {/* View Mode Toggle - Above Earnings/Deductions */}
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div className="toggle-container" style={{
              background: 'rgba(0, 0, 0, 0.05)',
              padding: '4px',
              borderRadius: '12px',
              display: 'inline-flex'
            }}>
              <button
                onClick={() => setViewMode('yearly')}
                style={{
                  background: viewMode === 'yearly' ? 'var(--primary-color)' : 'transparent',
                  color: viewMode === 'yearly' ? 'white' : 'var(--text-secondary)',
                  border: 'none',
                  padding: '10px 24px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.9375rem',
                  transition: 'all 0.3s ease'
                }}
              >
                📅 Yearly
              </button>
              <button
                onClick={() => setViewMode('monthly')}
                style={{
                  background: viewMode === 'monthly' ? 'var(--primary-color)' : 'transparent',
                  color: viewMode === 'monthly' ? 'white' : 'var(--text-secondary)',
                  border: 'none',
                  padding: '10px 24px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.9375rem',
                  transition: 'all 0.3s ease'
                }}
              >
                📆 Monthly
              </button>
            </div>
          </div>

          <div className="grid-layout" style={{ alignItems: 'start' }}>
            {/* Left Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <EarningsCard
                earnings={earnings}
                grossSalary={grossSalary}
                ctc={ctc}
                onUpdate={handleEarningsUpdate}
                viewMode={viewMode}
              />
            </div>

            {/* Right Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <DeductionsCard
                deductions={displayDeductions}
                totalDeductions={totalDeductions}
                standardDeduction={standardDeduction}
                ctc={ctc}
                onUpdate={handleDeductionsUpdate}
                viewMode={viewMode}
                pfCapEnabled={pfCapEnabled}
                onPfCapToggle={setPfCapEnabled}
                homeLoanDeduction={(homeLoanInterest > 0 && rentReceived > 0) ? Math.min(Math.max(0, homeLoanInterest - rentReceived), 200000) : 0}
                employerPF={employerPF}
              />
            </div>
          </div>

          {/* View Calculation Button - Moved below grid */}
          <div style={{ textAlign: 'center', marginBottom: '2rem', marginTop: '2.5rem' }}>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn btn-primary"
              style={{
                fontSize: '1.0625rem',
                padding: '1rem 2.5rem',
                minWidth: '250px',
                boxShadow: '0 4px 16px rgba(0, 122, 255, 0.3)'
              }}
            >
              📊 View Detailed Calculation
            </button>
          </div>
        </>
      )}

      <CalculationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        salaryDetails={salaryDetails}
        taxCalculation={taxCalculation}
        ctc={ctc}
        viewMode={viewMode}
        homeLoanDeduction={Math.min(Math.max(0, homeLoanInterest - rentReceived), 200000)}
      />

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        marginTop: '3rem',
        padding: '1rem',
        color: 'var(--text-secondary)',
        fontSize: '0.9rem',
        fontWeight: '500'
      }}>
        Built with <span style={{ color: '#FF3B30' }}>❤️</span> by Rohan Mayeker
      </footer>
    </div>
  );
}

export default App;
