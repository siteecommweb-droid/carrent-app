import { useCurrency } from "../lib/currency-context";

export default function CurrencySelect() {
  const { currency, setCurrency } = useCurrency();

  return (
    <select
      value={currency}
      onChange={(e) => setCurrency(e.target.value as any)}
      className="bg-white/10 text-white border border-white/20 rounded-full px-3 py-2 text-sm"
    >
      <option value="MUR">MUR</option>
      <option value="USD">USD</option>
      <option value="EUR">EUR</option>
      <option value="GBP">GBP</option>
      <option value="JPY">JPY</option>
    </select>
  );
}












