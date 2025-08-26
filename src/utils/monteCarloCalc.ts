// Monte Carlo calculation functions

import type { Inputs, ResultMonteCarlo } from '../types';
import { netNominalAfterFeesTaxes, realReturn } from './financial';
import { monteCarloSuccess } from './monteCarlo';
import { computeDeterministic } from './calculations';

export function computeMonteCarlo(inp: Inputs, annualInflation: number): ResultMonteCarlo {
  const nominalNet = netNominalAfterFeesTaxes(
    inp.nominalAnnualReturn,
    inp.annualFee,
    inp.taxRateOnGains
  );
  const realAnnualMean = realReturn(nominalNet, annualInflation);

  const realAnnualVol = inp.mcAnnualVolatility;

  const det = computeDeterministic(inp, inp.nominalAnnualReturn, annualInflation);
  const targetProb = inp.mcTargetSuccess;
  const trials = Math.max(200, Math.min(20000, inp.mcTrials));

  let lo = 0;
  let hi = Math.max(det.requiredMonthlyContributionReal * 3 + 100000, 10000);
  let best = hi;
  let iterations = 0;

  for (let iter = 0; iter < 20; iter++) {
    iterations = iter + 1;
    const mid = (lo + hi) / 2;
    const p = monteCarloSuccess(mid, inp, realAnnualMean, realAnnualVol, trials);
    if (p >= targetProb) {
      best = mid;
      hi = mid;
    } else {
      lo = mid;
    }
    if (Math.abs(hi - lo) < 1e-2) break;
  }

  const finalProb = monteCarloSuccess(best, inp, realAnnualMean, realAnnualVol, trials);

  return {
    requiredMonthlyContributionReal: best,
    successProbability: finalProb,
    trials,
    iterations,
  };
}
