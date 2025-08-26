export function fmtPct(x: number): string {
  return `${(x * 100).toFixed(2)}%`;
}

/**
 * Format a monetary amount according to locale and currency code.
 * @param x Amount (numeric)
 * @param locale BCP 47 locale string, e.g. 'cs' or 'en'
 * @param currency Currency code, e.g. 'CZK', 'EUR', 'USD'
 */
export function fmtMoney(
  x: number,
  locale?: string,
  currency: string = 'CZK'
): string {
  try {
    return x.toLocaleString(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    });
  } catch {
    // fallback numeric with currency code
    return `${x.toLocaleString(undefined, { maximumFractionDigits: 0 })} ${currency}`;
  }
}
