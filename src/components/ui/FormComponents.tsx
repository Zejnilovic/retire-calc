import React from 'react';
import { Tooltip, InfoIcon } from './Tooltip';

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl shadow p-5 bg-white dark:bg-gray-800 border dark:border-gray-700">
      <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">{title}</h2>
      {children}
    </div>
  );
}

export function LabeledNumber({
  label,
  value,
  setValue,
  step = 0.01,
  min,
  max,
  tooltip,
  tooltipWidth = 'md',
}: {
  label: string;
  value: number;
  setValue: (v: number) => void;
  step?: number;
  min?: number;
  max?: number;
  tooltip?: string;
  tooltipWidth?: 'sm' | 'md' | 'lg' | 'xl';
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
        {label}
        {tooltip && (
          <Tooltip content={tooltip} width={tooltipWidth}>
            <InfoIcon className="w-3 h-3 text-gray-400 dark:text-gray-500" />
          </Tooltip>
        )}
      </span>
      <input
        type="number"
        className="border rounded-xl px-3 py-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        value={Number.isFinite(value) ? value : 0}
        step={step}
        min={min}
        max={max}
        onChange={(e) => setValue(parseFloat(e.target.value))}
      />
    </label>
  );
}

export function LabeledPercentage({
  label,
  value,
  setValue,
  step = 0.1,
  min,
  max,
  tooltip,
  tooltipWidth = 'md',
}: {
  label: string;
  value: number;
  setValue: (v: number) => void;
  step?: number;
  min?: number;
  max?: number;
  tooltip?: string;
  tooltipWidth?: 'sm' | 'md' | 'lg' | 'xl';
}) {
  const percentageValue = value * 100;
  const stepDecimals = step.toString().includes('.') ? step.toString().split('.')[1].length : 0;
  const displayValue = Number.isFinite(percentageValue)
    ? parseFloat(percentageValue.toFixed(stepDecimals))
    : 0;
  
  const handleChange = (percentValue: number) => {
    setValue(percentValue / 100);
  };

  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1"> 
        {label} (%)
        {tooltip && (
          <Tooltip content={tooltip} width={tooltipWidth}>
            <InfoIcon className="w-3 h-3 text-gray-400 dark:text-gray-500" />
          </Tooltip>
        )}
      </span>
      <input
        type="number"
        className="border rounded-xl px-3 py-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        value={displayValue}
        step={step}
        min={min !== undefined ? min * 100 : undefined}
        max={max !== undefined ? max * 100 : undefined}
        onChange={(e) => handleChange(parseFloat(e.target.value))}
      />
    </label>
  );
}

export function LabeledSelect({
  label,
  value,
  setValue,
  options,
  tooltip,
  tooltipWidth = 'md',
}: {
  label: string;
  value: string;
  setValue: (v: any) => void;
  options: { label: string; value: string }[];
  tooltip?: string;
  tooltipWidth?: 'sm' | 'md' | 'lg' | 'xl';
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
        {label}
        {tooltip && (
          <Tooltip content={tooltip} width={tooltipWidth}>
            <InfoIcon className="w-3 h-3 text-gray-400 dark:text-gray-500" />
          </Tooltip>
        )}
      </span>
      <select
        className="border rounded-xl px-3 py-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}
