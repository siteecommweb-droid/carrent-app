export function getTranslation(key: string): string {
  const lang = localStorage.getItem("preferredLanguage") || "en";

  const translations: Record<string, Record<string, string>> = {
    en: {
      checkout: "Checkout",
      bookings: "My Bookings",
      pay: "Pay Now",
      total: "Total"
    },
    fr: {
      checkout: "Paiement",
      bookings: "Mes réservations",
      pay: "Payer",
      total: "Total"
    }
  };

  return translations[lang]?.[key] || key;
}




