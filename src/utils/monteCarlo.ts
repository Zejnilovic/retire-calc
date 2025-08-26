import type { Inputs } from '../types';
import { monthlyFromAnnual } from './financial';

export function randn(): number {
  const u = 1 - Math.random();
  const v = 1 - Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

export function simulateOnce(
  monthlyContrib: number,
  inp: Inputs,
  realAnnualMean: number,
  realAnnualVol: number
): boolean {
  const monthsAccum = (inp.retirementAge - inp.currentAge) * 12;
  const monthsRet = Math.max(1, Math.round(inp.retirementHorizonYears * 12));

  const muM = monthlyFromAnnual(realAnnualMean);
  const sigmaM = realAnnualVol / Math.sqrt(12);

  let bal = inp.currentAssets;

  for (let m = 0; m < monthsAccum; m++) {
    const r = muM + sigmaM * randn();
    bal *= 1 + r;
    if (inp.contributeAtEnd) bal += monthlyContrib; else bal = (bal + monthlyContrib) * (1 + r);
    if (!isFinite(bal)) return false;
  }

  let grossMonthly: number;
  if (inp.retireModel === "WithdrawalRate") {
    grossMonthly = inp.targetMonthlyWithdrawalToday / (1 - inp.taxRateOnWithdrawals);
  } else {
    grossMonthly = inp.targetMonthlyWithdrawalToday / (1 - inp.taxRateOnWithdrawals);
  }

  for (let m = 0; m < monthsRet; m++) {
    bal -= grossMonthly;
    if (bal <= 0) return false;
    const r = muM + sigmaM * randn();
    bal *= 1 + r;
  }
  return bal > 0;
}

export function monteCarloSuccess(
  monthlyContrib: number,
  inp: Inputs,
  realAnnualMean: number,
  realAnnualVol: number,
  trials: number
): number {
  let success = 0;
  for (let i = 0; i < trials; i++) {
    if (simulateOnce(monthlyContrib, inp, realAnnualMean, realAnnualVol)) success++;
  }
  return success / trials;
}
