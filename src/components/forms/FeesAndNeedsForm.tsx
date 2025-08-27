import type { RetireModel } from '../../types';
import { Section, LabeledNumber, LabeledPercentage } from '../ui/FormComponents';
import { useTranslation } from 'react-i18next';

interface FeesAndNeedsFormProps {
  targetMonthlyWithdrawalToday: number;
  setTargetMonthlyWithdrawalToday: (value: number) => void;
  maxAnnualWithdrawalRate: number;
  setMaxAnnualWithdrawalRate: (value: number) => void;
  annualFee: number;
  setAnnualFee: (value: number) => void;
  taxRateOnGains: number;
  setTaxRateOnGains: (value: number) => void;
  taxRateOnWithdrawals: number;
  setTaxRateOnWithdrawals: (value: number) => void;
  retireModel: RetireModel;
  errors?: { [key: string]: string };
}

export function FeesAndNeedsForm({
  targetMonthlyWithdrawalToday,
  setTargetMonthlyWithdrawalToday,
  maxAnnualWithdrawalRate,
  setMaxAnnualWithdrawalRate,
  annualFee,
  setAnnualFee,
  taxRateOnGains,
  setTaxRateOnGains,
  taxRateOnWithdrawals,
  setTaxRateOnWithdrawals,
  retireModel,
  errors = {},
}: FeesAndNeedsFormProps) {
  const { t } = useTranslation();
  return (
    <Section title={t('section.feesAndNeeds')}>
      <div className="grid gap-3">
        <div>
          <LabeledNumber 
            label={t('labels.targetMonthlyWithdrawalToday')} 
            value={targetMonthlyWithdrawalToday} 
            setValue={setTargetMonthlyWithdrawalToday} 
            step={500} 
            min={0} 
            tooltip={t('tooltips.targetMonthlyWithdrawalToday')}
          />
          {errors.targetMonthlyWithdrawalToday && (
            <div className="text-xs text-red-600 dark:text-red-400">{errors.targetMonthlyWithdrawalToday}</div>
          )}
        </div>
        
        {retireModel === "WithdrawalRate" && (
          <div>
            <LabeledPercentage 
              label={t('labels.maxAnnualWithdrawalRate')} 
              value={maxAnnualWithdrawalRate} 
              setValue={setMaxAnnualWithdrawalRate} 
              step={0.5} 
              min={0.001} 
              max={0.2} 
              tooltip={t('tooltips.maxAnnualWithdrawalRate')}
            />
            {errors.maxAnnualWithdrawalRate && (
              <div className="text-xs text-red-600 dark:text-red-400">{errors.maxAnnualWithdrawalRate}</div>
            )}
          </div>
        )}
        
        <div>
          <LabeledPercentage 
            label={t('labels.annualFee')} 
            value={annualFee} 
            setValue={setAnnualFee} 
            step={0.1} 
            min={0} 
            tooltip={t('tooltips.annualFee')} 
            tooltipWidth="lg"
          />
          {errors.annualFee && (
            <div className="text-xs text-red-600 dark:text-red-400">{errors.annualFee}</div>
          )}
        </div>
        
        <div>
          <LabeledPercentage 
            label={t('labels.taxRateOnGains')} 
            value={taxRateOnGains} 
            setValue={setTaxRateOnGains} 
            step={0.1} 
            min={0} 
            max={1} 
            tooltip={t('tooltips.taxRateOnGains')} 
            tooltipWidth="lg"
          />
          {errors.taxRateOnGains && (
            <div className="text-xs text-red-600 dark:text-red-400">{errors.taxRateOnGains}</div>
          )}
        </div>
        
        <div>
          <LabeledPercentage 
            label={t('labels.taxRateOnWithdrawals')} 
            value={taxRateOnWithdrawals} 
            setValue={setTaxRateOnWithdrawals} 
            step={0.1} 
            min={0} 
            max={1} 
            tooltip={t('tooltips.taxRateOnWithdrawals')} 
            tooltipWidth="lg"
          />
          {errors.taxRateOnWithdrawals && (
            <div className="text-xs text-red-600 dark:text-red-400">{errors.taxRateOnWithdrawals}</div>
          )}
        </div>
      </div>
    </Section>
  );
}
