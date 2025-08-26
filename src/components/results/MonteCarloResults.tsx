import type { ResultMonteCarlo } from '../../types';
import { fmtPct, fmtMoney } from '../../utils/formatting';
import { useLocale } from '../../contexts/LocaleContext';
import { useTranslation } from 'react-i18next';
import { MonteCarloCharts } from './Charts';

interface MonteCarloResultsProps {
  mcResult: ResultMonteCarlo | null;
  hasCalculated: boolean;
  targetSuccess: number;
  showChartsInline?: boolean;
  inputsChanged?: boolean;
}

export function MonteCarloResults({ mcResult, hasCalculated, targetSuccess, showChartsInline = true, inputsChanged = false }: MonteCarloResultsProps) {
  const { t } = useTranslation();
  const { language, currency } = useLocale();

  return (
    <div className="space-y-6">
      {inputsChanged && (
        <div className="rounded p-2 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 border border-yellow-300 dark:border-yellow-700">
          {t('inputsChangedWarning', { button: t('calculateMC') })}
        </div>
      )}
      {/* Summary Card */}
      <div className="rounded-2xl shadow p-5 bg-white dark:bg-gray-800 border dark:border-gray-700">
  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">{t('results.monteCarlo.header')}</h3>
        {mcResult ? (
          <div className="grid gap-1 text-sm text-gray-700 dark:text-gray-300">
            <div className="flex justify-between">
              <span>{t('results.monteCarlo.requiredMonthlyContributionReal')}</span>
              <span className="font-medium">
                {fmtMoney(mcResult.requiredMonthlyContributionReal, language, currency)}/mo
              </span>
            </div>
            <div className="flex justify-between">
              <span>{t('results.monteCarlo.successProbability')}</span>
              <span>{fmtPct(mcResult.successProbability)}</span>
            </div>
            <div className="flex justify-between">
              <span>{t('results.monteCarlo.trials')}</span>
              <span>{mcResult.trials}</span>
            </div>
            <div className="flex justify-between">
              <span>{t('results.monteCarlo.iterations')}</span>
              <span>{mcResult.iterations}</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              {t('results.monteCarlo.explanation')}
            </p>
          </div>
        ) : hasCalculated ? (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('results.monteCarlo.noResult')}
          </p>
        ) : (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('results.monteCarlo.notCalculated')}
          </p>
        )}
      </div>

      {showChartsInline && (
        <MonteCarloCharts 
          mcResult={mcResult}
          targetSuccess={targetSuccess}
        />
      )}
    </div>
  );
}
