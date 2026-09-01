/* ================= EXCHANGE RATES ================= */

export const exchangeRates = {
  MUR: 1,

  EUR: 0.020,

  USD: 0.021,

  GBP: 0.017,

  CAD: 0.029,

  AUD: 0.032,

  AED: 0.077,

  INR: 1.75,

  ZAR: 0.39,

  CHF: 0.019,

  CNY: 0.15,

  JPY: 3.24,
} as const;

/* ================= TYPES ================= */

export type Currency =
  keyof typeof exchangeRates;

/* ================= SYMBOLS ================= */

export const currencySymbols: Record<
  Currency,
  string
> = {
  MUR: "Rs",

  EUR: "€",

  USD: "$",

  GBP: "£",

  CAD: "C$",

  AUD: "A$",

  AED: "د.إ",

  INR: "₹",

  ZAR: "R",

  CHF: "CHF",

  CNY: "¥",

  JPY: "¥",
};

/* ================= NAMES ================= */

export const currencyNames: Record<
  Currency,
  string
> = {
  MUR: "Mauritian Rupee",

  EUR: "Euro",

  USD: "US Dollar",

  GBP: "British Pound",

  CAD: "Canadian Dollar",

  AUD: "Australian Dollar",

  AED: "UAE Dirham",

  INR: "Indian Rupee",

  ZAR: "South African Rand",

  CHF: "Swiss Franc",

  CNY: "Chinese Yuan",

  JPY: "Japanese Yen",
};

/* ================= FLAGS ================= */

export const currencyFlags: Record<
  Currency,
  string
> = {
  MUR: "🇲🇺",

  EUR: "🇪🇺",

  USD: "🇺🇸",

  GBP: "🇬🇧",

  CAD: "🇨🇦",

  AUD: "🇦🇺",

  AED: "🇦🇪",

  INR: "🇮🇳",

  ZAR: "🇿🇦",

  CHF: "🇨🇭",

  CNY: "🇨🇳",

  JPY: "🇯🇵",
};

/* ================= FORMAT CURRENCY ================= */

export function formatCurrency(
  amount: number,
  currency: Currency = "USD"
) {
  const safeAmount =
    Number.isFinite(amount)
      ? amount
      : 0;

  try {
    return new Intl.NumberFormat(
      undefined,
      {
        style: "currency",

        currency,

        maximumFractionDigits: 2,
      }
    ).format(
      safeAmount / 100
    );
  } catch {
    return `${currency} ${(
      safeAmount / 100
    ).toFixed(2)}`;
  }
}

/* ================= MINOR UNITS ================= */

export function toMinorUnits(
  amount: number
) {
  return Math.round(
    (Number.isFinite(amount)
      ? amount
      : 0) * 100
  );
}

export function fromMinorUnits(
  amount: number
) {
  return (
    (Number.isFinite(amount)
      ? amount
      : 0) / 100
  );
}

/* ================= CONVERSION ================= */

export function convertFromMUR(
  amountMUR: number,
  targetCurrency: Currency
): number {
  const rate =
    exchangeRates[
      targetCurrency
    ];

  return amountMUR * rate;
}

export function convertToMUR(
  amount: number,
  fromCurrency: Currency
): number {
  const rate =
    exchangeRates[
      fromCurrency
    ];

  return amount / rate;
}

/* ================= SMART MONEY FORMAT ================= */

export function formatMoney(
  amount: number,
  currency: Currency
): string {
  const symbol =
    currencySymbols[
      currency
    ];

  const formatted =
    Number.isFinite(amount)
      ? amount.toLocaleString(
          undefined,
          {
            minimumFractionDigits: 0,

            maximumFractionDigits: 2,
          }
        )
      : "0";

  return `${symbol} ${formatted}`;
}

/* ================= ADVANCED MONEY DISPLAY ================= */

export function formatLuxuryMoney(
  amount: number,
  currency: Currency
): string {
  return `${currencyFlags[currency]} ${formatMoney(
    amount,
    currency
  )}`;
}

/* ================= SMART FX DISPLAY ================= */

export function getExchangeRateLabel(
  currency: Currency
) {
  return `1 MUR = ${
    exchangeRates[
      currency
    ]
  } ${currency}`;
}

/* ================= AUTO DETECT ================= */

export function detectPreferredCurrency(): Currency {
  try {
    const locale =
      Intl.DateTimeFormat()
        .resolvedOptions()
        .locale;

    if (
      locale.includes("en-US")
    ) {
      return "USD";
    }

    if (
      locale.includes("en-GB")
    ) {
      return "GBP";
    }

    if (
      locale.includes("fr")
    ) {
      return "EUR";
    }

    if (
      locale.includes("en-IN")
    ) {
      return "INR";
    }

    return "USD";
  } catch {
    return "USD";
  }
}

/* ================= SAVE PREFERENCE ================= */

export function saveCurrencyPreference(
  currency: Currency
) {
  localStorage.setItem(
    "preferred_currency",
    currency
  );

  localStorage.setItem(
    "preferred_currency_updated_at",
    new Date().toISOString()
  );
}

/* ================= LOAD PREFERENCE ================= */

export function loadCurrencyPreference(): Currency {
  const saved =
    localStorage.getItem(
      "preferred_currency"
    ) as Currency | null;

  if (
    saved &&
    exchangeRates[saved]
  ) {
    return saved;
  }

  return detectPreferredCurrency();
}

/* ================= AUDIT ================= */

export function auditCurrencyChange(
  currency: Currency
) {
  try {
    const logs = JSON.parse(
      localStorage.getItem(
        "currency_audit_logs"
      ) || "[]"
    );

    logs.push({
      currency,

      timestamp:
        new Date().toISOString(),

      timezone:
        Intl.DateTimeFormat()
          .resolvedOptions()
          .timeZone,

      locale:
        navigator.language,
    });

    localStorage.setItem(
      "currency_audit_logs",
      JSON.stringify(logs)
    );
  } catch {}
}

/* ================= FUTURE LIVE FX ================= */

export async function fetchLiveExchangeRates() {
  return exchangeRates;
}

/* ================= TOURISM PRICE ENGINE ================= */

export function calculateTourismTax(
  amount: number
) {
  return amount * 0.15;
}

export function calculateDepositAmount(
  amount: number
) {
  return amount * 0.3;
}

export function calculateRemainingBalance(
  amount: number
) {
  return amount * 0.7;
}