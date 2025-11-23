export const DEFAULT_EARNINGS = [
    { id: 'basic', name: 'Basic Salary', type: 'percentage', percentage: 40, taxable: true, description: 'Typically 40-50% of CTC. Fully taxable.' },
    { id: 'hra', name: 'HRA', type: 'formula', formula: 'basic * 0.5', taxable: 'partial', description: 'House Rent Allowance. Typically 50% of Basic for metros, 40% for non-metros. Exempt u/s 10(13A) subject to rent paid.' },
    { id: 'special', name: 'Special Allowance', type: 'balancing', taxable: true, description: 'Balancing component to match Gross Salary. Fully taxable.' },
];

export const calculateBreakup = (ctc, earningsInput = DEFAULT_EARNINGS, customDeductions = [], pfCapEnabled = false, bonusAmount = 0) => {
    let earnings = earningsInput.map(e => ({ ...e }));

    // Add Bonus to earnings if > 0
    if (bonusAmount > 0) {
        // Check if bonus already exists to avoid duplicates if called repeatedly
        if (!earnings.find(e => e.id === 'bonus')) {
            // Insert before Special Allowance (last item usually)
            const specialIndex = earnings.findIndex(e => e.id === 'special');
            const bonusItem = {
                id: 'bonus',
                name: 'Performance Bonus',
                amount: bonusAmount,
                type: 'fixed',
                taxable: true,
                disabled: false,
                readOnly: true, // New flag for read-only but active items
                description: 'Performance linked bonus (from Incentive section).'
            };

            if (specialIndex !== -1) {
                earnings.splice(specialIndex, 0, bonusItem);
            } else {
                earnings.push(bonusItem);
            }
        }
    }

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

    // Calculate Employer PF (12% of Basic, optionally capped at ₹21,600/year = ₹1,800/month)
    const PF_CAP_ANNUAL = 21600; // ₹1,800/month * 12
    const employerPF = pfCapEnabled
        ? Math.min(basicAmount * 0.12, PF_CAP_ANNUAL)
        : basicAmount * 0.12;

    // Gross Salary = CTC - Employer PF
    const grossSalary = ctc - employerPF;

    // Calculate other earnings
    earnings.forEach(e => {
        if (e.id === 'basic') return;
        if (e.id === 'bonus') {
            e.amount = bonusAmount; // Ensure it matches the passed amount
            return;
        }

        if (e.disabled && e.id !== 'bonus') { // Bonus is disabled but has amount
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
    const otherEarningsSum = earnings.reduce((sum, e) => {
        if (e.type !== 'balancing') return sum + (e.amount || 0);
        return sum;
    }, 0);

    const specialComp = earnings.find(e => e.id === 'special');
    if (specialComp) {
        if (specialComp.disabled) {
            specialComp.amount = 0;
        } else {
            specialComp.amount = Math.max(0, grossSalary - otherEarningsSum);
        }
    }

    const totalEarnings = earnings.reduce((sum, e) => sum + (e.amount || 0), 0);

    // Standard Deductions (Employee PF also capped if enabled)
    const employeePF = pfCapEnabled
        ? Math.min(basicAmount * 0.12, PF_CAP_ANNUAL)
        : basicAmount * 0.12;
    const professionalTax = 2400;

    // Gratuity calculation: 4.81% of Basic (Yearly)
    // Formula: (15 days / 26 working days) * Basic = ~57.69% of monthly basic
    // Yearly: ~4.81% of Annual Basic
    const gratuityAmount = basicAmount * 0.0481;

    const baseDeductions = [
        { id: 'epf', name: 'EPF (Employee)', amount: employeePF, isFixed: true, description: 'Employee Provident Fund. 12% of Basic Salary + DA. Capped at ₹1,800/mo if Basic > ₹15,000 (optional).' },
        { id: 'pt', name: 'Professional Tax', amount: professionalTax, isFixed: true, description: 'State-levied tax. Typically ₹200/mo (₹2,500/yr in some states). Fixed at ₹2,400/yr here.' },
        { id: 'gratuity', name: 'Gratuity', amount: gratuityAmount, isFixed: false, description: 'Annual gratuity accrual. Calculated as 4.81% of Annual Basic Salary.' },
    ];

    // Merge with custom deductions
    // If a custom deduction has the same ID as a base deduction, use the custom one (user edited it)
    const customDeductionIds = customDeductions.map(d => d.id);
    const filteredBaseDeductions = baseDeductions.filter(d => !customDeductionIds.includes(d.id));
    const allDeductions = [...filteredBaseDeductions, ...customDeductions];

    return {
        ctc,
        grossSalary: totalEarnings,
        employerPF,
        earnings,
        deductions: allDeductions,
    };
};
