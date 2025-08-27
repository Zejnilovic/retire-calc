import { useMemo, useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { useLocale } from './contexts/LocaleContext';
import type { ResultMonteCarlo } from './types';

// Types and utilities
import type { Inputs, CalcMode, RetireModel } from './types';
import { computeDeterministic } from './utils/calculations';
import { computeMonteCarlo } from './utils/monteCarloCalc';

// Components
import { BasicsForm } from './components/forms/BasicsForm';
import { EconomyForm } from './components/forms/EconomyForm';
import { FeesAndNeedsForm } from './components/forms/FeesAndNeedsForm';
import { MonteCarloForm } from './components/forms/MonteCarloForm';
import { DeterministicResults } from './components/results/DeterministicResults';
import { MonteCarloResults } from './components/results/MonteCarloResults';
// import { MonteCarloCharts } from './components/results/Charts';
import { InfoSections } from './components/InfoSections';
import { DarkModeToggle } from './components/ui/DarkModeToggle';

export default function App() {
  const { t } = useTranslation();
  const { language, currency, changeLanguage, setCurrency } = useLocale();
  // Validation state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Basics
  const [currentAge, setCurrentAge] = useState(35);
  const [retirementAge, setRetirementAge] = useState(65);

  // Needs
  const [targetMonthlyWithdrawalToday, setTargetMonthlyWithdrawalToday] = useState(45000);
  const [maxAnnualWithdrawalRate, setMaxAnnualWithdrawalRate] = useState(0.04);
  const [retirementHorizonYears, setRetirementHorizonYears] = useState(30);

  // Economy
  const [annualInflation, setAnnualInflation] = useState(0.025);
  const [nominalAnnualReturn, setNominalAnnualReturn] = useState(0.06);

  // Scenario deltas (used in deterministic cards if you want to keep them)
  const [optimisticReturnDelta, setOptimisticReturnDelta] = useState(0.02);
  const [optimisticInflationDelta, setOptimisticInflationDelta] = useState(-0.01);
  const [pessimisticReturnDelta, setPessimisticReturnDelta] = useState(-0.02);
  const [pessimisticInflationDelta, setPessimisticInflationDelta] = useState(0.01);

  // Balance & frictions
  const [currentAssets, setCurrentAssets] = useState(800000);
  const [annualFee, setAnnualFee] = useState(0.006);
  const [taxRateOnGains, setTaxRateOnGains] = useState(0.15);
  const [taxRateOnWithdrawals, setTaxRateOnWithdrawals] = useState(0.1);
  const [contributeAtEnd, setContributeAtEnd] = useState(true);

  // Modes
  const [calcMode, setCalcMode] = useState<CalcMode>("Deterministic");
  const [retireModel, setRetireModel] = useState<RetireModel>("WithdrawalRate");

  // Monte Carlo params
  const [mcAnnualVolatility, setMcAnnualVolatility] = useState(0.15);
  const [mcTrials, setMcTrials] = useState(2000);
  const [mcTargetSuccess, setMcTargetSuccess] = useState(0.8);
  
  // Monte Carlo calculation trigger
  // Monte Carlo result and state
  const [mcResultState, setMcResultState] = useState<ResultMonteCarlo | null>(null);
  const [isCalculatingMC, setIsCalculatingMC] = useState(false);
  const [mcStale, setMcStale] = useState(false); // inputs changed since last calculate
  // Keep snapshot of inputs at last calculation
  const [lastMcInputs, setLastMcInputs] = useState<Inputs | null>(null);

  const handleCalculateMC = () => {
    setIsCalculatingMC(true);
    setMcStale(false);
    setTimeout(() => {
  const result = computeMonteCarlo(inputs, annualInflation);
  setMcResultState(result);
  setLastMcInputs(inputs);
  setMcStale(false);
  setIsCalculatingMC(false);
    }, 100);
  };

  // Reset Monte Carlo calculation when switching modes
  // Reset stale flag when switching modes
  useEffect(() => {
    if (calcMode !== "MonteCarlo") {
      setIsCalculatingMC(false);
      setMcResultState(null);
      setMcStale(false);
    }
  }, [calcMode]);

  // Input validation
  useEffect(() => {
    const newErrors: { [key: string]: string } = {};
    if (currentAge < 0) newErrors.currentAge = t('errors.currentAge');
    if (retirementAge <= currentAge) newErrors.retirementAge = t('errors.retirementAge');
    if (retireModel === "Amortization" && retirementHorizonYears < 1) newErrors.retirementHorizonYears = t('errors.retirementHorizon');
    if (currentAssets < 0) newErrors.currentAssets = t('errors.currentAssets');
    if (retireModel === "WithdrawalRate" && (maxAnnualWithdrawalRate < 0.001 || maxAnnualWithdrawalRate > 0.2)) newErrors.maxAnnualWithdrawalRate = t('errors.withdrawalRate');
    if (targetMonthlyWithdrawalToday < 0) newErrors.targetMonthlyWithdrawalToday = t('errors.monthlyWithdrawal');
    if (annualFee < 0 || annualFee > 1) newErrors.annualFee = t('errors.annualFee');
    if (taxRateOnGains < 0 || taxRateOnGains > 1) newErrors.taxRateOnGains = t('errors.taxOnGains');
    if (taxRateOnWithdrawals < 0 || taxRateOnWithdrawals > 1) newErrors.taxRateOnWithdrawals = t('errors.taxOnWithdrawals');
    setErrors(newErrors);
  }, [currentAge, retirementAge, retireModel, retirementHorizonYears, currentAssets, maxAnnualWithdrawalRate, targetMonthlyWithdrawalToday, annualFee, taxRateOnGains, taxRateOnWithdrawals]);

  const inputs: Inputs = {
    currentAge,
    retirementAge,
    annualInflation,
    nominalAnnualReturn,
    optimisticReturnDelta,
    optimisticInflationDelta,
    pessimisticReturnDelta,
    pessimisticInflationDelta,
    targetMonthlyWithdrawalToday,
    maxAnnualWithdrawalRate,
    retirementHorizonYears,
    currentAssets,
    annualFee,
    taxRateOnGains,
    taxRateOnWithdrawals,
    contributeAtEnd,
    calcMode,
    retireModel,
    mcAnnualVolatility,
    mcTrials,
    mcTargetSuccess,
  };

  // Helper function to check if inputs are valid for calculation
  const isValidForCalculation = () => {
    return (
      currentAge >= 0 &&
      retirementAge > currentAge &&
      currentAssets >= 0 &&
      targetMonthlyWithdrawalToday >= 0 &&
      annualFee >= 0 && annualFee <= 1 &&
      taxRateOnGains >= 0 && taxRateOnGains <= 1 &&
      taxRateOnWithdrawals >= 0 && taxRateOnWithdrawals <= 1 &&
      (retireModel !== "WithdrawalRate" || (maxAnnualWithdrawalRate >= 0.001 && maxAnnualWithdrawalRate <= 0.2)) &&
      (retireModel !== "Amortization" || retirementHorizonYears >= 1)
    );
  };

  const detBase = useMemo(() => {
    if (!isValidForCalculation()) {
      return {
        yearsToRetirement: 0,
        realReturnAnnual_Accum: 0,
        realReturnMonthly_Accum: 0,
        targetCapitalReal: 0,
        targetCapitalNominal: 0,
        fvCurrentAssetsReal: 0,
        fvCurrentAssetsNominal: 0,
        requiredFromContributionsReal: 0,
        requiredMonthlyContributionReal: 0,
        note: t('errors.invalidInputs')
      };
    }
    return computeDeterministic(inputs, nominalAnnualReturn, annualInflation);
  }, [inputs, nominalAnnualReturn, annualInflation, currentAge, retirementAge, currentAssets, targetMonthlyWithdrawalToday, annualFee, taxRateOnGains, taxRateOnWithdrawals, maxAnnualWithdrawalRate, retirementHorizonYears, retireModel]);

  const detOptimistic = useMemo(() => {
    if (!isValidForCalculation()) {
      return {
        yearsToRetirement: 0,
        realReturnAnnual_Accum: 0,
        realReturnMonthly_Accum: 0,
        targetCapitalReal: 0,
        targetCapitalNominal: 0,
        fvCurrentAssetsReal: 0,
        fvCurrentAssetsNominal: 0,
        requiredFromContributionsReal: 0,
        requiredMonthlyContributionReal: 0,
        note: t('errors.invalidInputs')
      };
    }
    return computeDeterministic(
      inputs,
      nominalAnnualReturn + optimisticReturnDelta,
      Math.max(0, annualInflation + optimisticInflationDelta)
    );
  }, [inputs, nominalAnnualReturn, optimisticReturnDelta, annualInflation, optimisticInflationDelta, currentAge, retirementAge, currentAssets, targetMonthlyWithdrawalToday, annualFee, taxRateOnGains, taxRateOnWithdrawals, maxAnnualWithdrawalRate, retirementHorizonYears, retireModel]);

  const detPessimistic = useMemo(() => {
    if (!isValidForCalculation()) {
      return {
        yearsToRetirement: 0,
        realReturnAnnual_Accum: 0,
        realReturnMonthly_Accum: 0,
        targetCapitalReal: 0,
        targetCapitalNominal: 0,
        fvCurrentAssetsReal: 0,
        fvCurrentAssetsNominal: 0,
        requiredFromContributionsReal: 0,
        requiredMonthlyContributionReal: 0,
        note: t('errors.invalidInputs')
      };
    }
    return computeDeterministic(
      inputs,
      Math.max(-0.99, nominalAnnualReturn + pessimisticReturnDelta),
      annualInflation + pessimisticInflationDelta
    );
  }, [inputs, nominalAnnualReturn, pessimisticReturnDelta, annualInflation, pessimisticInflationDelta, currentAge, retirementAge, currentAssets, targetMonthlyWithdrawalToday, annualFee, taxRateOnGains, taxRateOnWithdrawals, maxAnnualWithdrawalRate, retirementHorizonYears, retireModel]);

  // Mark Monte Carlo results stale when inputs change after initial calculation
  useEffect(() => {
    if (mcResultState && lastMcInputs) {
      const prev = JSON.stringify(lastMcInputs);
      const curr = JSON.stringify(inputs);
      if (prev !== curr) {
        setMcStale(true);
      }
    }
  }, [inputs, mcResultState, lastMcInputs]);
  const mcResult = mcResultState;


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header with localization controls */}
        <header className="mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t('appTitle')}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">{t('description')}</p>
          </div>
          <div className="flex items-center space-x-4">
            {/* Language selector */}
            <select
              value={language}
              onChange={(e) => changeLanguage(e.target.value)}
              className="border rounded px-2 py-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            >
              <option value="cs">CS</option>
              <option value="en">EN</option>
            </select>
            {/* Currency selector */}
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="border rounded px-2 py-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            >
              <option value="CZK">CZK</option>
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
            </select>
            <DarkModeToggle />
          </div>
        </header>

        <InfoSections />

        <div className="grid md:grid-cols-3 gap-5">
          <BasicsForm
            currentAge={currentAge}
            setCurrentAge={setCurrentAge}
            retirementAge={retirementAge}
            setRetirementAge={setRetirementAge}
            calcMode={calcMode}
            setCalcMode={setCalcMode}
            retireModel={retireModel}
            setRetireModel={setRetireModel}
            retirementHorizonYears={retirementHorizonYears}
            setRetirementHorizonYears={setRetirementHorizonYears}
            contributeAtEnd={contributeAtEnd}
            setContributeAtEnd={setContributeAtEnd}
            currentAssets={currentAssets}
            setCurrentAssets={setCurrentAssets}
            errors={errors}
          />

          <EconomyForm
            annualInflation={annualInflation}
            setAnnualInflation={setAnnualInflation}
            nominalAnnualReturn={nominalAnnualReturn}
            setNominalAnnualReturn={setNominalAnnualReturn}
            optimisticReturnDelta={optimisticReturnDelta}
            setOptimisticReturnDelta={setOptimisticReturnDelta}
            optimisticInflationDelta={optimisticInflationDelta}
            setOptimisticInflationDelta={setOptimisticInflationDelta}
            pessimisticReturnDelta={pessimisticReturnDelta}
            setPessimisticReturnDelta={setPessimisticReturnDelta}
            pessimisticInflationDelta={pessimisticInflationDelta}
            setPessimisticInflationDelta={setPessimisticInflationDelta}
          />

          <FeesAndNeedsForm
            targetMonthlyWithdrawalToday={targetMonthlyWithdrawalToday}
            setTargetMonthlyWithdrawalToday={setTargetMonthlyWithdrawalToday}
            maxAnnualWithdrawalRate={maxAnnualWithdrawalRate}
            setMaxAnnualWithdrawalRate={setMaxAnnualWithdrawalRate}
            annualFee={annualFee}
            setAnnualFee={setAnnualFee}
            taxRateOnGains={taxRateOnGains}
            setTaxRateOnGains={setTaxRateOnGains}
            taxRateOnWithdrawals={taxRateOnWithdrawals}
            setTaxRateOnWithdrawals={setTaxRateOnWithdrawals}
            retireModel={retireModel}
            errors={errors}
          />
        </div>

        {calcMode === "Deterministic" && (
          <div className="mt-6">
            <DeterministicResults
              detBase={detBase}
              detOptimistic={detOptimistic}
              detPessimistic={detPessimistic}
            />
          </div>
        )}

        {calcMode === "MonteCarlo" && (
          <div className="mt-6 space-y-6">
            {/* Top row: Settings and Summary */}
            <div className="grid md:grid-cols-3 gap-5">
              <MonteCarloForm
                mcAnnualVolatility={mcAnnualVolatility}
                setMcAnnualVolatility={setMcAnnualVolatility}
                mcTrials={mcTrials}
                setMcTrials={setMcTrials}
                mcTargetSuccess={mcTargetSuccess}
                setMcTargetSuccess={setMcTargetSuccess}
                      onCalculate={handleCalculateMC}
                      isCalculating={isCalculatingMC}
              />

              <div className="md:col-span-2">
                      <MonteCarloResults 
                        mcResult={mcResult} 
                        hasCalculated={mcResult !== null}
                        inputsChanged={mcStale}
                        targetSuccess={mcTargetSuccess}
                        showChartsInline={false}
                      />
              </div>
            </div>

            {/* Charts row - commented out until re-enable charts */}
            {/*
            {mcResult && (
              <div>
                <MonteCarloCharts 
                  mcResult={mcResult}
                  targetSuccess={mcTargetSuccess}
                  inputs={inputs}
                />
              </div>
            )}
            */}
          </div>
        )}

        <footer className="mt-10 text-center text-xs text-gray-500 dark:text-gray-400 space-y-2">
          <p>{t('wisdom')}</p>
          <p>
            <a 
              href="https://github.com/Zejnilovic/retire-calc" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-gray-700 dark:hover:text-gray-300 underline"
            >
              {t('viewOnGitHub')}
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

