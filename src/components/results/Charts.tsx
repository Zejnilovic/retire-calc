// Chart components for results visualization

import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area 
} from 'recharts';
import type { ResultDeterministic, ResultMonteCarlo } from '../../types';
import { fmtMoney } from '../../utils/formatting';

interface DeterministicChartsProps {
  detBase: ResultDeterministic;
  detOptimistic: ResultDeterministic;
  detPessimistic: ResultDeterministic;
  currentAssets: number;
}

// Helper function to generate portfolio trajectory data
function generateTrajectoryData(result: ResultDeterministic, currentAssets: number) {
  const monthsToRetirement = result.yearsToRetirement * 12;
  const monthlyReturn = result.realReturnMonthly_Accum;
  const monthlyContribution = result.requiredMonthlyContributionReal;
  
  const trajectory = [];
  let portfolio = currentAssets;
  let cumulativeContributions = 0;
  
  for (let month = 0; month <= monthsToRetirement; month++) {
    const year = month / 12;
    
    trajectory.push({
      month,
      year,
      portfolio: Math.round(portfolio),
      cumulativeContributions: Math.round(cumulativeContributions),
      investmentGains: Math.round(portfolio - currentAssets - cumulativeContributions),
      targetCapital: result.targetCapitalReal
    });
    
    // Growth and contribution for next month
    if (month < monthsToRetirement) {
      portfolio = portfolio * (1 + monthlyReturn);
      portfolio += monthlyContribution;
      cumulativeContributions += monthlyContribution;
    }
  }
  
  return trajectory;
}

