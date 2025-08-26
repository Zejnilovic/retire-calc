import { Section } from './ui/FormComponents';
import { useTranslation } from 'react-i18next';

export function InfoSections() {
  const { t } = useTranslation();
  return (
    <div className="mt-8 grid md:grid-cols-2 gap-5 md:mb-5">
      <Section title={t('info.aboutTitle')}>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {t('info.aboutText1')}
        </p>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {t('info.aboutText2')}
        </p>
      </Section>

      <Section title={t('info.interpretationTitle')}>
        <ul className="list-disc pl-6 space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li><b>{t('info.realAnnualReturn')}</b>: {t('info.realAnnualReturnDesc')}</li>
          <li><b>{t('info.targetCapital')}</b>: {t('info.targetCapitalDesc')}</li>
          <li><b>{t('info.requiredSaving')}</b>: {t('info.requiredSavingDesc')}</li>
          <li>{t('info.successProbabilityDesc')}</li>
        </ul>
      </Section>

      <Section title={t('info.quickTipsTitle')}>
        <ul className="list-disc pl-6 space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>{t('info.quickTip1')}</li>
          <li>{t('info.quickTip2')}</li>
          <li>{t('info.quickTip3')}</li>
          <li>{t('info.quickTip4')}</li>
        </ul>
      </Section>

      <Section title={t('info.disclaimerTitle')}>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {t('info.disclaimerText')}
        </p>
      </Section>
    </div>
  );
}
