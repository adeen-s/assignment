/**
 * Currency configuration and utilities
 */

/**
 * Supported currencies with their symbols
 */
export const SUPPORTED_CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
] as const;

export type CurrencyCode = (typeof SUPPORTED_CURRENCIES)[number]["code"];

/**
 * Gets the user's locale-based currency or defaults to USD
 *
 * @returns {CurrencyCode} The detected currency code
 */
export function getDefaultCurrency(): CurrencyCode {
  const locale = navigator.language || "en-US";

  // Map common locales to currencies
  const localeMap: Record<string, CurrencyCode> = {
    "en-US": "USD",
    "en-GB": "GBP",
    "de-DE": "EUR",
    "fr-FR": "EUR",
    "es-ES": "EUR",
    "it-IT": "EUR",
    "en-IN": "INR",
  };

  // Try exact match first
  if (locale in localeMap) {
    return localeMap[locale];
  }

  // Try language code only (e.g., 'en' from 'en-US')
  const language = locale.split("-")[0];
  const matchingEntry = Object.entries(localeMap).find(([key]) =>
    key.startsWith(language + "-")
  );

  return matchingEntry ? matchingEntry[1] : "USD";
}

/**
 * Gets currency information by code
 *
 * @param {CurrencyCode} code - The currency code
 * @returns {typeof SUPPORTED_CURRENCIES[number] | undefined} Currency information
 */
export function getCurrencyInfo(code: CurrencyCode) {
  return SUPPORTED_CURRENCIES.find((currency) => currency.code === code);
}
