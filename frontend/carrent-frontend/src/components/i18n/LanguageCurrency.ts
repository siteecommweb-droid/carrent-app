export const currencies: Record<string, number> = {
  MUR: 1,
  EUR: 0.02,
  USD: 0.022,
  GBP: 0.017,
  INR: 1.86,
  AED: 0.081,
  ZAR: 0.41,
  AUD: 0.034,
  CAD: 0.03,
  CHF: 0.02,
  CNY: 0.16,
  JPY: 3.33,
  SGD: 0.029,
};

export function convert(amount: number, currency: string) {
  return amount * (currencies[currency] || 1);
}







