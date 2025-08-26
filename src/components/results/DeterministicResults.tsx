import type { ResultDeterministic } from '../../types';
import { fmtPct, fmtMoney } from '../../utils/formatting';
import { useLocale } from '../../contexts/LocaleContext';
import { useTranslation } from 'react-i18next';
import { Tooltip } from '../ui/Tooltip';
// import { DeterministicCharts } from './Charts';

interface DeterministicResultsProps {
  detBase: ResultDeterministic;
  detOptimistic: ResultDeterministic;
  detPessimistic: ResultDeterministic;
}

export function DeterministicResults({ 
  detBase, 
  detOptimistic, 
  detPessimistic
}: DeterministicResultsProps) {
  const { t } = useTranslation();
  const { language, currency } = useLocale();
  const scenarios = {
    BASE: detBase,
    OPTIMISTIC: detOptimistic,
    PESSIMISTIC: detPessimistic,
  } as const;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {Object.entries(scenarios).map(([name, r]) => (
          <div key={name} className="rounded-2xl shadow p-5 bg-white dark:bg-gray-800 border dark:border-gray-700">
            <div className="mb-2 space-y-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {t(`results.deterministic.scenarios.${name}`)}
              </h3>
              <Tooltip content={t('tooltips.results.deterministic.realAnnualAccum')}>
                <span className="text-sm text-gray-500 dark:text-gray-400 cursor-help">
                  {`${t('results.deterministic.realAnnualAccum')}: ${fmtPct(r.realReturnAnnual_Accum)}`}
                </span>
              </Tooltip>
            </div>
            <div className="grid gap-1 text-sm text-gray-700 dark:text-gray-300">
              <div className="flex justify-between">
                <Tooltip content={t('tooltips.results.deterministic.yearsToRetirement')}>
                  <span className="whitespace-normal break-words font-medium">{t('results.deterministic.yearsToRetirement')}</span>
                </Tooltip>
                <span className="whitespace-normal break-words">{r.yearsToRetirement}</span>
              </div>
              <div className="flex justify-between">
                <Tooltip content={t('tooltips.results.deterministic.targetCapitalReal')}>
                  <span className="whitespace-normal break-words font-medium">{t('results.deterministic.targetCapitalReal')}</span>
                </Tooltip>
                <span className="whitespace-normal break-words">{fmtMoney(r.targetCapitalReal, language, currency)}</span>
              </div>
              <div className="flex justify-between">
                <Tooltip content={t('tooltips.results.deterministic.targetCapitalNominal')}>
                  <span className="whitespace-normal break-words font-medium">{t('results.deterministic.targetCapitalNominal')}</span>
                </Tooltip>
                <span className="whitespace-normal break-words">{fmtMoney(r.targetCapitalNominal, language, currency)}</span>
              </div>
              <div className="flex justify-between">
                <Tooltip content={t('tooltips.results.deterministic.fvCurrentAssetsReal')}>
                  <span className="whitespace-normal break-words font-medium">{t('results.deterministic.fvCurrentAssetsReal')}</span>
                </Tooltip>
                <span className="whitespace-normal break-words">{fmtMoney(r.fvCurrentAssetsReal, language, currency)}</span>
              </div>
              <div className="flex justify-between">
                <Tooltip content={t('tooltips.results.deterministic.fvCurrentAssetsNominal')}>
                  <span className="whitespace-normal break-words font-medium">{t('results.deterministic.fvCurrentAssetsNominal')}</span>
                </Tooltip>
                <span className="whitespace-normal break-words">{fmtMoney(r.fvCurrentAssetsNominal, language, currency)}</span>
              </div>
              <div className="flex justify-between">
                <Tooltip content={t('tooltips.results.deterministic.requiredFromContributionsReal')}>
                  <span className="whitespace-normal break-words font-medium">{t('results.deterministic.requiredFromContributionsReal')}</span>
                </Tooltip>
                <span className="whitespace-normal break-words">{fmtMoney(r.requiredFromContributionsReal, language, currency)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <Tooltip content={t('tooltips.results.deterministic.requiredMonthlyContributionReal')}>
                  <span className="whitespace-normal break-words">{t('results.deterministic.requiredMonthlyContributionReal')}</span>
                </Tooltip>
                <span className="whitespace-normal break-words">{fmtMoney(r.requiredMonthlyContributionReal, language, currency)}</span>
              </div>
              {r.note && <p className="text-xs text-green-700 dark:text-green-400 mt-2">{r.note}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section (hidden) */}
      {/**
      <DeterministicCharts 
        detBase={detBase}
        detOptimistic={detOptimistic}
        detPessimistic={detPessimistic}
        currentAssets={currentAssets}
      />
      **/}
    </div>
  );
}