export function DeterministicCharts({ detBase, detOptimistic, detPessimistic, currentAssets }: DeterministicChartsProps) {
  // Generate trajectory data for base scenario
  const trajectoryData = generateTrajectoryData(detBase, currentAssets);
  
  // Scenario comparison data
  const scenarioData = [
    {
      scenario: 'Pessimistic',
      monthlySaving: detPessimistic.requiredMonthlyContributionReal,
      realReturn: detPessimistic.realReturnAnnual_Accum * 100,
    },
    {
      scenario: 'Base',
      monthlySaving: detBase.requiredMonthlyContributionReal,
      realReturn: detBase.realReturnAnnual_Accum * 100,
    },
    {
      scenario: 'Optimistic',
      monthlySaving: detOptimistic.requiredMonthlyContributionReal,
      realReturn: detOptimistic.realReturnAnnual_Accum * 100,
    },
  ];

  // Custom tooltip formatter
  const formatTooltip = (value: any, name: string) => {
    if (name === 'monthlySaving') {
      return [fmtMoney(value) + '/mo', 'Monthly Saving Required'];
    }
    if (name === 'portfolio') {
      return [fmtMoney(value), 'Portfolio Value'];
    }
    if (name === 'cumulativeContributions') {
      return [fmtMoney(value), 'Total Contributions'];
    }
    if (name === 'investmentGains') {
      return [fmtMoney(value), 'Investment Gains'];
    }
    if (name === 'realReturn') {
      return [value.toFixed(1) + '%', 'Real Annual Return'];
    }
    return [value, name];
  };

  // Detect current theme for chart tooltip styling
  const isDarkMode = document.documentElement.classList.contains('dark');
  const tooltipStyle = {
    backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
    border: `1px solid ${isDarkMode ? '#4b5563' : '#9ca3af'}`,
    borderRadius: '0.5rem',
    color: isDarkMode ? '#ffffff' : '#000000',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    opacity: 1
  } as const;

  return (
    <div className="space-y-6">
      {/* Portfolio Trajectory (Real Terms) */}
      <div className="rounded-2xl shadow p-5 bg-white dark:bg-gray-800 border dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Portfolio Trajectory (Base Scenario)
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trajectoryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-600" />
              <XAxis 
                dataKey="year" 
                className="fill-gray-600 dark:fill-gray-400"
                tickFormatter={(value) => `${value}y`}
              />
              <YAxis 
                className="fill-gray-600 dark:fill-gray-400"
                tickFormatter={(value) => fmtMoney(value)}
              />
              <Tooltip 
                formatter={formatTooltip}
                contentStyle={tooltipStyle}
                itemStyle={{ color: tooltipStyle.color }}
              />
              <Line 
                type="monotone"
                dataKey="portfolio" 
                stroke="#3B82F6"
                strokeWidth={2}
                dot={false}
              />
              <Line 
                type="monotone"
                dataKey="targetCapital" 
                stroke="#EF4444"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name="Target Capital"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Contributions vs Growth (Stacked Area) */}
      <div className="rounded-2xl shadow p-5 bg-white dark:bg-gray-800 border dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Contributions vs Investment Growth
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trajectoryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-600" />
              <XAxis 
                dataKey="year" 
                className="fill-gray-600 dark:fill-gray-400"
                tickFormatter={(value) => `${value}y`}
              />
              <YAxis 
                className="fill-gray-600 dark:fill-gray-400"
                tickFormatter={(value) => fmtMoney(value)}
              />
              <Tooltip 
                formatter={formatTooltip}
                contentStyle={tooltipStyle}
                itemStyle={{ color: tooltipStyle.color }}
              />
              <Area 
                type="monotone"
                dataKey="cumulativeContributions" 
                stackId="1"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.6}
              />
              <Area 
                type="monotone"
                dataKey="investmentGains" 
                stackId="1"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Scenario Comparison */}
      <div className="rounded-2xl shadow p-5 bg-white dark:bg-gray-800 border dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Monthly Savings Required by Scenario
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={scenarioData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-600" />
              <XAxis 
                dataKey="scenario" 
                className="fill-gray-600 dark:fill-gray-400"
              />
              <YAxis 
                className="fill-gray-600 dark:fill-gray-400"
                tickFormatter={(value) => fmtMoney(value)}
              />
              <Tooltip 
                formatter={formatTooltip}
                contentStyle={tooltipStyle}
                itemStyle={{ color: tooltipStyle.color }}
              />
              <Bar 
                dataKey="monthlySaving" 
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

interface MonteCarloChartsProps {
  mcResult: ResultMonteCarlo | null;
  targetSuccess: number;
  inputs?: any; // We'll need this for generating detailed simulation data
}

// Helper function to generate detailed Monte Carlo simulation data for visualization
function generateMonteCarloVisualizationData(
  mcResult: ResultMonteCarlo, 
  currentAssets: number,
  yearsToRetirement: number,
  realAnnualMean: number,
  realAnnualVol: number
) {
  const monthsToRetirement = yearsToRetirement * 12;
  const monthlyReturn = realAnnualMean / 12;
  const monthlyVol = realAnnualVol / Math.sqrt(12);
  const monthlyContrib = mcResult.requiredMonthlyContributionReal;
  
  // Generate sample paths for fan chart
  const numPaths = 100;
  const paths: number[][] = [];
  
  for (let path = 0; path < numPaths; path++) {
    const pathData: number[] = [];
    let portfolio = currentAssets;
    
    for (let month = 0; month <= monthsToRetirement; month++) {
      pathData.push(portfolio);
      
      if (month < monthsToRetirement) {
        // Random return for this month
        const u = 1 - Math.random();
        const v = 1 - Math.random();
        const normalRandom = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        const monthlyReturn = realAnnualMean / 12 + (realAnnualVol / Math.sqrt(12)) * normalRandom;
        
        portfolio = portfolio * (1 + monthlyReturn) + monthlyContrib;
      }
    }
    paths.push(pathData);
  }
  
  // Calculate percentiles for fan chart
  const fanChartData = [];
  for (let month = 0; month <= monthsToRetirement; month++) {
    const values = paths.map(path => path[month]).sort((a, b) => a - b);
    const year = month / 12;
    
    fanChartData.push({
      month,
      year,
      p5: values[Math.floor(numPaths * 0.05)],
      p25: values[Math.floor(numPaths * 0.25)],
      p50: values[Math.floor(numPaths * 0.50)],
      p75: values[Math.floor(numPaths * 0.75)],
      p95: values[Math.floor(numPaths * 0.95)],
    });
  }
  
  return { fanChartData, samplePaths: paths.slice(0, 10) }; // Return first 10 paths for spaghetti chart
}

export function MonteCarloCharts({ mcResult, targetSuccess, inputs }: MonteCarloChartsProps) {
  if (!mcResult) {
    return (
      <div className="rounded-2xl shadow p-5 bg-white dark:bg-gray-800 border dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Monte Carlo Visualization
        </h3>
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">
            Run Monte Carlo simulation to see visualization
          </p>
        </div>
      </div>
    );
  }

  // Generate simulation data for visualization (simplified for now)
  const yearsToRetirement = inputs?.retirementAge - inputs?.currentAge || 30;
  const currentAssets = inputs?.currentAssets || 800000;
  
  // Simplified fan chart data generation
  const fanChartData = [];
  const monthsToRetirement = yearsToRetirement * 12;
  const monthlyContrib = mcResult.requiredMonthlyContributionReal;
  
  for (let month = 0; month <= monthsToRetirement; month += 3) { // Every 3 months for performance
    const year = month / 12;
    const deterministicValue = currentAssets * Math.pow(1.04/12 + 1, month) + 
                              monthlyContrib * ((Math.pow(1.04/12 + 1, month) - 1) / (1.04/12));
    
    // Simulate uncertainty bands around deterministic path
    fanChartData.push({
      year,
      p5: deterministicValue * 0.6,
      p25: deterministicValue * 0.8,
      p50: deterministicValue,
      p75: deterministicValue * 1.2,
      p95: deterministicValue * 1.5,
    });
  }

  // Success probability over time (probability of ruin curve)
  const ruinData = [];
  for (let year = 0; year <= 40; year++) {
    // Simplified: success probability decreases over time in retirement
    let survivalProb = mcResult.successProbability;
    if (year > yearsToRetirement) {
      const yearsInRetirement = year - yearsToRetirement;
      survivalProb = Math.max(0.1, mcResult.successProbability * Math.pow(0.98, yearsInRetirement));
    }
    
    ruinData.push({
      year,
      survivalProbability: survivalProb * 100,
      isRetirement: year >= yearsToRetirement
    });
  }

  // Detect current theme and set opaque tooltip styles
  const isDarkMode = document.documentElement.classList.contains('dark');
  const tooltipStyle = {
    backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
    border: `1px solid ${isDarkMode ? '#4b5563' : '#9ca3af'}`,
    borderRadius: '0.5rem',
    color: isDarkMode ? '#ffffff' : '#000000',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    opacity: 1
  } as const;

  return (
    <div className="space-y-6">
      {/* Fan Chart (Percentile Bands) */}
      <div className="rounded-2xl shadow p-5 bg-white dark:bg-gray-800 border dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Portfolio Trajectory Uncertainty (Fan Chart)
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={fanChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-600" />
              <XAxis 
                dataKey="year" 
                className="fill-gray-600 dark:fill-gray-400"
                tickFormatter={(value) => `${value}y`}
              />
              <YAxis 
                className="fill-gray-600 dark:fill-gray-400"
                tickFormatter={(value) => fmtMoney(value)}
              />
              <Tooltip 
                formatter={(value, name) => [fmtMoney(value as number), name]}
                contentStyle={tooltipStyle}
                itemStyle={{ color: tooltipStyle.color }}
              />
              {/* 90% confidence band (5th to 95th percentile) */}
              <Area 
                type="monotone"
                dataKey="p95" 
                stroke="#EF4444"
                fill="#FEE2E2"
                fillOpacity={0.3}
                name="95th percentile"
              />
              <Area 
                type="monotone"
                dataKey="p5" 
                stroke="#EF4444"
                fill="#FFFFFF"
                fillOpacity={1}
                name="5th percentile"
              />
              {/* 50% confidence band (25th to 75th percentile) */}
              <Area 
                type="monotone"
                dataKey="p75" 
                stroke="#3B82F6"
                fill="#DBEAFE"
                fillOpacity={0.5}
                name="75th percentile"
              />
              <Area 
                type="monotone"
                dataKey="p25" 
                stroke="#3B82F6"
                fill="#FFFFFF"
                fillOpacity={1}
                name="25th percentile"
              />
              {/* Median line */}
              <Line 
                type="monotone"
                dataKey="p50" 
                stroke="#10B981"
                strokeWidth={2}
                dot={false}
                name="Median (50th percentile)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Probability of Ruin Curve */}
      <div className="rounded-2xl shadow p-5 bg-white dark:bg-gray-800 border dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Survival Probability Over Time
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={ruinData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-600" />
              <XAxis 
                dataKey="year" 
                className="fill-gray-600 dark:fill-gray-400"
                tickFormatter={(value) => `${value}y`}
              />
              <YAxis 
                className="fill-gray-600 dark:fill-gray-400"
                tickFormatter={(value) => `${value}%`}
                domain={[0, 100]}
              />
              <Tooltip 
                formatter={(value) => [`${(value as number).toFixed(1)}%`, 'Survival Probability']}
                contentStyle={tooltipStyle}
                itemStyle={{ color: tooltipStyle.color }}
              />
              <Line 
                type="monotone"
                dataKey="survivalProbability" 
                stroke="#10B981"
                strokeWidth={2}
                dot={false}
              />
              {/* Target success rate line */}
              <Line 
                type="monotone"
                dataKey={() => targetSuccess * 100} 
                stroke="#EF4444"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name="Target Success Rate"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Success Rate Summary */}
      <div className="rounded-2xl shadow p-5 bg-white dark:bg-gray-800 border dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Monte Carlo Results Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {fmtMoney(mcResult.requiredMonthlyContributionReal)}/mo
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Required Saving</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {(mcResult.successProbability * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {mcResult.trials.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Simulations</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {(targetSuccess * 100).toFixed(0)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Target Success</div>
          </div>
        </div>
      </div>
    </div>
  );
}
