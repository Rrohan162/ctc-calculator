export const DEFAULT_EARNINGS = [
    { id: 'basic', name: 'Basic Salary', type: 'percentage', percentage: 50, taxable: true, description: 'Typically 50% of CTC. Fully taxable.' },
    { id: 'hra', name: 'HRA', type: 'formula', formula: 'basic * 0.5', taxable: 'partial', description: 'House Rent Allowance. Typically 50% of Basic for metros, 40% for non-metros. Exempt u/s 10(13A) subject to rent paid.' },
    { id: 'special', name: 'Special Allowance', type: 'balancing', taxable: true, description: 'Balancing component to match Gross Salary. Fully taxable.' },
];

export const calculateBreakup = (ctc, earningsInput = DEFAULT_EARNINGS, customDeductions = [], bonusAmount = 0) => {
    let earnings = earningsInput.map(e => ({ ...e }));

    // Calculate Basic first
    const basicComp = earnings.find(e => e.id === 'basic');
    if (basicComp) {
        if (basicComp.disabled) {
            basicComp.amount = 0;
        } else if (basicComp.type === 'percentage') {
            basicComp.amount = (ctc * basicComp.percentage) / 100;
        } else {
            basicComp.amount = basicComp.amount || 0;
        }
    }
    const basicAmount = basicComp ? basicComp.amount : 0;

    // PF Calculation (Combined Single Entry as per request)
    // "Combine employer and employee pf together as 21600 single entry"
    // We treat this as a single deduction from CTC.
    const PF_CAP_ANNUAL = 21600;

    // Check for custom override
    const customPF = customDeductions.find(d => d.id === 'pf');
    let pfAmount;
    if (customPF && !customPF.disabled) {
        pfAmount = customPF.amount;
    } else {
        // Default logic: 12% of basic or cap, whichever is lower. 
        // User said "always be 21,600" as default, implying the cap is the standard target.
        pfAmount = Math.min(basicAmount * 0.12, PF_CAP_ANNUAL);
    }

    // Employer PF effectively removed as a separate "pre-gross" deduction.
    // We set it to 0 for the Gross Salary calculation to keep Gross = CTC (Fixed).
    const employerPF = 0;

    // Standard Deductions logic (PT, Gratuity)
    const customPT = customDeductions.find(d => d.id === 'pt');
    const customGratuity = customDeductions.find(d => d.id === 'gratuity');

    let professionalTax;
    if (customPT && !customPT.disabled) {
        professionalTax = customPT.amount;
    } else {
        professionalTax = 2400;
    }

    let gratuityAmount;
    if (customGratuity && !customGratuity.disabled) {
        gratuityAmount = customGratuity.amount;
    } else {
        gratuityAmount = basicAmount * 0.0481;
    }

    const baseDeductions = [
        { id: 'pf', name: 'Provident Fund', amount: pfAmount, isFixed: false, description: 'Combined Provident Fund deduction. Capped at ₹1,800/mo.', isTax: false },
        { id: 'pt', name: 'Professional Tax', amount: professionalTax, isFixed: false, description: 'State-levied tax. Fixed at ₹2,400/yr.', isTax: false },
        { id: 'gratuity', name: 'Gratuity', amount: gratuityAmount, isFixed: false, description: 'Annual gratuity accrual. ~4.81% of Basic.', isTax: false },
    ];

    // Merge with custom deductions
    const customDeductionIds = customDeductions.map(d => d.id);
    const filteredBaseDeductions = baseDeductions.filter(d => !customDeductionIds.includes(d.id));
    const allDeductions = [...filteredBaseDeductions, ...customDeductions];

    // Calculate sum of deductions to subtract from Special Allowance
    // Must include the single PF now.
    const deductionsSum = allDeductions.reduce((sum, d) => {
        if (d.disabled) return sum;
        // Double check we don't subtract tax/std if they somehow got here (unlikely in this function)
        if (d.id === 'tax' || d.id === 'standardDeduction') return sum;
        return sum + (d.amount || 0);
    }, 0);

    // Gross Salary = CTC - Employer PF
    // With Employer PF combined/removed from separate view, Gross Salary (Fixed) is effectively CTC.
    const grossSalary = ctc - employerPF; // employerPF is 0 above

    // Calculate other earnings
    earnings.forEach(e => {
        if (e.id === 'basic') return;

        // Remove bonus from earnings array logic if it was there
        if (e.id === 'bonus') return;

        if (e.disabled) {
            e.amount = 0;
            return;
        }

        if (e.type === 'formula' && e.id === 'hra') {
            e.amount = basicAmount * 0.5;
        } else if (e.type === 'balancing') {
            // Will calculate last
        } else if (e.type === 'fixed') {
            e.amount = e.amount || 0;
        } else if (e.type === 'manual') {
            e.amount = e.amount || 0;
        }
    });

    // Calculate Special Allowance (Balancing)
    // Formula: CTC - Basic - HRA - Bonus - Sum(All Deductions)

    const basicAndHraSum = earnings.reduce((sum, e) => {
        if (e.id === 'special' || e.id === 'bonus' || e.type === 'balancing') return sum;
        if (e.disabled) return sum;
        return sum + (e.amount || 0);
    }, 0);

    const specialComp = earnings.find(e => e.id === 'special');
    if (specialComp) {
        if (specialComp.disabled) {
            specialComp.amount = 0;
        } else {
            specialComp.amount = Math.max(0, ctc - basicAndHraSum - bonusAmount - deductionsSum);
        }
    }

    // Filter out bonus if it was somehow in input, as we want to display it separate
    earnings = earnings.filter(e => e.id !== 'bonus');

    const totalEarnings = earnings.reduce((sum, e) => sum + (e.amount || 0), 0);

    return {
        ctc,
        grossSalary: totalEarnings, // This is now Fixed Gross (without bonus)
        employerPF,
        earnings,
        deductions: allDeductions,
    };
};
