import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from "react";

export type Lang = "en" | "fr";

type LanguageContextType = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  availableLanguages: { code: Lang; name: string; flag: string }[];
  isRTL: boolean;
};

const translations: Record<Lang, Record<string, string>> = {
  en: {
    home: "Home", fleet: "Fleet", partners: "Partners", about: "About Us",
    faq: "FAQ", support: "Support", login: "Login", register: "Register",
    logout: "Logout", bookNow: "Book Now", pricePerDay: "Price per day",
    total: "Total", seats: "Seats", fuel: "Fuel", transmission: "Transmission",
    back: "← Back", onlyLeft: "Only", left: "left", peopleViewing: "people viewing",
    bestChoice: "🔥 Best choice", lowRisk: "🛡 Low risk booking", profit: "Profit",
    score: "Score", whyThisCar: "Why this car?", highDemand: "✔ High demand vehicle",
    strongRating: "✔ Strong customer rating", reliableSupplier: "✔ Reliable supplier",
    addOns: "Add-ons", addOnsTotal: "Add-ons total", youSave: "💸 You save",
    secureBooking: "✔ Secure booking", freeCancellation: "✔ Free cancellation",
    supportAvailable: "✔ Support available", share: "Share", wishlist: "Add to wishlist",
    unlimitedMiles: "Unlimited miles", roadside: "24/7 Roadside assistance",
    gallery: "Vehicle Gallery", customerReviews: "Customer Reviews",
    similarVehicles: "Similar Vehicles", rentalPolicies: "Rental Policies",
    minAge: "Minimum age: 21", passportRequired: "Passport required",
    licenseRequired: "Driving licence required", airportDelivery: "Airport delivery available",
    freeCancelPolicy: "Free cancellation 48h before pickup",
    unlimitedMileage: "Unlimited mileage included", emergencySupport: "Emergency support",
  },
  fr: {
    home: "Accueil", fleet: "Flotte", partners: "Partenaires", about: "À propos",
    faq: "FAQ", support: "Support", login: "Connexion", register: "S'inscrire",
    logout: "Déconnexion", bookNow: "Réserver", pricePerDay: "Prix par jour",
    total: "Total", seats: "Places", fuel: "Carburant", transmission: "Transmission",
    back: "← Retour", onlyLeft: "Plus que", left: "disponibles",
    peopleViewing: "personnes regardent", bestChoice: "🔥 Meilleur choix",
    lowRisk: "🛡 Réservation à faible risque", profit: "Profit", score: "Score",
    whyThisCar: "Pourquoi cette voiture?", highDemand: "✔ Véhicule très demandé",
    strongRating: "✔ Excellente note client", reliableSupplier: "✔ Fournisseur fiable",
    addOns: "Options", addOnsTotal: "Total options", youSave: "💸 Vous économisez",
    secureBooking: "✔ Réservation sécurisée", freeCancellation: "✔ Annulation gratuite",
    supportAvailable: "✔ Support disponible", share: "Partager",
    wishlist: "Ajouter aux favoris", unlimitedMiles: "Kilométrage illimité",
    roadside: "Assistance 24/7", gallery: "Galerie", customerReviews: "Avis clients",
    similarVehicles: "Véhicules similaires", rentalPolicies: "Conditions",
    minAge: "Âge minimum : 21 ans", passportRequired: "Passeport requis",
    licenseRequired: "Permis requis", airportDelivery: "Livraison aéroport",
    freeCancelPolicy: "Annulation gratuite 48h avant",
    unlimitedMileage: "Kilométrage illimité inclus", emergencySupport: "Assistance urgente",
  },
};

const availableLanguages = [
  { code: "en" as Lang, name: "English", flag: "🇬🇧" },
  { code: "fr" as Lang, name: "Français", flag: "🇫🇷" },
];

const LanguageContext = createContext<LanguageContextType>({
  lang: "en", setLang: () => {}, t: (key) => key, availableLanguages, isRTL: false,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(
    (localStorage.getItem("preferredLanguage") as Lang) || "en"
  );

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem("preferredLanguage", newLang);
    document.documentElement.lang = newLang;
  };

  const t = (key: string): string => {
    return translations[lang]?.[key] || translations.en[key] || key;
  };

  const isRTL = false;

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo(
    () => ({ lang, setLang, t, availableLanguages, isRTL }),
    [lang, setLang, t, isRTL]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() { return useContext(LanguageContext); }