export function realReturn(nominal: number, inflation: number): number {
  return (1 + nominal) / (1 + inflation) - 1;
}

export function netNominalAfterFeesTaxes(
  grossNominal: number,
  fee: number,
  taxOnGains: number
): number {
  const netBeforeTax = grossNominal - fee;
  if (netBeforeTax <= 0) return netBeforeTax;
  return netBeforeTax * (1 - taxOnGains);
}

export function monthlyFromAnnual(rAnnual: number): number {
  return Math.pow(1 + rAnnual, 1 / 12) - 1;
}

export function fvLumpSum(pv: number, rMonthly: number, nMonths: number): number {
  return pv * Math.pow(1 + rMonthly, nMonths);
}

export function fvAnnuity(
  pmt: number,
  rMonthly: number,
  nMonths: number,
  payEnd = true
): number {
  if (nMonths <= 0) return 0;
  let fv: number;
  if (Math.abs(rMonthly) < 1e-12) {
    fv = pmt * nMonths;
  } else {
    fv = pmt * ((Math.pow(1 + rMonthly, nMonths) - 1) / rMonthly);
  }
  if (!payEnd) fv *= 1 + rMonthly;
  return fv;
}

export function requiredCapital_WithdrawalRate(
  desiredNetMonthlyToday: number,
  maxAnnualWithdrawalRate: number,
  taxOnWithdrawals: number
): number {
  if (maxAnnualWithdrawalRate <= 0) throw new Error("Withdrawal rate must be > 0");
  const netAnnualNeed = desiredNetMonthlyToday * 12;
  const grossAnnualNeeded = netAnnualNeed / (1 - taxOnWithdrawals);
  return grossAnnualNeeded / maxAnnualWithdrawalRate;
}

export function requiredCapital_Amortization(
  desiredNetMonthlyToday: number,
  taxOnWithdrawals: number,
  rMonthlyRetirement: number,
  retirementMonths: number,
  payBeginning = true
): number {
  const grossMonthly = desiredNetMonthlyToday / (1 - taxOnWithdrawals);
  if (retirementMonths <= 0) return 0;
  if (Math.abs(rMonthlyRetirement) < 1e-12) {
    const pv = grossMonthly * retirementMonths;
    return payBeginning ? pv * (1 + rMonthlyRetirement) : pv;
  }
  const pvOrdinary = grossMonthly * (1 - Math.pow(1 + rMonthlyRetirement, -retirementMonths)) / rMonthlyRetirement;
  return payBeginning ? pvOrdinary * (1 + rMonthlyRetirement) : pvOrdinary;
}

export function realToNominalAtRetirement(realAmount: number, annualInflation: number, years: number): number {
  return realAmount * Math.pow(1 + annualInflation, years);
}
