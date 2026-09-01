import {
  convertFromMUR,
  formatMoney,
  Currency,
  calculateDepositAmount,
  calculateRemainingBalance,
  calculateTourismTax,
} from "./currency";

/* ================= ADDONS ================= */

export interface AddOn {
  key: string;

  priceMUR: number;

  name: string;

  description?: string;

  category?:
    | "insurance"
    | "equipment"
    | "tourism"
    | "luxury"
    | "transfer";

  daily?: boolean;

  featured?: boolean;
}

/* ================= QUOTE RESULT ================= */

export interface QuoteResult {
  days: number;

  subtotal: number;

  discount: number;

  deposit: number;

  payNow: number;

  payAtPickup: number;

  discountRate: number;

  tourismTax: number;

  grandTotal: number;

  savingsAmount: number;

  addOnsTotal: number;

  estimatedFuelCost: number;

  loyaltyPoints: number;

  recommendedInsurance?: string;

  riskLevel?: string;
}

/* ================= DAYS ================= */

function daysBetweenISO(
  startISO: string,
  endISO: string
): number {
  const start =
    new Date(startISO).getTime();

  const end =
    new Date(endISO).getTime();

  if (
    isNaN(start) ||
    isNaN(end)
  ) {
    return 1;
  }

  const diff = Math.ceil(
    (end - start) /
      (1000 * 60 * 60 * 24)
  );

  return Math.max(diff, 1);
}

/* ================= DISCOUNT ================= */

function discountRateForDays(
  days: number
): number {
  if (days >= 30) return 0.25;

  if (days >= 21) return 0.2;

  if (days >= 14) return 0.15;

  if (days >= 7) return 0.1;

  if (days >= 3) return 0.05;

  return 0;
}

/* ================= RISK ================= */

function getRiskLevel(
  grandTotal: number
) {
  if (grandTotal >= 100000)
    return "VIP";

  if (grandTotal >= 50000)
    return "HIGH";

  return "NORMAL";
}

/* ================= INSURANCE ================= */

function getInsuranceRecommendation(
  days: number
) {
  if (days >= 14) {
    return "Premium Full Protection";
  }

  if (days >= 7) {
    return "Enhanced Coverage";
  }

  return "Basic Protection";
}

/* ================= FUEL ESTIMATION ================= */

function estimateFuelCost(
  days: number
) {
  return days * 450;
}

/* ================= LOYALTY ================= */

function calculateLoyaltyPoints(
  grandTotal: number
) {
  return Math.round(
    grandTotal / 100
  );
}

/* ================= MAIN ENGINE ================= */

export function calculateQuote(
  params: {
    dailyRate: number;

    startDate: string;

    endDate: string;

    selectedAddOns?: Record<
      string,
      boolean
    >;

    addOnsList?: AddOn[];

    vipCustomer?: boolean;

    couponCode?: string;
  }
): QuoteResult {
  const {
    dailyRate,

    startDate,

    endDate,

    selectedAddOns = {},

    addOnsList = [],

    vipCustomer = false,

    couponCode,
  } = params;

  const days =
    daysBetweenISO(
      startDate,
      endDate
    );

  let subtotal =
    dailyRate * days;

  let addOnsTotal = 0;

  /* ===== ADDONS ===== */

  for (const addOn of addOnsList) {
    if (
      selectedAddOns[
        addOn.key
      ]
    ) {
      const addonPrice =
        addOn.daily
          ? addOn.priceMUR *
            days
          : addOn.priceMUR;

      subtotal += addonPrice;

      addOnsTotal +=
        addonPrice;
    }
  }

  /* ===== DISCOUNT ===== */

  let discountRate =
    discountRateForDays(
      days
    );

  if (vipCustomer) {
    discountRate += 0.05;
  }

  if (
    couponCode ===
    "AM38VIP"
  ) {
    discountRate += 0.05;
  }

  const discount =
    subtotal *
    discountRate;

  const discountedSubtotal =
    subtotal - discount;

  /* ===== TAX ===== */

  const tourismTax =
    calculateTourismTax(
      discountedSubtotal
    );

  /* ===== GRAND TOTAL ===== */

  const grandTotal =
    discountedSubtotal +
    tourismTax;

  /* ===== PAYMENTS ===== */

  const deposit =
    calculateDepositAmount(
      grandTotal
    );

  const remaining =
    calculateRemainingBalance(
      grandTotal
    );

  /* ===== EXTRA ===== */

  const estimatedFuelCost =
    estimateFuelCost(days);

  const loyaltyPoints =
    calculateLoyaltyPoints(
      grandTotal
    );

  const recommendedInsurance =
    getInsuranceRecommendation(
      days
    );

  const riskLevel =
    getRiskLevel(
      grandTotal
    );

  return {
    days,

    subtotal:
      discountedSubtotal,

    discount,

    deposit,

    payNow: deposit,

    payAtPickup:
      remaining,

    discountRate:
      discountRate * 100,

    tourismTax,

    grandTotal,

    savingsAmount:
      discount,

    addOnsTotal,

    estimatedFuelCost,

    loyaltyPoints,

    recommendedInsurance,

    riskLevel,
  };
}

/* ================= MONEY ================= */

export function money(
  amountMUR: number,
  currency: Currency = "MUR"
): string {
  const converted =
    convertFromMUR(
      amountMUR,
      currency
    );

  return formatMoney(
    converted,
    currency
  );
}

/* ================= LUXURY MONEY ================= */

export function luxuryMoney(
  amountMUR: number,
  currency: Currency = "MUR"
): string {
  const converted =
    convertFromMUR(
      amountMUR,
      currency
    );

  return `✨ ${formatMoney(
    converted,
    currency
  )}`;
}

/* ================= PRICE BADGES ================= */

export function getPricingBadge(
  amount: number
) {
  if (amount >= 100000)
    return "VIP Luxury";

  if (amount >= 50000)
    return "Premium";

  if (amount >= 20000)
    return "Popular";

  return "Budget Friendly";
}

/* ================= TOURISM PACKAGES ================= */

export function getSuggestedTourismPackage(
  days: number
) {
  if (days >= 21) {
    return "Ultimate Mauritius Explorer";
  }

  if (days >= 14) {
    return "Island Adventure";
  }

  if (days >= 7) {
    return "Beach Escape";
  }

  return "Quick Discovery";
}