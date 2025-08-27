import type { CalcMode, RetireModel } from '../../types';
import { LabeledNumber, LabeledSelect } from '../ui/FormComponents';
import { Section } from '../ui/FormComponents';
import { useTranslation } from 'react-i18next';

interface BasicsFormProps {
  currentAge: number;
  setCurrentAge: (value: number) => void;
  retirementAge: number;
  setRetirementAge: (value: number) => void;
  calcMode: CalcMode;
  setCalcMode: (value: CalcMode) => void;
  retireModel: RetireModel;
  setRetireModel: (value: RetireModel) => void;
  retirementHorizonYears: number;
  setRetirementHorizonYears: (value: number) => void;
  currentAssets: number;
  setCurrentAssets: (value: number) => void;
  errors?: { [key: string]: string };
}

export function BasicsForm({
  currentAge,
  setCurrentAge,
  retirementAge,
  setRetirementAge,
  calcMode,
  setCalcMode,
  retireModel,
  setRetireModel,
  retirementHorizonYears,
  setRetirementHorizonYears,
  currentAssets,
  setCurrentAssets,
  errors = {},
}: BasicsFormProps) {
  const { t } = useTranslation();
  return (
    <Section title={t('section.basics')}>
      <div className="grid gap-3">
        <div>
          <LabeledNumber 
            label={t('labels.currentAge')} 
            value={currentAge} 
            setValue={setCurrentAge} 
            step={1} 
            min={0} 
            tooltip={t('tooltips.currentAge')}
          />
          {errors.currentAge && (
            <div className="text-xs text-red-600 dark:text-red-400">{errors.currentAge}</div>
          )}
        </div>
        
        <div>
          <LabeledNumber 
            label={t('labels.retirementAge')} 
            value={retirementAge} 
            setValue={setRetirementAge} 
            step={1} 
            min={1} 
            tooltip={t('tooltips.retirementAge')}
          />
          {errors.retirementAge && (
            <div className="text-xs text-red-600 dark:text-red-400">{errors.retirementAge}</div>
          )}
        </div>
        
        <LabeledSelect
          label={t('labels.calculationMode')}
          value={calcMode}
          setValue={(v: CalcMode) => setCalcMode(v)}
          options={[
            { label: t('options.calcMode.deterministic'), value: 'Deterministic' },
            { label: t('options.calcMode.monteCarlo'), value: 'MonteCarlo' }
          ]}
          tooltip={t('tooltips.calcMode')}
          tooltipWidth="lg"
        />
        
        <LabeledSelect
          label={t('labels.retirementModel')}
          value={retireModel}
          setValue={(v: RetireModel) => setRetireModel(v)}
          options={[
            { label: t('options.retireModel.withdrawalRate'), value: 'WithdrawalRate' },
            { label: t('options.retireModel.amortization'), value: 'Amortization' }
          ]}
          tooltip={t('tooltips.retireModel')}
          tooltipWidth="lg"
        />
        
        {retireModel === 'Amortization' && (
          <div>
            <LabeledNumber 
              label={t('labels.retirementHorizonYears')} 
              value={retirementHorizonYears} 
              setValue={setRetirementHorizonYears} 
              step={1} 
              min={1} 
              tooltip={t('tooltips.retirementHorizonYears')}
            />
            {errors.retirementHorizonYears && (
              <div className="text-xs text-red-600 dark:text-red-400">{errors.retirementHorizonYears}</div>
            )}
          </div>
        )}
        
        <div>
          <LabeledNumber 
            label={t('labels.currentAssets')} 
            value={currentAssets} 
            setValue={setCurrentAssets} 
            step={10000} 
            min={0} 
            tooltip={t('tooltips.currentAssets')}
            tooltipWidth="lg"
          />
          {errors.currentAssets && (
            <div className="text-xs text-red-600 dark:text-red-400">{errors.currentAssets}</div>
          )}
        </div>
      </div>
    </Section>
  );
}
