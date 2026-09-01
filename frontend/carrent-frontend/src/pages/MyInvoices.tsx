import { useEffect, useState } from "react";
import { useCurrency } from "@/context/CurrencyContext";

export default function MyInvoices() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { formatPrice } = useCurrency();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/invoices`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setInvoices(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-10 text-white text-center">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-10 space-y-6 text-white">
      <h1 className="text-3xl font-black">My Invoices</h1>

      {invoices.length === 0 && <div>No invoices</div>}

      {invoices.map((inv) => (
        <div key={inv.id} className="bg-black/30 p-6 rounded-xl space-y-3">
          <div className="font-bold text-xl">
            {inv.invoice_number}
          </div>

          <div>{inv.total_amount}</div>
          <div>Status: {inv.status}</div>

          <a
            href={`${import.meta.env.VITE_API_URL}/invoices/${inv.id}/pdf`}
            target="_blank"
            className="text-blue-400 underline"
          >
            Download PDF
          </a>
        </div>
      ))}
    </div>
  );
}
