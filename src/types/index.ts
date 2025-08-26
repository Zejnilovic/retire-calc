export interface Inputs {
  currentAge: number;
  retirementAge: number;
  annualInflation: number;
  nominalAnnualReturn: number; 
  optimisticReturnDelta: number;
  optimisticInflationDelta: number;
  pessimisticReturnDelta: number;
  pessimisticInflationDelta: number;
  targetMonthlyWithdrawalToday: number;
  maxAnnualWithdrawalRate: number;
  retirementHorizonYears: number;
  currentAssets: number;
  annualFee: number;
  taxRateOnGains: number;
  taxRateOnWithdrawals: number;
  contributeAtEnd: boolean;
  calcMode: "Deterministic" | "MonteCarlo";
  retireModel: "WithdrawalRate" | "Amortization";
  mcAnnualVolatility: number;
  mcTrials: number;
  mcTargetSuccess: number;
}

export interface ResultDeterministic {
  yearsToRetirement: number;
  realReturnAnnual_Accum: number;
  realReturnMonthly_Accum: number;
  targetCapitalReal: number;
  targetCapitalNominal: number;
  fvCurrentAssetsReal: number;
  fvCurrentAssetsNominal: number;
  requiredFromContributionsReal: number;
  requiredMonthlyContributionReal: number;
  note?: string;
}

export interface ResultMonteCarlo {
  requiredMonthlyContributionReal: number;
  successProbability: number;
  trials: number;
  iterations: number;
}

export type CalcMode = "Deterministic" | "MonteCarlo";
export type RetireModel = "WithdrawalRate" | "Amortization";
