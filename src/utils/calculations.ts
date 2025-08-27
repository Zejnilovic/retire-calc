import type { Inputs, ResultDeterministic } from '../types';
import { 
  netNominalAfterFeesTaxes, 
  realReturn, 
  monthlyFromAnnual, 
  requiredCapital_WithdrawalRate,
  requiredCapital_Amortization,
  fvLumpSum,
  realToNominalAtRetirement
} from './financial';

export function computeDeterministic(
  inp: Inputs,
  nominalAnnualReturn: number,
  annualInflation: number
): ResultDeterministic {
  if (inp.retirementAge <= inp.currentAge) {
    throw new Error("RETIREMENT_AGE must be greater than CURRENT_AGE.");
  }
  const years = inp.retirementAge - inp.currentAge;
  const months = years * 12;

  const nominalNet = netNominalAfterFeesTaxes(
    nominalAnnualReturn,
    inp.annualFee,
    inp.taxRateOnGains
  );
  const realAnnual = realReturn(nominalNet, annualInflation);
  const realMonthly = monthlyFromAnnual(realAnnual);

  let targetCapital = 0;
  if (inp.retireModel === "WithdrawalRate") {
    targetCapital = requiredCapital_WithdrawalRate(
      inp.targetMonthlyWithdrawalToday,
      inp.maxAnnualWithdrawalRate,
      inp.taxRateOnWithdrawals
    );
  } else {
    const retirementMonths = Math.max(1, Math.round(inp.retirementHorizonYears * 12));
    targetCapital = requiredCapital_Amortization(
      inp.targetMonthlyWithdrawalToday,
      inp.taxRateOnWithdrawals,
      realMonthly,
      retirementMonths,
      true
    );
  }

  const fvCurrent = fvLumpSum(inp.currentAssets, realMonthly, months);
  const neededFromContrib = Math.max(targetCapital - fvCurrent, 0);

  const targetCapitalNominalAtRetirement = realToNominalAtRetirement(targetCapital, annualInflation, years);
  const fvCurrentAssetsNominalAtRetirement = realToNominalAtRetirement(fvCurrent, annualInflation, years);

  if (neededFromContrib <= 0) {
    return {
      yearsToRetirement: years,
      realReturnAnnual_Accum: realAnnual,
      realReturnMonthly_Accum: realMonthly,
      targetCapitalReal: targetCapital,
      targetCapitalNominal: targetCapitalNominalAtRetirement,
      fvCurrentAssetsReal: fvCurrent,
      fvCurrentAssetsNominal: fvCurrentAssetsNominalAtRetirement,
      requiredFromContributionsReal: 0,
      requiredMonthlyContributionReal: 0,
      requiredMonthlyContributionNominalYear1: 0,
      requiredMonthlyContributionNominalYear5: 0,
      requiredMonthlyContributionNominalYear10: 0,
      note:
        "Under these assumptions, your current assets already meet the target.",
    };
  }

  let monthlyContrib: number;
  if (Math.abs(realMonthly) < 1e-12) {
    monthlyContrib = neededFromContrib / months;
  } else {
    let factor = (Math.pow(1 + realMonthly, months) - 1) / realMonthly;
    // Assume contributions at beginning of month (more conservative)
    factor *= 1 + realMonthly;
    monthlyContrib = neededFromContrib / factor;
  }

  // Calculate nominal amounts for different years (accounting for inflation)
  const nominalYear1 = monthlyContrib; // Year 1 = real amount
  const nominalYear5 = monthlyContrib * Math.pow(1 + annualInflation, 4); // 5th year
  const nominalYear10 = years >= 10 ? monthlyContrib * Math.pow(1 + annualInflation, 9) : 0; // 10th year (if applicable)

  return {
    yearsToRetirement: years,
    realReturnAnnual_Accum: realAnnual,
    realReturnMonthly_Accum: realMonthly,
    targetCapitalReal: targetCapital,
    targetCapitalNominal: targetCapitalNominalAtRetirement,
    fvCurrentAssetsReal: fvCurrent,
    fvCurrentAssetsNominal: fvCurrentAssetsNominalAtRetirement,
    requiredFromContributionsReal: neededFromContrib,
    requiredMonthlyContributionReal: monthlyContrib,
    requiredMonthlyContributionNominalYear1: nominalYear1,
    requiredMonthlyContributionNominalYear5: nominalYear5,
    requiredMonthlyContributionNominalYear10: nominalYear10,
  };
}
