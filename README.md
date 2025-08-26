# Retirement Savings Calculator

A comprehensive React-based retirement planning tool that helps users estimate how much they need to save monthly to achieve their desired retirement income. Built with React, TypeScript, Vite, and Tailwind CSS, featuring full internationalization support (English/Czech) and advanced financial modeling.

## What It Does

This calculator provides **inflation-adjusted** (real terms) retirement planning with sophisticated financial modeling:

- **Target Capital Calculation**: Shows both today's purchasing power and future dollar amounts needed at retirement
- **Monthly Savings Requirements**: Calculates required monthly contributions
- **Scenario Analysis**: Compare base, optimistic, and pessimistic scenarios
- **Tax & Fee Modeling**: Accounts for investment fees, capital gains taxes, and withdrawal taxes
- **Two Calculation Modes**: Deterministic and Monte Carlo simulation
- **Bilingual Interface**: Full English and Czech localization with currency support
- **Educational Content**: Comprehensive help sections and tooltips

## Features

### Internationalization
- **Languages**: English and Czech with full UI translation
- **Currencies**: EUR, USD, CZK with locale-aware formatting
- **Educational Content**: Localized help sections, tooltips, and explanations

### Calculation Modes
- **Deterministic**: Fixed assumptions with three scenarios (base/optimistic/pessimistic)
- **Monte Carlo**: Stochastic simulation with volatility modeling and success probability

### Retirement Models
- **Withdrawal Rate Model**: Based on sustainable withdrawal rates (e.g., 4% rule)
- **Amortization Model**: Fixed retirement horizon with complete capital depletion

### Key Inputs
- Personal: Current age, retirement age, current assets
- Economic: Inflation rate, nominal returns, volatility
- Costs: Investment fees, tax rates on gains and withdrawals
- Goals: Desired monthly withdrawal, withdrawal rate or retirement horizon

