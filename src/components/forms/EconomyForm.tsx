import { Section, LabeledPercentage } from '../ui/FormComponents';
import { useTranslation } from 'react-i18next';

interface EconomyFormProps {
  annualInflation: number;
  setAnnualInflation: (value: number) => void;
  nominalAnnualReturn: number;
  setNominalAnnualReturn: (value: number) => void;
  optimisticReturnDelta: number;
  setOptimisticReturnDelta: (value: number) => void;
  optimisticInflationDelta: number;
  setOptimisticInflationDelta: (value: number) => void;
  pessimisticReturnDelta: number;
  setPessimisticReturnDelta: (value: number) => void;
  pessimisticInflationDelta: number;
  setPessimisticInflationDelta: (value: number) => void;
}

export function EconomyForm({
  annualInflation,
  setAnnualInflation,
  nominalAnnualReturn,
  setNominalAnnualReturn,
  optimisticReturnDelta,
  setOptimisticReturnDelta,
  optimisticInflationDelta,
  setOptimisticInflationDelta,
  pessimisticReturnDelta,
  setPessimisticReturnDelta,
  pessimisticInflationDelta,
  setPessimisticInflationDelta,
}: EconomyFormProps) {
  const { t } = useTranslation();
  return (
    <Section title={t('section.economyAndReturns')}>
      <div className="grid gap-3">
        <LabeledPercentage 
          label={t('labels.annualInflation')} 
          value={annualInflation} 
          setValue={setAnnualInflation} 
          step={0.1} 
          min={0} 
          tooltip={t('tooltips.annualInflation')}
        />
        <LabeledPercentage 
          label={t('labels.nominalAnnualReturn')} 
          value={nominalAnnualReturn} 
          setValue={setNominalAnnualReturn} 
          step={0.1} 
          tooltip={t('tooltips.nominalAnnualReturn')}
        />
        <div className="grid grid-cols-2 gap-3">
          <LabeledPercentage 
            label={t('labels.optimisticReturn')} 
            value={optimisticReturnDelta} 
            setValue={setOptimisticReturnDelta} 
            step={0.1} 
            tooltip={t('tooltips.optimisticReturn')}
          />
          <LabeledPercentage 
            label={t('labels.optimisticInflation')} 
            value={optimisticInflationDelta} 
            setValue={setOptimisticInflationDelta} 
            step={0.1} 
            tooltip={t('tooltips.optimisticInflation')}
          />
          <LabeledPercentage 
            label={t('labels.pessimisticReturn')} 
            value={pessimisticReturnDelta} 
            setValue={setPessimisticReturnDelta} 
            step={0.1} 
            tooltip={t('tooltips.pessimisticReturn')}
          />
          <LabeledPercentage 
            label={t('labels.pessimisticInflation')} 
            value={pessimisticInflationDelta} 
            setValue={setPessimisticInflationDelta} 
            step={0.1} 
            tooltip={t('tooltips.pessimisticInflation')}
          />
        </div>
      </div>
    </Section>
  );
}
