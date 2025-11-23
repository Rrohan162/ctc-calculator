export const formatIndianNumber = (num) => {
  if (num === null || num === undefined) return '';
  const x = num.toString();
  const lastThree = x.substring(x.length - 3);
  const otherNumbers = x.substring(0, x.length - 3);
  if (otherNumbers !== '') {
    return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
  }
  return lastThree;
};

export const parseIndianNumber = (str) => {
  if (!str) return 0;
  return parseInt(str.replace(/,/g, ''), 10) || 0;
};

export const calculateTax = (taxableIncome, regime = 'new') => {
  let tax = 0;
  let cess = 0;
  
  // Standard Deduction
  const standardDeduction = regime === 'new' ? 75000 : 50000;
  const netTaxableIncome = Math.max(0, taxableIncome - standardDeduction);

  if (regime === 'new') {
    // New Regime FY 2025-26
    // 0-4L: Nil
    // 4-8L: 5%
    // 8-12L: 10%
    // 12-16L: 15%
    // 16-20L: 20%
    // 20-24L: 25%
    // >24L: 30%
    
    // Rebate u/s 87A: Tax is 0 if income <= 12L (after std deduction? No, usually on taxable income)
    // Actually, rebate is up to 60k. 
    // Let's calculate tax first.
    
    const slabs = [
      { limit: 400000, rate: 0 },
      { limit: 800000, rate: 0.05 },
      { limit: 1200000, rate: 0.10 },
      { limit: 1600000, rate: 0.15 },
      { limit: 2000000, rate: 0.20 },
      { limit: 2400000, rate: 0.25 },
      { limit: Infinity, rate: 0.30 },
    ];

    let remainingIncome = netTaxableIncome;
    let previousLimit = 0;

    for (const slab of slabs) {
      if (remainingIncome <= 0) break;
      const taxableAtThisSlab = Math.min(remainingIncome, slab.limit - previousLimit);
      // Fix: logic is slightly wrong. 
      // Correct logic:
      // Income up to 4L: 0
      // Income 4L-8L: 5%
      // etc.
    }
    
    // Re-implementing slab logic correctly
    if (netTaxableIncome > 2400000) {
      tax += (netTaxableIncome - 2400000) * 0.30;
      tax += 400000 * 0.25; // 20-24L
      tax += 400000 * 0.20; // 16-20L
      tax += 400000 * 0.15; // 12-16L
      tax += 400000 * 0.10; // 8-12L
      tax += 400000 * 0.05; // 4-8L
    } else if (netTaxableIncome > 2000000) {
      tax += (netTaxableIncome - 2000000) * 0.25;
      tax += 400000 * 0.20;
      tax += 400000 * 0.15;
      tax += 400000 * 0.10;
      tax += 400000 * 0.05;
    } else if (netTaxableIncome > 1600000) {
      tax += (netTaxableIncome - 1600000) * 0.20;
      tax += 400000 * 0.15;
      tax += 400000 * 0.10;
      tax += 400000 * 0.05;
    } else if (netTaxableIncome > 1200000) {
      tax += (netTaxableIncome - 1200000) * 0.15;
      tax += 400000 * 0.10;
      tax += 400000 * 0.05;
    } else if (netTaxableIncome > 800000) {
      tax += (netTaxableIncome - 800000) * 0.10;
      tax += 400000 * 0.05;
    } else if (netTaxableIncome > 400000) {
      tax += (netTaxableIncome - 400000) * 0.05;
    }

    // Rebate u/s 87A
    // If taxable income <= 12,00,000, rebate up to 60,000
    // Wait, if income is 12L, tax is:
    // 4-8: 20k
    // 8-12: 40k
    // Total 60k. So rebate covers it.
    // But wait, standard deduction is 75k.
    // So if Gross is 12.75L -> Net is 12L -> Tax 60k -> Rebate 60k -> Tax 0.
    // If Net Taxable Income <= 12,00,000, Tax is 0.
    
    if (netTaxableIncome <= 1200000) {
      tax = 0;
    }

  } else {
    // Old Regime
    // 0-2.5L: Nil
    // 2.5-5L: 5%
    // 5-10L: 20%
    // >10L: 30%
    
    if (netTaxableIncome > 1000000) {
      tax += (netTaxableIncome - 1000000) * 0.30;
      tax += 500000 * 0.20; // 5-10L
      tax += 250000 * 0.05; // 2.5-5L
    } else if (netTaxableIncome > 500000) {
      tax += (netTaxableIncome - 500000) * 0.20;
      tax += 250000 * 0.05;
    } else if (netTaxableIncome > 250000) {
      tax += (netTaxableIncome - 250000) * 0.05;
    }
    
    // Rebate u/s 87A
    // If taxable income <= 5,00,000, rebate up to 12,500
    if (netTaxableIncome <= 500000) {
      tax = 0;
    }
  }

  cess = tax * 0.04;
  const totalTax = tax + cess;

  return {
    tax,
    cess,
    totalTax,
    netTaxableIncome,
    standardDeduction
  };
};