### Outputs
- Required monthly savings (in today's money)
- Target retirement capital (both real and nominal amounts)
- Future value of current assets (both real and nominal amounts)
- Monte Carlo success probability

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Internationalization**: i18next + react-i18next
- **State Management**: React Context (LocaleContext, DarkModeContext)
- **Deployment**: Static hosting ready (GitHub Pages, Netlify, etc.)

## Installation & Setup

```bash
# Clone the repository
git clone <repository-url>
cd retire-calc

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Localization

The app supports full bilingual functionality:

### Available Languages
- **English** (`en`): Complete interface, help text, and tooltips
- **Czech** (`cs`): Complete interface, help text, and tooltips

### Supported Currencies  
- EUR (€), USD ($), CZK (Kč) with proper locale formatting

### Translation Keys
All user-facing text uses translation keys organized by feature:
- `section.*` - Form section titles
- `labels.*` - Input field labels  
- `tooltips.*` - Help text and explanations
- `results.*` - Results display text
- `info.*` - Educational content
- `options.*` - Dropdown options

## Financial Models

### Real vs Nominal Values
The calculator displays both perspectives for complete transparency:
- **Real (Today's Money)**: Inflation-adjusted purchasing power
- **Nominal (Future Money)**: Actual dollar amounts you'll see at retirement

### Real Returns Calculation
All calculations use **real returns** (inflation-adjusted) to express results in today's purchasing power:

```
Real Return = (1 + Nominal Return) / (1 + Inflation) - 1
```

### Tax and Fee Modeling
- Investment fees reduce gross returns
- Capital gains taxes apply to net positive returns  
- Withdrawal taxes reduce net retirement income

### Monte Carlo Simulation
- Uses Box-Muller transform for normal distribution
- Bisection search to find required contribution for target success rate
- Models both accumulation and withdrawal phases with volatility

## Educational Features

### InfoSections Component
- **About this calculator**: Explains the tool's purpose and modes
- **How to interpret results**: Defines key terms and metrics  
- **Quick tips**: Practical advice for realistic assumptions
- **Disclaimer**: Clarifies educational vs. advisory nature

### Comprehensive Tooltips
Every input field and result metric includes helpful explanations:
- Technical definitions of financial terms
- Practical guidance on reasonable input ranges  
- Context about how each parameter affects results

## Usage Example

1. **Set Personal Details**: Age 35, retire at 65
2. **Define Goals**: €3,000 monthly withdrawal in today's money
3. **Economic Assumptions**: 2.5% inflation, 6% nominal returns
4. **Choose Model**: 4% withdrawal rate or 30-year finite horizon  
5. **Review Results**: Required monthly savings and success probability
2. **Define Goals**: 45,000 CZK monthly withdrawal in today's money
3. **Economic Assumptions**: 2.5% inflation, 6% nominal returns
4. **Choose Model**: 4% withdrawal rate or 30-year finite horizon
5. **Review Results**: Required monthly savings and success probability

## Configuration

### Key Files
- `src/App.tsx` - Main application orchestration
- `src/components/` - Modular UI components  
- `src/utils/calculations.ts` - Core deterministic calculations
- `src/utils/financial.ts` - Financial utility functions
- `src/contexts/LocaleContext.tsx` - Language and currency management
- `src/locales/` - Translation files
- `vite.config.ts` - Build configuration
- `tsconfig.json` - TypeScript configuration

### Adding New Languages
1. Create `src/locales/[lang]/translation.json`
2. Add language option to `LocaleContext.tsx`  
3. Update `src/i18n.ts` to include new locale
4. Add currency formatting support in `utils/formatting.ts`

### Customization
- Modify default values in component state
- Adjust Monte Carlo parameters (trials, volatility ranges)
- Update currency formatting in `fmtMoney()` function
- Add new economic scenarios by extending delta parameters

## Mathematical Functions

The app includes comprehensive financial calculation functions:

### Core Financial Functions (`utils/financial.ts`)
- `realReturn()` - Convert nominal to real returns
- `netNominalAfterFeesTaxes()` - Apply fees and taxes
- `fvLumpSum()` & `fvAnnuity()` - Future value calculations
- `requiredCapital_WithdrawalRate()` - 4% rule calculations
- `requiredCapital_Amortization()` - Finite horizon calculations
- `realToNominalAtRetirement()` - Convert real to nominal amounts

### Calculation Orchestration (`utils/calculations.ts`)
- `computeDeterministic()` - Main deterministic calculation
- Scenario analysis with optimistic/pessimistic deltas
- Both real and nominal result generation

### Monte Carlo Simulation (`utils/monteCarlo.ts`)
- `computeMonteCarlo()` - Stochastic simulation with bisection search
- Normal distribution sampling for return volatility
- Success probability calculation over retirement horizon

## Current Status

### Completed Features

#### 🌍 **Full Internationalization**
- ✅ English and Czech language support
- ✅ EUR, USD, CZK currency formatting  
- ✅ Comprehensive translations for all UI elements
- ✅ Localized educational content and tooltips
- ✅ Locale-aware number and currency formatting

#### **Advanced Financial Modeling**
- ✅ Deterministic calculations with scenario analysis
- ✅ Monte Carlo simulation with volatility modeling
- ✅ Both real and nominal value displays
- ✅ Tax and fee modeling (gains, withdrawals, investment fees)
- ✅ Two retirement models (withdrawal rate + amortization)

#### **User Experience**
- ✅ Modern, responsive design with Tailwind CSS v4
- ✅ Dark mode support with system preference detection
- ✅ Comprehensive tooltips for all inputs and results
- ✅ Educational InfoSections with practical guidance
- ✅ Input validation and error handling
- ✅ Stale data warnings for Monte Carlo results

#### **Technical Implementation**
- ✅ TypeScript with comprehensive type safety
- ✅ Modular component architecture  
- ✅ React Context for state management
- ✅ Pure functional financial calculations
- ✅ Proper separation of concerns (UI/logic/data)

### Planned Enhancements

#### **Visualization** (Future)
- Interactive charts showing portfolio growth over time
- Monte Carlo result distributions
- Historical backtesting capabilities

#### **Sharing & Export** (Future)  
- URL parameter encoding for shareable scenarios
- PDF report generation
- CSV export for analysis

#### **Advanced Modeling** (Future)
- Multiple account types (taxable, tax-deferred, tax-free)
- Social security/pension integration
- Healthcare cost modeling
- Dynamic withdrawal strategies

### Contributing

To add new features:

1. **New Languages**: Add translation files and update `LocaleContext`
2. **Financial Functions**: Extend `utils/financial.ts` with pure functions
3. **UI Components**: Create reusable components in `components/ui/`
4. **Calculation Modes**: Extend the `Inputs` interface and computation functions
5. **Styling**: Modify `src/input.css` with Tailwind utilities

### Architecture Notes

- **Modular Architecture**: Clean separation between UI, logic, and data
- **Type Safety**: Comprehensive TypeScript interfaces for all data structures
- **Pure Functions**: Financial calculations are side-effect free and testable  
- **Context-Based State**: Locale and theme management via React Context
- **Static Hosting**: No backend required, perfect for GitHub Pages/Netlify
- **Internationalization-First**: Built from ground up for multiple languages

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit issues, feature requests, or pull requests.

### Development Setup
1. Fork the repository
2. Install dependencies: `npm install`  
3. Start development server: `npm run dev`
4. Make changes and test thoroughly
5. Update translations if UI text changes
6. Submit pull request

---

**Disclaimer**: This calculator is for educational purposes only and does not constitute financial advice. Market returns are unpredictable, and tax rules vary by jurisdiction. Always consult with a qualified financial advisor for personalized retirement planning guidance.
