import { createContext, useContext, useState, ReactNode, useCallback, useMemo, useEffect } from "react";

export type SearchResult = {
  id: string;
  title: string;
  description: string;
  path: string;
  icon: string;
  category: "page" | "action" | "vehicle" | "place" | "partner";
  keywords?: string[];
};

interface SpotlightContextType {
  isOpen: boolean;
  openSpotlight: () => void;
  closeSpotlight: () => void;
  toggleSpotlight: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  results: SearchResult[];
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
}

const SpotlightContext = createContext<SpotlightContextType | undefined>(undefined);

const SEARCH_DATA: SearchResult[] = [
  { id: "page-home", title: "Home", description: "Return to homepage", path: "/", icon: "🏠", category: "page" },
  { id: "page-fleet", title: "Fleet", description: "Browse all vehicles", path: "/cars", icon: "🚗", category: "page" },
  { id: "page-explore", title: "Explore Mauritius", description: "Discover beaches, mountains, activities", path: "/explore", icon: "🌴", category: "page" },
  { id: "page-about", title: "About Us", description: "Learn about AM38", path: "/about", icon: "ℹ️", category: "page" },
  { id: "page-partners", title: "Partners", description: "Our trusted partners", path: "/partners", icon: "🤝", category: "page" },
  { id: "page-faq", title: "FAQ", description: "Frequently asked questions", path: "/faq", icon: "❓", category: "page" },
  { id: "page-support", title: "Support", description: "Contact us", path: "/support", icon: "💬", category: "page" },
  { id: "action-book", title: "Book a Car", description: "Start booking process", path: "/cars", icon: "📅", category: "action", keywords: ["rent", "reserve"] },
  { id: "action-fleet", title: "View Fleet", description: "See all available vehicles", path: "/cars", icon: "🚙", category: "action", keywords: ["cars", "vehicles"] },
  { id: "action-explore", title: "Explore Island", description: "Plan your Mauritius trip", path: "/explore", icon: "🏝️", category: "action", keywords: ["trip", "vacation"] },
  { id: "action-contact", title: "Contact Support", description: "Get help 24/7", path: "/support", icon: "📞", category: "action", keywords: ["help", "assistance"] },
  { id: "vehicle-vitara", title: "Suzuki Vitara", description: "SUV • 5 seats • From Rs 2200/day", path: "/cars", icon: "🚙", category: "vehicle", keywords: ["vitara", "suv"] },
  { id: "vehicle-vitz", title: "Toyota Vitz", description: "Economy • 5 seats • From Rs 1200/day", path: "/cars", icon: "🚗", category: "vehicle", keywords: ["vitz", "economy"] },
  { id: "vehicle-swift", title: "Suzuki Swift", description: "Economy • 5 seats • From Rs 1500/day", path: "/cars", icon: "🚗", category: "vehicle", keywords: ["swift", "suzuki"] },
  { id: "vehicle-ertiga", title: "Suzuki Ertiga", description: "7 Seater • 7 seats • From Rs 3000/day", path: "/cars", icon: "🚐", category: "vehicle", keywords: ["ertiga", "7 seater"] },
  { id: "place-le-morne", title: "Le Morne Beach", description: "UNESCO site • Kitesurfing paradise", path: "/explore", icon: "🏖️", category: "place", keywords: ["morne", "beach"] },
  { id: "place-ganga-talao", title: "Ganga Talao", description: "Sacred Hindu site • Pilgrimage", path: "/explore", icon: "🕉️", category: "place", keywords: ["ganga", "temple"] },
  { id: "place-seven-colors", title: "Seven Colored Earths", description: "Geological wonder • Chamarel", path: "/explore", icon: "🌈", category: "place", keywords: ["seven", "colors"] },
  { id: "place-port-louis", title: "Port Louis", description: "Capital city • Markets • History", path: "/explore", icon: "🏙️", category: "place", keywords: ["port louis", "capital"] },
  { id: "partner-discovercars", title: "Discover Cars", description: "Global car rental marketplace", path: "/partners", icon: "🚗", category: "partner", keywords: ["discover", "cars"] },
];

export function SpotlightProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const openSpotlight = useCallback(() => {
    console.log("openSpotlight called!");
    setIsOpen(true);
    setSearchQuery("");
    setSelectedIndex(0);
  }, []);

  const closeSpotlight = useCallback(() => {
    console.log("closeSpotlight called!");
    setIsOpen(false);
    setSearchQuery("");
  }, []);

  const toggleSpotlight = useCallback(() => {
    if (isOpen) {
      closeSpotlight();
    } else {
      openSpotlight();
    }
  }, [isOpen, openSpotlight, closeSpotlight]);

  // Listen for custom event
  useEffect(() => {
    const handleCustomEvent = () => {
      console.log("Custom event received!");
      openSpotlight();
    };
    document.addEventListener("open-spotlight", handleCustomEvent);
    return () => {
      document.removeEventListener("open-spotlight", handleCustomEvent);
    };
  }, [openSpotlight]);

  const results = useMemo(() => {
    if (!searchQuery.trim()) {
      return SEARCH_DATA.slice(0, 8);
    }
    const query = searchQuery.toLowerCase().trim();
    return SEARCH_DATA
      .filter(item => {
        const searchable = [
          item.title.toLowerCase(),
          item.description.toLowerCase(),
          ...(item.keywords || []).map(k => k.toLowerCase())
        ].join(" ");
        return searchable.includes(query);
      })
      .slice(0, 12);
  }, [searchQuery]);

  return (
    <SpotlightContext.Provider
      value={{
        isOpen,
        openSpotlight,
        closeSpotlight,
        toggleSpotlight,
        searchQuery,
        setSearchQuery,
        results,
        selectedIndex,
        setSelectedIndex,
      }}
    >
      {children}
    </SpotlightContext.Provider>
  );
}

export function useSpotlight() {
  const context = useContext(SpotlightContext);
  if (!context) {
    throw new Error("useSpotlight must be used within SpotlightProvider");
  }
  return context;
}