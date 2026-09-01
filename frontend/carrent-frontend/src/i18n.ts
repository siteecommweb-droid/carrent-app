import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      nav: {
        fleet: "Fleet",
        explore: "Explore",
        partners: "partners",
        faq: "FAQ",
        about: "About",
        support: "Support",
        myBookings: "My Bookings",
        myInvoices: "My Invoices",
        dashboard: "Dashboard",
        reservations: "Reservations",
        fleetPlanner: "Fleet Planner",
        tickets: "Tickets",
        invoices: "Invoices",
        inbox: "Inbox",
        analytics: "Analytics",
        login: "Login",
        register: "Register",
        logout: "Logout"
      }
    }
  },
  fr: {
    translation: {
      nav: {
        fleet: "Flotte",
        explore: "Explorer",
        partners: "Partenaires",
        faq: "FAQ",
        about: "À propos",
        support: "Support",
        myBookings: "Mes réservations",
        myInvoices: "Mes factures",
        dashboard: "Tableau de bord",
        reservations: "Réservations",
        fleetPlanner: "Planificateur",
        tickets: "Tickets",
        invoices: "Factures",
        inbox: "Boîte de réception",
        analytics: "Analytique",
        login: "Connexion",
        register: "Inscription",
        logout: "Déconnexion"
      }
    }
  },
  de: {
    translation: {
      nav: {
        fleet: "Flotte",
        explore: "Entdecken",
        partners: "Partner",
        faq: "FAQ",
        about: "Über uns",
        support: "Support",
        myBookings: "Meine Buchungen",
        myInvoices: "Meine Rechnungen",
        dashboard: "Dashboard",
        reservations: "Reservierungen",
        fleetPlanner: "Flottenplaner",
        tickets: "Tickets",
        invoices: "Rechnungen",
        inbox: "Posteingang",
        analytics: "Analysen",
        login: "Anmelden",
        register: "Registrieren",
        logout: "Abmelden"
      }
    }
  },
  it: {
    translation: {
      nav: {
        fleet: "Flotta",
        explore: "Esplora",
        partners: "Partner",
        faq: "FAQ",
        about: "Chi siamo",
        support: "Supporto",
        myBookings: "Mie prenotazioni",
        myInvoices: "Mie fatture",
        dashboard: "Pannello",
        reservations: "Prenotazioni",
        fleetPlanner: "Pianificatore flotta",
        tickets: "Ticket",
        invoices: "Fatture",
        inbox: "Posta in arrivo",
        analytics: "Analisi",
        login: "Accedi",
        register: "Registrati",
        logout: "Esci"
      }
    }
  },
  hi: {
    translation: {
      nav: {
        fleet: "बेड़ा",
        explore: "अन्वेषण करें",
        partners: "साझेदार",
        faq: "प्रश्नोत्तरी",
        about: "हमारे बारे में",
        support: "सहायता",
        myBookings: "मेरी बुकिंग",
        myInvoices: "मेरे चालान",
        dashboard: "डैशबोर्ड",
        reservations: "आरक्षण",
        fleetPlanner: " बेड़ा योजनाकार",
        tickets: "टिकट",
        invoices: "चालान",
        inbox: "इनबॉक्स",
        analytics: "विश्लेषण",
        login: "लॉगिन",
        register: "पंजीकरण",
        logout: "लॉगआउट"
      }
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("preferredLanguage") || "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false }
});

export default i18n;