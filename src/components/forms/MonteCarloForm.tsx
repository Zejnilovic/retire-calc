import { Section, LabeledNumber, LabeledPercentage } from '../ui/FormComponents';
import { useTranslation } from 'react-i18next';

interface MonteCarloFormProps {
  mcAnnualVolatility: number;
  setMcAnnualVolatility: (value: number) => void;
  mcTrials: number;
  setMcTrials: (value: number) => void;
  mcTargetSuccess: number;
  setMcTargetSuccess: (value: number) => void;
  onCalculate: () => void;
  isCalculating: boolean;
}

export function MonteCarloForm({
  mcAnnualVolatility,
  setMcAnnualVolatility,
  mcTrials,
  setMcTrials,
  mcTargetSuccess,
  setMcTargetSuccess,
  onCalculate,
  isCalculating,
}: MonteCarloFormProps) {
  const { t } = useTranslation();
  return (
    <Section title={t('section.monteCarloSettings')}>
      <div className="grid gap-3">
        <LabeledPercentage 
          label={t('labels.realAnnualVolatility')} 
          value={mcAnnualVolatility} 
          setValue={setMcAnnualVolatility} 
          step={1} 
          min={0} 
          tooltip={t('tooltips.volatility')}
          tooltipWidth="lg"
        />
        <LabeledNumber 
          label={t('labels.trials')} 
          value={mcTrials} 
          setValue={setMcTrials} 
          step={100} 
          min={200} 
          tooltip={t('tooltips.trials')}
        />
        <LabeledPercentage 
          label={t('labels.targetSuccessProbability')} 
          value={mcTargetSuccess} 
          setValue={setMcTargetSuccess} 
          step={5} 
          min={0.5} 
          max={0.99} 
          tooltip={t('tooltips.successProbability')}
          tooltipWidth="lg"
        />
        <p className="text-xs text-gray-600 dark:text-gray-400">
          {t('tooltips.monteCarloSolver')}
        </p>
        
        <button
          onClick={onCalculate}
          disabled={isCalculating}
          className="w-full mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-xl transition-colors focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        >
          {isCalculating ? t('calculating') : t('calculateMC')}
        </button>
      </div>
    </Section>
  );
}
